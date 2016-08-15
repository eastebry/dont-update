Cursor = function(game){
    Phaser.Sprite.call(this, game, 0, 0, 'cursor');
    this.game = game;
    this.heath = 0; // will be set before the boss
    this.scale.setTo(.04, .04);
    this.state = 0; //0 = playing, 1= hit, 2=dead
    game.physics.enable([this], Phaser.Physics.ARCADE);
}

Cursor.prototype = Object.create(Phaser.Sprite.prototype);
Cursor.prototype.constructor = Cursor;;

Cursor.prototype.update = function() {

    if (this.state == 2){
        this.alpha = 0;
    }

    this.x = game.input.mousePointer.x;
    this.y = game.input.mousePointer.y;
    this.bringToTop();
}

Cursor.prototype.canClick = function(){
    return this.state == 0;
}

Cursor.prototype.hit = function(){
    if (this.state != 0)
        return;
    
    game.camera.flash(0xff0000, 500);

    this.hittimer = this.game.time.events.loop(150, function(){
        if (this.alpha == .5){
            this._visible = false;
            this.alpha = 0;
        }
        else {
            this.alpha = .5;
        }
    }, this);
    this.state = 1;
    
    this.health -= 5;
    if (this.health <= 0){
        this.die();
        return;
    }
    
    this.game.time.events.add(Phaser.Timer.SECOND * 2, function(){
        game.time.events.remove(this.hittimer);
        this.alpha = 1;
        this.state = 0;
    }, this);
}

Cursor.prototype.die = function(){
    this.state = 2;
}
