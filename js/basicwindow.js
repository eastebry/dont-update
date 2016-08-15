BasicWindow = function(x, y, params){
    Phaser.Sprite.call(this, game, x, y, 'updateWindow');
    this.inputEnabled = true;
    this.input.enableDrag(false, true);
    
    if (params['top_message']){
        this.addChild(createTextbox(params['top_message'], -110, -130, WHITE_HEADER_FONT));
    }
    if (params['middle_message']){
        this.addChild(createTextbox(params['middle_message'], -180, -70, WHITE_MIDDLE_FONT));
    }
    if (params['bottom_message']){
        this.addChild(createTextbox(params['bottom_message'], -180, 60, BLACK_BOTTOM_TEXT));
    }

    var close_fn;
    if (params['close_fn'])
        close_fn = function(){this.destroy(); params['close_fn']();}
    else
        close_fn = this.destroy;
    
    if (params['type'] == 'two_button'){
        this.addChild(createButton(-100, 120, params['lb_text'], lose, this));
        this.addChild(createButton(100, 120, params['rb_text'],  close_fn, this));
    }
    game.add.existing(this);
    this.tween = createWindowEnterTween(this);
}


BasicWindow.prototype.destroy = function() {
    this.tween.stop();
    Phaser.Sprite.prototype.destroy.call(this);
};

BasicWindow.prototype = Object.create(Phaser.Sprite.prototype);
BasicWindow.prototype.constructor = BasicWindow;
