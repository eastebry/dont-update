// The notepad that you type in.
var Notepad = function(game, parentGroup, x, y) {
    this.typingText = game.cache.getText('typingText');
    this.startIndex = 0;
    this.endIndex = 250;
    this.maxRows = 18;
    this.parentGroup = parentGroup;
    this.font_style = {
        font: "12px Arial",
        fill: "#000000",
        wordWrap: true,
        wordWrapWidth: 500,
        align: 'left',
    };

    //Create the notepad window and the text on top
    this.textbox = createTextbox(this.typingText.substring(this.startIndex, this.endIndex), 22, 53, this.font_style);
    this.sprite = createWindow(
        x,
        y, 
        'notepad', 
        [this.textbox],
        true
    );
}

Notepad.prototype.keyPressed = function() {
    if (!this.isFocused())
        return
    this.endIndex += 1;
    // hacky scrolling
    var lines = this.textbox.runWordWrap(this.typingText.substring(this.startIndex, this.endIndex)).split(/(?:\r\n|\r|\n)/);
    if (lines.length > this.maxRows){
        this.startIndex += lines[0].length;
    }
    this.textbox.text = this.typingText.substring(this.startIndex, this.endIndex);
    score += 1;
};

Notepad.prototype.isFocused = function(){
    return this.parentGroup.children[this.parentGroup.children.length - 1] === this.sprite;
}
