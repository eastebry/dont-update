CountDownWindow = function(x, y, seconds, message, finishFunction, contents){
    Phaser.Sprite.call(this, game, x, y, 'updateWindow');
    this.inputEnabled = true;
    this.input.enableDrag(false, true);
    this.seconds = seconds;

    var text = createTextbox(message + seconds + " seconds", -180, -70, WHITE_MIDDLE_FONT);
    this.addChild(text);
    var tickFunction = function(seconds){
        text.setText(message +  seconds + " seconds");
    }
    this.timer = countDown(this.seconds, tickFunction, finishFunction);
    // make this once 
    this.tween = createWindowEnterTween(this);
    var _this = this;
    contents.forEach(function(child){
        _this.addChild(child);
    });
    game.add.existing(this);
}

CountDownWindow.prototype = Object.create(Phaser.Sprite.prototype);
CountDownWindow.prototype.constructor = CountDownWindow;

CountDownWindow.prototype.destroy = function() {
    this.tween.stop();
    game.time.events.remove(this.timer);
    Phaser.Sprite.prototype.destroy.call(this);
};


function countDown(seconds, tickFunction, finishFunction){
    var timer = game.time.events.loop(1000, function(){
        seconds -= 1;
        if (seconds >= 0 )
            tickFunction(seconds);
        else
            finishTimer();
    }, this);

    function finishTimer(){
        finishFunction();
        game.time.events.remove(timer);
    }
    return timer;
}
