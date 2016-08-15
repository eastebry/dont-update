var WHITE_HEADER_FONT = {font: "20px Arial", fill: "white"};
var BUTTON_FONT = {font: "16px Arial", fill: "#000000"};  
var SMALL_BUTTON_FONT = {font: "11px Arial", fill: "#000000", wordWrap: true, wordWrapWidth: 140};
var WHITE_MIDDLE_FONT = {font: "28px Arial", fill: "white", wordWrap: true, wordWrapWidth: 300};
var BLACK_BOTTOM_TEXT = {fill: "#000000", font: "16px Arial"};

function setRefocusWindowTimer(theWindow, windowGroup, refocusTime, delta=0, minRefocusTime=2){
    /* Ensure that theWindow`is refocused every refocuseTime.
     * If `delta` is set, the next refocusTime will be refocusTime - delta
     * (meant for counting down), until minRefocus time is reached
    */
    function refocus(){
        if (!theWindow.exists){
            // stop setting the time once the window is destroyed
            return
        }
        // rely on windowGroup to be in scope
        var topWindow = windowGroup.children[windowGroup.children.length - 1];
        if (topWindow != theWindow){
            // center the window
            theWindow.x = game.world.centerX;
            theWindow.y = game.world.centerY;
            // bring to front
            windowGroup.swap(topWindow, theWindow);
            createWindowEnterTween(theWindow);
            refocusTime = Math.max(refocusTime - delta, minRefocusTime);
        }
        setRefocusWindowTimer(theWindow, windowGroup, refocusTime, delta, minRefocusTime);
    }
    game.time.events.add(Phaser.Timer.SECOND * refocusTime, refocus);
}


function createUpdateWindow(x, y, top_message, middle_message, bottom_message, contents){
    var top_text = createTextbox(top_message, -110, -130, WHITE_HEADER_FONT);
    var middle_text = createTextbox(middle_message, -180, -70, WHITE_MIDDLE_FONT);
    var bottom_text = createTextbox(bottom_message, -180, 60, BLACK_BOTTOM_TEXT);
    var newWindow = createWindow(x, y, 'updateWindow', contents.concat([top_text, middle_text, bottom_text]));
    return newWindow;
}

function createWindowEnterTween(newWindow){
    newWindow.scale.set(0);
    // TODO: this should really be down in the createWindow area
    newWindow.anchor.set(0.5);
    return game.add.tween(newWindow.scale).to( { x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true); 
}

function createTextbox(text, x, y, style){
    textbox = game.add.text(x, y, text, style);
    return textbox;
}

function createWindow(x, y, sprite, content, draggable=true){
    /*
     * Create a new window
     * @param x: x position of the new window
     * @param y: y position of the new window
     * @param sprite: sprite to use for the window
     * @param content: array of content to add to the window as children
     * @param draggable: 
     */
    var newWindow = windowGroup.create(x, y, sprite);
    if (draggable){
        newWindow.inputEnabled = true;
        newWindow.input.enableDrag(false, true);
    }
    content.forEach(function(child){
        newWindow.addChild(child);
    });
    return newWindow;
}

function createButton(x, y, text, clickHandler, context=null, fontStyle=null){
    if (fontStyle == null)
        fontStyle = BUTTON_FONT; 
    var text = createTextbox(text, 0, 0, fontStyle);
    // TODO: doing this seems to make the text a little blurry. Kinda annoying
    text.anchor.setTo(0.5, 0.5);
    // Buttons don't seem to work when they are set as children
    var button = game.add.button(x, y, 'button01', clickHandler, context || this, 1, 0, 1, 0);
    button.input.priorityID = 1;
    button.input.useHandCursor = false;
    button.addChild(text);
    button.anchor.setTo(0.5, 0.5);
    return button;
}

