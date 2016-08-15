var WindowPane = function(game, sprite, x, y){
	Phaser.Sprite.call(this, game, x, y, sprite);
	this.x = x;
	this.y = y;
}


WindowPane.prototype = Phaser.Utils.extend(true, Phaser.Sprite.prototype, PIXI.Sprite.prototype);
WindowPane.prototype.constructor = WindowPane;

/** * Automatically called by World.update */
WindowPane.prototype.update = function() {};
