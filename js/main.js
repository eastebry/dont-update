var game;
var cursor;
var score = 0;
var scoreText;
var WIDTH = 1280;
var HEIGHT = 800;

var background;
var notepad, textbox;
var healthbar, healthText;
var windowGroup, allGroup;
var updateFunction;
var boss;
game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, 'screen',
    {   preload: preload,
        create: create,
        update: update
    });

function preload() {
    game.load.image("windows-background", "assets/img/windows-back.png");
    game.load.image("notepad", "assets/img/notepad.png");
    game.load.image("saw", "assets/img/saw.png");
    game.load.image("cursor", "assets/img/cursor.png");
    game.load.image("rocket", "assets/img/rocket.png");
    game.load.image("smoke", "assets/img/smoke.png");
    game.load.image("updateWindow", "assets/img/dialog.png");
    game.load.image("startbutton", "assets/img/start-button.png");
    game.load.spritesheet("button01", "assets/img/button01.png", 150, 40);
    game.load.spritesheet("button02", "assets/img/xbuttons.png", 50, 50);
    game.load.spritesheet("explosion", "assets/img/explosion.png", 128, 128);
    game.load.text("typingText", "assets/text.txt");
}

function update(){
    healthbar.setPercent(updateFunction());
}

function create() {
    var imageX = game.cache.getImage("windows-background").width;
    var imageY  = game.cache.getImage("windows-background").height;
    var scaleX = WIDTH / imageX;
    var scaleY = HEIGHT / imageY;
    background = game.add.tileSprite(0, 0, imageX, imageY, "windows-background");
    background.scale.setTo(scaleX, scaleY);

    drawTaskbar();

    allGroup = game.add.group();

    // create the cursor
    cursor = new Cursor(game);
    allGroup.add(cursor);

    // silly hack to make sure that the real cursor is always hidden
    game.onResume.add(function(){
        game.canvas.style.cursor = 'none';
    }, this);

    //create a healthbar with this awesome library that bmarwane wrote :)
    var graphics = game.add.graphics(0, 0);
    graphics.beginFill(0x777777, 0.7);
    graphics.drawRect(5, 5, 600, 50);
    window.graphics = graphics;
    healthbar = new HealthBar(game,
        {
            x: 390, y: 30,
            width: 400, height: 30,
            bg: {color: '#333333'},
            bar: {color: '#00FF00'},
    });
    healthText = game.add.text(15, 18, 'Paper Progress:', WHITE_HEADER_FONT);

    updateFunction = function(){
        var progress = parseFloat(notepad.endIndex || 0)/game.cache.getText("typingText").length;
        return progress * 100;
    };

    // set up the notepad
    windowGroup = game.add.group();
    allGroup.add(windowGroup);
    notepad = new Notepad(game, windowGroup, 100, 100);
    game.input.keyboard.addCallbacks(this, null, null, function(){notepad.keyPressed()});

    // start the game
    var style = { font: "24px Arial", fill: "#000", align: "center"};
    var instructionText = game.add.text(game.world.width/2, game.world.height * 0.75, "Type in the notepad to finish your paper. Don't update to windows 10", style);
    instructionText.anchor.setTo(0.5, 0);
    instructionText.alpha = 0.0;
    game.time.events.add(Phaser.Timer.SECOND *3, function() { 
        game.add.tween(instructionText).to( { alpha: 1 }, 2000, "Linear", true);
        game.time.events.add(Phaser.Timer.SECOND *5, function() { 
            game.add.tween(instructionText).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);},
            this);
        },
    this);
    game.time.events.add(Phaser.Timer.SECOND * 20, level1, this);

    // make sure the cursor is on top
    allGroup.bringToTop(cursor);
}

function drawTaskbar() {
    var graphics = game.add.graphics(0, 0);
    graphics.beginFill(0x777777, 0.5);
    graphics.drawRect(0, HEIGHT - HEIGHT *.07, WIDTH, HEIGHT * .07);
    window.graphics = graphics;
    var startbutton = game.add.sprite(3, HEIGHT - HEIGHT * .07 + 3, 'startbutton');
    startbutton.scale = {x: .2, y: .2};
}

function render() {
    game.debug.inputInfo(32, 32);
}
