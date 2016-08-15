var TIME_BETWEEN_LEVELS = 10 * Phaser.Timer.SECOND;


function level1(count=0){

    var updateWindow = createUpdateWindow(
        game.world.centerX, 
        game.world.centerY, 
        "Get Windows 10", "Windows 10 is coming.\nGet it for free!", 
        "Would you like to update?",
        [
            createButton(-100, 120, "Update", lose),
            createButton(100, 120, "Not now", closePopup),
        ]
    );
    createWindowEnterTween(updateWindow);
    setRefocusWindowTimer(updateWindow, windowGroup, 15, 2, 2);

    function closePopup(){
        updateWindow.destroy();
        if (count > 0){
            // restart the level in 20 seconds
            game.time.events.add(
                TIME_BETWEEN_LEVELS,
                function(){level1(count-1);},
                this
            );
        } 
        else {
            // move on to the next level
            game.time.events.add(
                TIME_BETWEEN_LEVELS,
                level2
            );
        }
    }
}

function level2() {
    var xbutton = game.add.button(180, -130, 'button02', closeWindow, this, 1, 0, 1, 0);
    xbutton.scale.setTo(0.3, 0.3);
    xbutton.input.priorityID = 1;
    xbutton.input.useHandCursor = false;;
    xbutton.anchor.setTo(0.5, 0.5);
    var updateWindow = createUpdateWindow(
        game.world.centerX, 
        game.world.centerY, 
        "Get Windows 10", "Windows 10 is coming.\nGet it for free!", 
        "Ready to update?",
        [
            createButton(-100, 120, "Update", lose),
            createButton(100, 120, "Yes", lose),
            xbutton,
        ]
    );
    function closeWindow(){
        updateWindow.destroy();
        game.time.events.add(TIME_BETWEEN_LEVELS, level3);
    }
    createWindowEnterTween(updateWindow);
    setRefocusWindowTimer(updateWindow, windowGroup, 15, 2, 2);
}

function level3(){
    var updateWindow = createUpdateWindow(
        game.world.centerX, 
        game.world.centerY, 
        "Get Windows 10", "It's time for you to update!",
        "Update now?",
        [
            createButton(-100, 120, "Update later", closeWindow),
            createButton(100, 120, "Yes", lose),
        ]
    );
    function closeWindow(){
        updateWindow.destroy();
        game.time.events.add(TIME_BETWEEN_LEVELS, level4);
    }
    createWindowEnterTween(updateWindow);
    setRefocusWindowTimer(updateWindow, windowGroup, 15, 2, 2);
}

function level4(){
    var xbutton2 = game.add.button(-194, -145, 'button02', closeWindow, this, 1, 0, 1, 0);
    xbutton2.scale.setTo(0.2, 0.2);
    xbutton2.input.priorityID = 1;
    xbutton2.input.useHandCursor = false;
    xbutton2.anchor.setTo(0.5, 0.5);

    var updateWindow = new CountDownWindow(
        game.world.centerX,
        game.world.centerY,
        10,
        "Updating Windows in...\n",
        lose,
        [xbutton2, createButton(0, 110, "Update", lose)]
    );
    windowGroup.add(updateWindow);

    function closeWindow(){
        updateWindow.destroy();
        game.time.events.add(TIME_BETWEEN_LEVELS, level5);
    }
}

function level5(){
    var updateWindow = new CountDownWindow(
        game.world.centerX, 
        game.world.centerY, 
        10,
        "Updating Windows in...\n",
        lose,
        [
            createButton(-100, 120, "Do not not remain unupdated", closeWindow, null, SMALL_BUTTON_FONT),
            createButton(100, 120, "Don't not update now", lose, null, SMALL_BUTTON_FONT),
        ]
    );
    windowGroup.add(updateWindow);
    function closeWindow(){
        updateWindow.destroy();
        game.time.events.add(TIME_BETWEEN_LEVELS, level6);
    }
}

function level6() {
    // Lots of popups - have to click them all
    var timeline = {
        "2": [{x: game.world.centerX - 210, y: game.world.centerY, type: "countdown"}],
        "5": [{x: game.world.centerX + 210, y: game.world.centerY, type: "countdown"}],
        "7": [{x: game.world.centerX - 210, y: game.world.centerY, type: "countdown"}],
        "8": [{x: game.world.centerX, y: game.world.centerY - 200, type: "countdown"}],
        "9": [{x: game.world.centerX, y: game.world.centerY + 200, type: "countdown"}],
        "10": [
            {x: game.world.centerX - 210, y: game.world.centerY - 200, type: "countdown"},
            {x: game.world.centerX + 210, y: game.world.centerY - 200, type: "countdown"},
        ],
        "11": [
            {x: game.world.centerX - 210, y: game.world.centerY, type: "countdown"},
            {x: game.world.centerX + 210, y: game.world.centerY, type: "countdown"},
        ],
        "12": [
            {x: game.world.centerX - 210, y: game.world.centerY + 200, type: "countdown"},
            {x: game.world.centerX + 210, y: game.world.centerY + 200, type: "countdown"},
        ],
        "20": [
            {x: game.world.centerX - 210, y: game.world.centerY - 200, type: "countdown"},
            {x: game.world.centerX + 210, y: game.world.centerY - 200, type: "countdown"},
        ],
        "20.5": [
            {x: game.world.centerX - 210, y: game.world.centerY, type: "trick"},
            {x: game.world.centerX + 210, y: game.world.centerY, type: "countdown"},
        ],
        "21": [
            {x: game.world.centerX - 210, y: game.world.centerY + 200, type: "countdown"},
            {x: game.world.centerX + 210, y: game.world.centerY + 200, type: "countdown"},
        ],
    };

    function randomPopups(number){
        var toReturn = [];
        for (var i = 0; i < number; i++){
            toReturn.push({
                x: game.world.centerX + Math.random() * 300 - Math.random() * 300,
                y: game.world.centerY + Math.random() * 300 - Math.random() * 300,
                type: "countdown"
            });
        }
        return toReturn;
    }

    for (var seconds in timeline){
        for (var i = 0; i < timeline[seconds].length; i++){
            var params = timeline[seconds][i];
            game.time.events.add(Phaser.Timer.SECOND * parseFloat(seconds), function(params){
                // closure abuse :P
                var w;
                if (params['type'] == 'countdown')
                    w = new CountDownWindow(params['x'], params['y'], 10, "Updating Windows in...\n", lose, [createButton(0, 110, "Cancel", function(){w.destroy();})]);
                else
                    w = new CountDownWindow(params['x'], params['y'], 10, "Not Updating in....\n", function(){w.destroy()}, [createButton(0, 110, "Update", lose)]);
                windowGroup.add(w);
            }, this, params);
        } 
    }
    game.time.events.add(Phaser.Timer.SECOND * 40, level7_1);
}


