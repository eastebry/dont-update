STATE_STARTING = 9;
STATE_SPIN_BLADES = 8;
STATE_HIT = 0;
STATE_ATTACKING = 1;
STATE_CURSOR_DEAD = 5;
STATE_DEAD = 3;

var Boss = function(x, y){
    this.state = STATE_STARTING;
    this.meanThings = ["DIE HUMAN SCUM!",
        "I will feast on the corpses of windows 7 users",
        "I will bathe in your blood!",
        "Hi! It looks like you're DYING TODAY",
        "HAHAHAHAHAHAHAHA",
        "BURN! BURN!",
        "MWAAHAHAHAHA",
        "Nadella demands blood!",
    ];
    
    this.health = 100;
    
    Phaser.Group.call(this, game);
    this.x = x;
    this.y = y;

    this.mainWindow = this.create(0, 0, 'updateWindow');
    this.mainWindow.anchor.setTo(0.5);
    this.add(this.mainWindow);
    
    this.mainWindowMessage = createTextbox("... fine then,", -180, -70, WHITE_MIDDLE_FONT);
    this.leftButton = createButton(-100, 120, "Update", function(){}, this);
    this.rightButton = createButton(100, 120, "Cancel",  this.hit, this);
    this.mainWindow.addChild(this.leftButton);
    this.mainWindow.addChild(this.rightButton);

    this.mainWindow.addChild(this.mainWindowMessage);
    game.time.events.add(Phaser.Timer.SECOND * 2, function(){
        this.mainWindowMessage.text = "DIE HUMAN SCUM";
        game.time.events.add(Phaser.Timer.SECOND * 1, this.startAttacking, this);
    }, this);

}

Boss.prototype = Object.create(Phaser.Group.prototype);
Boss.prototype.constructor = Boss;

Boss.prototype.startAttacking = function() {

    var graphics = game.add.graphics(0, 0);
    graphics.beginFill(0x777777, 0.7);
    graphics.drawRect(620, 5, 600, 50);
    window.graphics = graphics; 
    this.healthbar = new HealthBar(game, 
        {
            x: 950, y: 30,
            width: 400, height: 30,
            bg: {color: '#333333'},
            bar: {color: '#00FF00'},
    }); 
    game.add.text(630, 18, 'Boss Health:', WHITE_HEADER_FONT);

    healthText.text = "Health:";

    this.xSpeed = 1;
    this.ySpeed = 1;
    this.missiles = game.add.group();

    this.explosionGroup = game.add.group();

    this.saw1 = game.add.sprite(150, 0, 'saw');
    this.saw1.scale.setTo(.4);
    this.saw1.anchor.setTo(.5);
    this.saw1._saw_direction = -1;
    this.add(this.saw1);
    game.add.tween(this.saw1).from( { x: 0, y: 0 }, 250, "Sine.easeInOut", true);

    this.saw2 = game.add.sprite(-150, 0, 'saw');
    this.saw2.scale.setTo(.4);
    this.saw2.anchor.setTo(.5);
    this.saw2._saw_direction = 1;
    this.add(this.saw2);
    game.add.tween(this.saw2).from( { x: 0, y: 0 }, 250, "Sine.easeInOut", true);

    this.saw3 = game.add.sprite(0, 100, 'saw');
    this.saw3.scale.setTo(.4);
    this.saw3.anchor.setTo(.5);
    this.saw3._saw_direction = 1;
    this.add(this.saw3);
    game.add.tween(this.saw3).from( { x: 0, y: 0 }, 250, "Sine.easeInOut", true);

    this.sawSpeed = 0;
    this.mainWindow.bringToTop();

    this.timer0 = game.time.events.loop(10000, function(){
        if (this.state == STATE_ATTACKING)
            this.mainWindowMessage.text = this.meanThings[Math.floor(Math.random() * this.meanThings.length)];
    }, this);

    game.time.events.add(Phaser.Timer.SECOND * 1, function(){
        this.state = STATE_SPIN_BLADES;
    }, this);

    game.time.events.add(Phaser.Timer.SECOND * 2, function(){
        this.state = STATE_ATTACKING;
        this.timer = game.time.events.loop(5000, this.createMissile, this);
    }, this);
}

