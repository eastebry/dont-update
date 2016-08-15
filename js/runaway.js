RunawayWindow = function(x, y, text, close_function){
    CountDownWindow.call(this, x, y, 15, text + "\n", lose, []); 
    this.addChild(createButton(0, 90, 'Cancel', this.destroy, this));
    this.state = -1; // -1 = initial,0 = stopped, 1 = moving
    this.speed = 8;
    this.auxDirection = 1;
    this.close_function = close_function;
}

RunawayWindow.prototype = Object.create(CountDownWindow.prototype);
RunawayWindow.prototype.constructor = RunawayWindow;

RunawayWindow.prototype.destroy = function() {
    if (this.close_function) {
        this.close_function(); 
    }
    CountDownWindow.prototype.destroy.call(this);
}

RunawayWindow.prototype.update = function(){
    CountDownWindow.prototype.update.call(this);
    if (Math.floor(Math.random() * 100) == 42)
        this.auxDirection *= -1;
    var mouseDist = Math.sqrt(Math.pow(this.x - game.input.mousePointer.x, 2) +
            Math.pow(this.y - game.input.mousePointer.y, 2));
    if (this.state == -1 && mouseDist < 150)
        this.state = 1

    if (this.state == 0 && mouseDist < 250)
        this.state = 1

    if (this.state == 1) {
        if (mouseDist > 800)
            this.state = 0;
        var mouseAngle = Math.atan2(this.y - game.input.mousePointer.y, this.x - game.input.mousePointer.x);
        var auxAngle = Math.atan2(this.y - game.world.centerY, this.x - game.world.centerX) 
            + this.auxDirection* Math.PI;
        var speed = this.speed + (800 - mouseDist)/50;
        var xDist = speed * Math.cos(mouseAngle) + speed/2 * Math.cos(auxAngle);
        var yDist = speed * Math.sin(mouseAngle) + speed/2 * Math.sin(auxAngle);
        this.x = Math.max(0, Math.min(game.width, this.x + xDist));
        this.y = Math.max(0, Math.min(game.height,this.y + yDist));
    }
};