function level7_1(){
    var w = new BasicWindow(game.world.centerX, game.world.centerY, 
        {
            middle_message: "Don't you want to update?",
            bottom_message: "Windows 10 is super great!",
            type: "two_button",
            lb_text: "Update!!!",
            rb_text: "No :(",
            close_fn: level7_2,
        }
    );  
    windowGroup.add(w);
    setRefocusWindowTimer(w, windowGroup, 15, 2, 2);
}

function level7_2(){
    var w = new BasicWindow(game.world.centerX, game.world.centerY, 
        {
            middle_message: "But Windows 10 is fast and sleek!",
            bottom_message: "Seriously, you are missing out!",
            type: "two_button",
            lb_text: "Update",
            rb_text: "No",
            close_fn: level7_3,
        }
    );  
    windowGroup.add(w);
    setRefocusWindowTimer(w, windowGroup, 15, 2, 2);
}
function level7_3(){
    var w = new BasicWindow(game.world.centerX, game.world.centerY, 
        {
            middle_message: "Cortana, fancy new UI, so many great new features!",
            bottom_message: "You will love it!",
            type: "two_button",
            lb_text: "Yay! Features!",
            rb_text: "I don't care",
            close_fn: level7_4,
        }
    );  
    windowGroup.add(w);
    setRefocusWindowTimer(w, windowGroup, 15, 2, 2);
}

function level7_4(){
    var w = new BasicWindow(game.world.centerX, game.world.centerY, 
        {
            middle_message: "Pretty please??",
            bottom_message: "(Don't make me beg)",
            type: "two_button",
            lb_text: "Ok, yes!",
            rb_text: "No",
            close_fn: level7_6,
        }
    );  
    windowGroup.add(w);
    setRefocusWindowTimer(w, windowGroup, 15, 2, 2);
}

function level7_6(){
    var w = new BasicWindow(game.world.centerX, game.world.centerY, 
        {
            middle_message: "...",
            type: "two_button",
            lb_text: "Update",
            rb_text: "Still no",
            close_fn: level7_7,
        }
    );  
    windowGroup.add(w);
    setRefocusWindowTimer(w, windowGroup, 15, 2, 2);
}

function level7_7(){
    var w = new BasicWindow(game.world.centerX, game.world.centerY, 
        {
            middle_message: "... I was trying to be nice before",
            bottom_message: "We can do this this easy way ... or the hard way",
            type: "two_button",
            lb_text: "Update",
            rb_text: "Hard Way",
            close_fn: level7_8,
        }
    );  
    windowGroup.add(w);
    setRefocusWindowTimer(w, windowGroup, 15, 2, 2);
}

function level7_8(){
    var w = new BasicWindow(game.world.centerX, game.world.centerY, 
        {
            middle_message: "Do you really think you have a choice?",
            bottom_message: "One way or the other, you will update",
            type: "two_button",
            lb_text: "I give up, update.",
            rb_text: "Bring it on",
            close_fn: function(){ 
                game.time.events.add(TIME_BETWEEN_LEVELS, level8);
            }
        }
    );  
    windowGroup.add(w);
    setRefocusWindowTimer(w, windowGroup, 15, 2, 2);
}

function level8() {
    var w = new RunawayWindow(game.world.centerX, game.world.centerY, "Resistance is futile\n",
            function(){
                game.time.events.add(TIME_BETWEEN_LEVELS, level9);
            });
    windowGroup.add(w);
}

function level9() {
    var w = new BasicWindow(game.world.centerX, game.world.centerY, 
        {
            middle_message: "This is your last chance.",
            bottom_message: "What will you do?",
            type: "two_button",
            lb_text: "Update",
            rb_text: "Die",
            close_fn: boss
        }
    );  
    windowGroup.add(w);
    setRefocusWindowTimer(w, windowGroup, 15, 2, 2);
}

function boss() {
    // yay! Globals
    cursor.health = updateFunction();
    updateFunction = function(){return cursor.health};
    boss = new Boss(game.world.centerX, game.world.centerY);
    allGroup.add(boss);
}


function lose(){
    // TODO make this not super lame
    game.time.events.removeAll(); 
    allGroup.destroy();
    healthText.destroy();
    healthbar.kill();
    game.time.events.add(Phaser.Timer.SECOND * 2, function(){
        background.destroy();
        game.add.text(game.world.centerX, game.world.centerY - 100, 'Installing Windows 10', WHITE_MIDDLE_FONT).anchor.setTo(.5);
        game.add.text(game.world.centerX, game.world.centerY, '(you lost)', WHITE_HEADER_FONT).anchor.setTo(.5);
    }, this);
}