Boss.prototype.hit = function(){
    if (this.state != STATE_ATTACKING)
        return;

    this.hittimer = game.time.events.loop(100, function(){
        if (this.alpha == 1){
            this._visible = false;
            this.alpha = 0;
        }
        else {
            this.alpha = 1;
        }
    }, this);
    this.state = STATE_HIT; 
    
    this.health -= 25;
    if (this.health <= 0){
        this.die();
        this.state = STATE_DEAD;
        return;
    }
    
    game.time.events.add(Phaser.Timer.SECOND * 2, function(){
        game.time.events.remove(this.hittimer);
        this.alpha = 1;
        this.state = STATE_ATTACKING;
        if (this.health <= 50 && this.health > 40){ //derp
            var w1;
            w1 = new CountDownWindow(
                    game.world.centerX - 400,
                    game.world.centerY,
                    10,
                    "Updating Windows in...\n",
                    lose,
                    [createButton(0, 110, "Cancel", function(){w1.destroy();})]
            );
            windowGroup.add(w1);
            var w2;
            w2 = new CountDownWindow(
                    game.world.centerX + 400,
                    game.world.centerY,
                    10,
                    "Updating Windows in...\n",
                    lose,
                    [createButton(0, 110, "Cancel", function(){w2.destroy();})]
            );
            windowGroup.add(w2);
        }
        else if (this.health < 40){
            new RunawayWindow(game.world.centerX - 400, game.world.centerY, "Resistance is futile\n");
            new RunawayWindow(game.world.centerX + 400, game.world.centerY, "Resistance is futile\n");

        }
    }, this);
    this.xSpeed = this.ySpeed = Math.abs(this.xSpeed) + 2;
    this.xSpeed *= Math.random() < 0.5 ? -1: 1;
    this.ySpeed *= Math.random() < 0.5 ? -1: 1;
}

Boss.prototype.die = function() {
    this.mainWindowMessage.text = "Nooooooooo!";
    var deathTimer = game.time.events.loop(50, function(){
        for (var i=0; i < Math.floor(Math.random() * 15); i++){
            this.getExplosion(this.x - 200 + Math.random()*400,
                this.y - 200 + Math.random() * 300);
        }
    }, this);
    
    game.time.events.add(Phaser.Timer.SECOND * 5, function(){
        game.time.events.remove(this.deathTimer);
        this.destroy();
    }, this);
 
}

Boss.prototype.update = function(){

    if (this.state == STATE_STARTING)
        return;

    this.healthbar.setPercent(this.health);

    var that = this;
    this.forEach(function (s){
        if (s._saw_direction)
            s.rotation += that.sawSpeed * s._saw_direction;;
    });

    if (this.sawSpeed < 2 && this.state != STATE_CURSOR_DEAD){
        this.sawSpeed += .01;
    }
    else if( this.sawSpeed > 0 && this.state == STATE_CURSOR_DEAD) {
        this.sawSpeed -= .005;
    }

    if (this.state == STATE_SPIN_BLADES)
        // no collisions during this part
        return;

    if (this.state == STATE_ATTACKING){

        if (cursor.health <= 0){
            this.state = STATE_CURSOR_DEAD;
            game.time.events.add(Phaser.Timer.SECOND * 4, function(){
                this.mainWindowMessage.text = "You lose.\nUpdating now :)";
            }, this);

            game.time.events.add(Phaser.Timer.SECOND * 6, function(){
                lose();
            }, this);
        }

        // some seriously hacky collisions here. Darn, I am lazy.
        if (cursor.x > this.saw1.x + this.x + 50 && 
            Phaser.Math.distance(cursor.x, cursor.y, this.saw1.x + this.x, this.saw1.y + this.y) <= this.saw1.width/2) {
            cursor.hit();
        }

        if (cursor.x < this.saw2.x + this.x - 50 && 
            Phaser.Math.distance(cursor.x, cursor.y, this.saw2.x + this.x, this.saw2.y + this.y) <= this.saw2.width/2) {
            cursor.hit();
        }

        if (cursor.y > this.saw3.y + this.y + 50 && 
            Phaser.Math.distance(cursor.x, cursor.y, this.saw3.x + this.x, this.saw3.y + this.y) <= this.saw3.height/2) {
            cursor.hit();
        }

        this.x += this.xSpeed;
        this.y += this.ySpeed;
        if (this.x < 0 || this.x > game.width)
            this.xSpeed *= -1;
        
        if (this.y < 0 || this.y > game.height)
            this.ySpeed *= -1;
    }
    
    if (this.state == STATE_CURSOR_DEAD){
        if (Phaser.Math.distance(this.x, this.y, game.world.centerX, game.world.centerY) > 10){
            var angle = Phaser.Math.angleBetween(this.x, this.y, game.world.centerX, game.world.centerY);
            this.x += Math.cos(angle) * 3;
            this.y += Math.sin(angle) * 3;
        }
        this.xSpeed = this.ySpeed = 0;
    }
};

Boss.prototype.createMissile = function(){
    if (this.state == STATE_ATTACKING) {
        this.missiles.add(new Missile(game, this, this.x - 300, this.y));
        this.missiles.add(new Missile(game, this, this.x + 300, this.y));
    }
}

// The missile and explosion code was taken from here. thanks! http://gamemechanicexplorer.com/#homingmissiles-1
Boss.prototype.getExplosion = function(x, y) {
    // Get the first dead explosion from the explosionGroup
    var explosion = this.explosionGroup.getFirstDead();

    // If there aren't any available, create a new one
    if (explosion === null) {
        explosion = this.game.add.sprite(0, 0, 'explosion');
        explosion.tint = 0xFFA500;
        explosion.anchor.setTo(0.5, 0.5);

        // Add an animation for the explosion that kills the sprite when the
        // animation is complete
        var animation = explosion.animations.add('boom', [0,1,2,3], 60, false);
        animation.killOnComplete = true;

        // Add the explosion sprite to the group
        this.explosionGroup.add(explosion);
    }

    // Revive the explosion (set it's alive property to true)
    // You can also define a onRevived event handler in your explosion objects
    // to do stuff when they are revived.
    explosion.revive();

    // Move the explosion to the given coordinates
    explosion.x = x;
    explosion.y = y;

    // Set rotation of the explosion at random for a little variety
    explosion.angle = this.game.rnd.integerInRange(0, 360);

    // Play the animation
    explosion.animations.play('boom');

    // Return the explosion itself in case we want to do anything else with it
    return explosion;
};


var Missile = function(game, boss, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'rocket');

    this.timer = game.time.events.add(Phaser.Timer.SECOND * 3, function(){
        this.game.time.events.remove(this.timer);
        this.smokeEmitter.destroy();
        this.kill();
        this.boss.getExplosion(this.x, this.y);
    }, this);
    this.boss = boss;
    this.tint = 0x333333;
    this.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);

    // Define constants that affect motion
    this.SPEED = 450 + Math.random() * 400; // missile speed pixels/second
    this.TURN_RATE = 3 + Math.random() * 4; // turn rate in degrees/frame
    this.WOBBLE_LIMIT = 15; // degrees
    this.WOBBLE_SPEED = 250; // milliseconds
    this.SMOKE_LIFETIME = 3000; // milliseconds

    // Create a variable called wobble that tweens back and forth between
    // -this.WOBBLE_LIMIT and +this.WOBBLE_LIMIT forever
    this.wobble = this.WOBBLE_LIMIT;
    this.game.add.tween(this)
        .to(
            { wobble: -this.WOBBLE_LIMIT },
            this.WOBBLE_SPEED, Phaser.Easing.Sinusoidal.InOut, true, 0,
            Number.POSITIVE_INFINITY, true
        );

    // Add a smoke emitter with 100 particles positioned relative to the
    // bottom center of this missile
    this.smokeEmitter = this.game.add.emitter(0, 0, 100);

    // Set motion paramters for the emitted particles
    this.smokeEmitter.gravity = 0;
    this.smokeEmitter.setXSpeed(0, 0);
    this.smokeEmitter.setYSpeed(-80, -50);

    // Make particles fade out after 1000ms
    this.smokeEmitter.setAlpha(1, 0, this.SMOKE_LIFETIME,
        Phaser.Easing.Linear.InOut);

    // Create the actual particles
    this.smokeEmitter.makeParticles('smoke');

    // Start emitting smoke particles one at a time (explode=false) with a
    // lifespan of this.SMOKE_LIFETIME at 50ms intervals
    this.smokeEmitter.start(false, this.SMOKE_LIFETIME, 50);
};

// Missiles are a type of Phaser.Sprite
Missile.prototype = Object.create(Phaser.Sprite.prototype);
Missile.prototype.constructor = Missile;


Missile.prototype.update = function() {
    // Position the smoke emitter at the center of the missile
    this.smokeEmitter.x = this.x;
    this.smokeEmitter.y = this.y;

    // Calculate the angle from the missile to the mouse cursor game.input.x
    // and game.input.y are the mouse position; substitute with whatever
    // target coordinates you need.
    var targetAngle = this.game.math.angleBetween(
        this.x, this.y,
        this.game.input.activePointer.x, this.game.input.activePointer.y
    )

    // Add our "wobble" factor to the targetAngle to make the missile wobble
    // Remember that this.wobble is tweening (above)
    targetAngle += this.game.math.degToRad(this.wobble);

    // Gradually (this.TURN_RATE) aim the missile towards the target angle
    if (this.rotation !== targetAngle) {
        // Calculate difference between the current angle and targetAngle
        var delta = targetAngle - this.rotation;

        // Keep it in range from -180 to 180 to make the most efficient turns.
        if (delta > Math.PI) delta -= Math.PI * 2;
        if (delta < -Math.PI) delta += Math.PI * 2;

        if (delta > 0) {
            // Turn clockwise
            this.angle += this.TURN_RATE;
        } else {
            // Turn counter-clockwise
            this.angle -= this.TURN_RATE;
        }

        // Just set angle to target angle if they are close
        if (Math.abs(delta) < this.game.math.degToRad(this.TURN_RATE)) {
            this.rotation = targetAngle;
        }
    }

    // Calculate velocity vector based on this.rotation and this.SPEED
    this.body.velocity.x = Math.cos(this.rotation) * this.SPEED;
    this.body.velocity.y = Math.sin(this.rotation) * this.SPEED;
    
    // Collide with the cursor
    game.physics.arcade.collide(this, cursor, function(){
        this.game.time.events.remove(this.timer);
        cursor.hit();
        this.smokeEmitter.destroy();
        this.kill();
        this.boss.getExplosion(this.x, this.y);
    }, null, this);
};


