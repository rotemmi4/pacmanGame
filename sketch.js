/**
 * 0 = BARRIER
 * 1 = empty
 * 3 = +15FOOD
 * 4 = GHOST
 * 5 = PAC-MAN
 * 6 = +25FOOD
 * 7 = +5_FOOD
 * 8 = CHERRY
 */
var FIELD = [
    "0,0,0,0,0,0,0,0,0,0,0,0,0,0",
    "0,1,1,1,1,1,1,1,1,1,1,1,1,0",
    "0,1,0,1,0,0,1,0,1,0,1,0,0,0",
    "0,1,0,1,0,0,1,0,1,0,1,0,1,0",
    "0,1,1,1,1,1,1,1,1,1,1,1,1,0",
    "0,0,1,0,1,0,1,1,0,1,0,0,0,0",
    "0,0,1,0,1,0,1,0,0,1,0,0,1,0",
    "0,1,1,1,1,1,1,1,1,1,1,1,1,0",
    "0,0,1,1,0,0,1,1,0,0,1,0,0,0",
    "0,1,1,1,1,1,1,1,0,1,1,0,0,0",
    "0,1,1,1,1,1,1,1,0,1,1,1,1,0",
    "0,0,0,1,0,0,1,1,0,1,0,0,0,0",
    "0,1,1,1,1,1,1,1,1,1,1,1,1,0",
    "0,0,0,0,0,0,0,0,0,0,0,0,0,0",
];
var button;
var canvas;

var shuffledField = [];
var shuffledField2 = [];
var field = [];
var fie = [];
var ghosts = [];
var cherrys = [];

var pacman;
var cherry;
var score=0;
var endScore=0;
var lastKeyPressed=3;
var ghostsNum=1;
var pacman_lives=3;
var lives=pacman_lives;
var special_food_num=67;
var Ghost_speed=1;
var pacman_remain=1;
var cherry_remain=1;
var timer;
var counter = 76;
var seconds, minutes;
var interval;

var cherryImg;
var ghostImg1;
var ghostImg2;
var ghostImg3;
var pacman_Lives_img;
var won_game_img;
var end_game_img;
var youCanDoBetter_img;

var n1=0;
var n2=0;
var n3=0;
var settings=null;
var controls = {
    upkey : 38,
    downkey: 40,
    leftkey: 37,
    rightkey: 39
};


function setSettings(newSettings){
    settings = newSettings;
    special_food_num = settings['amountOfBalls'];
    counter = settings['time'];
    Ghost_speed = settings['ghostSpeed'];
    controls = settings['controls'];
    ghostsNum = settings['amountOfGhosts'];
}
// Load images
function preload(){
    ghostImg1 = loadImage('pics/ghost1.png');
    ghostImg2 = loadImage('pics/ghost2.png');
    ghostImg3 = loadImage('pics/ghost3.png');
    pacman_Lives_img = loadImage('pics/pacman_lives.png');
    cherryImg= loadImage('pics/cherry.png');
    youCanDoBetter_img= loadImage('pics/better.png');
    end_game_img = loadImage('pics/endGame.png');
    won_game_img = loadImage('pics/pacman_won.jpg');
}

function resetSketchSameGame() {
    for (var i = 0; i < fie.length; i++) {
        if(ghostsNum==1) {
            if (fie[i].type == "GHOST1") {
                fie[i].x = 1;
                fie[i].y = 12;
            }
        }
        if(ghostsNum==2) {
            if (fie[i].type == "GHOST2") {
                fie[i].x = 12;
                fie[i].y = 1;
            }
            else if(fie[i].type == "GHOST1"){
                fie[i].x = 1;
                fie[i].y = 12;
            }
        }
        if(ghostsNum==3) {
            if (fie[i].type == "GHOST3") {
                fie[i].x = 12;
                fie[i].y = 1;
            }
            else if (fie[i].type == "GHOST2") {
                fie[i].x = 1;
                fie[i].y = 12;
            }
            else if(fie[i].type == "GHOST1"){
                fie[i].x = 12;
                fie[i].y = 12;
            }
        }
        if(fie[i].type== "PACMAN") {
            for (var j = 0; j < fie.length; j++) {
                if(fie[j].type== "empty") {
                    fie[i].x = fie[j].x;
                    fie[i].y = fie[j].y;
                    fie = shufflePacman(fie);
                }
            }
        }
        if(fie[i].type== "CHERRY"){
            fie[i].x=1;
            fie[i].y=1;
        }
    }
    lastKeyPressed=3;
    ghostsNum=settings!=null ? settings['amountOfGhosts'] : 1;
    Ghost_speed=settings!=null ? settings['ghostSpeed'] : 1;
    endScore;
    score;
    counter = settings != null ? settings['time'] : 76;
    seconds;
    minutes;
}

function resetParamaters() {
    FIELD = [
        "0,0,0,0,0,0,0,0,0,0,0,0,0,0",
        "0,1,1,1,1,1,1,1,1,1,1,1,1,0",
        "0,1,0,1,0,0,1,0,1,0,1,0,0,0",
        "0,1,0,1,0,0,1,0,1,0,1,0,1,0",
        "0,1,1,1,1,1,1,1,1,1,1,1,1,0",
        "0,0,1,0,1,0,1,1,0,1,0,0,0,0",
        "0,0,1,0,1,0,1,0,0,1,0,0,1,0",
        "0,1,1,1,1,1,1,1,1,1,1,1,1,0",
        "0,0,1,1,0,0,1,1,0,0,1,0,0,0",
        "0,1,1,1,1,1,1,1,0,1,1,0,0,0",
        "0,1,1,1,1,1,1,1,0,1,1,1,1,0",
        "0,0,0,1,0,0,1,1,0,1,0,0,0,0",
        "0,1,1,1,1,1,1,1,1,1,1,1,1,0",
        "0,0,0,0,0,0,0,0,0,0,0,0,0,0",
    ];
    window.clearInterval(interval);
    if(timer!=null)
        timer.remove();
    timer=createElement('timer');
    timer.addClass('gameTimer');

    interval=setInterval(timeIt, 1000);
    shuffledField = [];
    shuffledField2 = [];
    field = [];
    fie = [];
    ghosts = [];
    cherrys = [];
    pacman;
    cherry;
    score=0;
    endScore=0;
    lastKeyPressed=3;
    ghostsNum=1;
    pacman_lives=3;
    special_food_num=50;
    Ghost_speed=1;
    pacman_remain=1;
    cherry_remain=1;
    timer;
    counter = 76;
    seconds, minutes;
    interval;
    if(settings!=null)
        setSettings(settings);
}
function resetSketchNewGame() {
    resetParamaters();
    fie = generate2();
}
function setup() {
    if(canvas!=null)
        canvas.remove();
    canvas=createCanvas(700,500);
    canvas.style('display', 'block');
    canvas.addClass('canvass');
    newGame();

    if(button!=null)
        button.remove();
    button = createButton("New Game");
    button.mousePressed(function () {
        resetParamaters();
        newGame();
    });
    button.addClass('newGameButton');
    var div = document.getElementById("game");
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
    div.appendChild(canvas.elt);
    div.appendChild(button.elt);
    div.appendChild(timer.elt);
}

function newGame(){
    loop();
    if(pacman_lives===3) {
        resetSketchNewGame();
    }
    if(pacman_lives===2 || pacman_lives===1){
        resetSketchSameGame();
        draw();
    }
    if(pacman_lives===0){
        endGame('lost');
        resetSketchNewGame();
    }
    if((typeof minutes !== 'undefined' && typeof seconds !== 'undefined') && minutes==0 && seconds==0){
        if(score < 150){
            endGame('timeLost');
            resetSketchNewGame();
        }
        else {
            endGame('won');
            resetSketchNewGame();
        }
    }
}

function endGame(status) {

    if (status == 'won') {
        drawWon();
    }
    else if (status == 'lost'){
       // pacman.intact=false;
        drawEnd();
    }
    else if(status === 'timeLost'){
        drawYouCanDoBetter();
    }
    noLoop();
}

function draw() {
    try {
        background('#1c1c00');   //'#1c1c00'
        drawScale();
        if (pacman_lives === 3) {
            image(pacman_Lives_img, 600, 90, pacman_Lives_img.height / 18, pacman_Lives_img.width / 18);
            image(pacman_Lives_img, 560, 90, pacman_Lives_img.height / 18, pacman_Lives_img.width / 18);
            image(pacman_Lives_img, 520, 90, pacman_Lives_img.height / 18, pacman_Lives_img.width / 18);
        } else if (pacman_lives === 2) {
            image(pacman_Lives_img, 560, 90, pacman_Lives_img.height / 18, pacman_Lives_img.width / 18);
            image(pacman_Lives_img, 520, 90, pacman_Lives_img.height / 18, pacman_Lives_img.width / 18);
        } else if (pacman_lives === 1) {
            image(pacman_Lives_img, 520, 90, pacman_Lives_img.height / 18, pacman_Lives_img.width / 18);
        }
        for (var j = 0; j < ghosts.length; j++) {
            ghosts[j].update();
            ghosts[j].draw();
        }

        if (cherry != null && cherry.intact && (pacman_lives === 3 || pacman_lives === 2 || pacman_lives === 1)) {
            cherry.update();
            cherry.draw();
        }
        if (pacman != null && pacman.intact) {
            pacman.update();
            pacman.draw();
        }
        handleInput(); // keyboard input
    }
    catch (e) {
    }
}

function drawWon() {
    textSize(60);
    textAlign(LEFT);
    fill("#070700");
    stroke("#070700");
    strokeWeight(4);
    background(won_game_img);
    text("We", width/2-320, height/2+40 );
    text("have a", width/2-320 , height/2+100 );
    text("Winner!!!", width/2-320 , height/2+170 );
    text("Your Score is: "+score, width/2-320 , height/2+230 );
}

function drawEnd() {
    textSize(50);
    textAlign(CENTER);
    fill("#070700");
    stroke("#070700");
    strokeWeight(3);
    background(end_game_img);
    text("You Lost!", width / 2 - 200, height / 2 - 90);
    text("Your Score is: "+score, width / 2 + 120 , height / 2 + 100);
}

function drawYouCanDoBetter(){
    textSize(60);
    textAlign(LEFT);
    fill("#070700");
    stroke("#070700");
    strokeWeight(3);
    background(youCanDoBetter_img);
    text("you can", width / 2 - 310, height / 2 + 60 );
    text("do better", width / 2 - 310 , height / 2 + 120 );
    text("Your Score is: " + score, width / 2 - 310, height / 2 + 180);
}

//draws all tiles except types GHOST's, PACMAN and CHERRY also draws score
function drawScale() {
    //walls
    for (var i = 0; i < fie.length; i++) {
        if (fie[i].intact) {
            if (fie[i].type != "GHOST1" && fie[i].type != "GHOST2" && fie[i].type != "GHOST3" && fie[i].type != "CHERRY" && fie[i].type != "PACMAN")
                fie[i].draw();
        }
    }
    //score
    noStroke();
    fill("#fffdfc");
    textSize(20);
    textAlign(LEFT);
    text(score, 580,156 );
    var s = 'Score:';
    text(s, 500, 140, 70, 80);
    //timer
    timer.style('color', '#fffdfc');
    var t = 'Time:';
    text(t, 500, 10, 70, 80);
    //lives
    var l = 'Lives:';
    text(l, 500, 60, 70, 80);
}

function handleInput() {
    if (keyIsDown(controls['upkey'])) {
        lastKeyPressed=1;
        pacman.move(0, -1, true);
    } else if (keyIsDown(controls['downkey'])) {
        lastKeyPressed=2;
        pacman.move(0, 1, true);
    } else if (keyIsDown(controls['leftkey'])) {
        lastKeyPressed=3;
        pacman.move(-1, 0, true);
    } else if (keyIsDown(controls['rightkey'])) {
        lastKeyPressed=4;
        pacman.move(1, 0, true);
    }
}

function timeIt() {
    // 1 counter = 1 second
    if (counter > 0) {
        counter--;
    }
    minutes = floor(counter/60);
    seconds = counter % 60;
    // if (counter < 60)
    timer.html(minutes + ":" + seconds);
    if(minutes==0 && seconds==0){
        if(score > 150)
            endGame('won');
        else
            endGame('timeLost');
    }
}

function shuffleBalls() {
    var j, x, i,r,z,q,w;
    for (i = 0; i < field.length; i++){
        if(field[i].type =="+5_FOOD" || field[i].type =="+15_FOOD" || field[i].type =="+25_FOOD"){
            x = field[i];
            z=field[i].x;
            r=field[i].y;
            for (var k = 0; k < field.length; k++) {
                j = Math.floor(Math.random() *196 );
                if(field[j].type =="empty" || field[j].type =="+15_FOOD" || field[j].type =="+25_FOOD"  || field[j].type =="+5_FOOD") {
                    q=field[j].x;
                    w=field[j].y;
                    field[i] = field[j];
                    field[i].x=z;
                    field[i].y=r;
                    field[j] = x;
                    field[j].x=q;
                    field[j].y=w;
                    break;
                }
            }
        }
    }
    return field;
}

function shufflePacman() {
    var j, x, i,r,z,q,w;
    for (i = 0; i < field.length; i++){
        if(field[i].type =="PACMAN"){
            x = field[i];
            z=field[i].x;
            r=field[i].y;
            for (var k = 0; k < field.length; k++) {
                j = Math.floor(Math.random() *196 );
                if(field[j].type =="empty" || field[j].type =="+15_FOOD" || field[j].type =="+25_FOOD"  || field[j].type =="+5_FOOD") {
                    q=field[j].x;
                    w=field[j].y;
                    field[i] = field[j];
                    field[i].x=z;
                    field[i].y=r;
                    field[j] = x;
                    field[j].x=q;
                    field[j].y=w;
                    break;
                }
            }
            break;
        }
    }
    return field;
}

function generate() {
    n1 = round(special_food_num * 0.3);
    n2 = round(special_food_num * 0.1);
    n3 = round(special_food_num * 0.6);
    for (var k = 1; k < FIELD.length; k++) { // loop through each string
        var row = FIELD[k].split(",");
        for (var r = 0; r < row.length; r++) { // loop through numbers in string
            if (pacman_remain === 1) {
                row[2] = "5";
                FIELD.splice(1, 1, row.toString());
                pacman_remain--;
            }
            if(k != 1 || r != 1){
                if((k != 12 || r != 1)){
                    if((k != 1 || r != 12)){
                        if((k != 12 || r != 12)){
                            if (row[r] == 1 && n1 > 0) {
                                if (row[r] !== 3 && row[r] !== 6 && row[r] !== 7 && row[r] !== 5 && row[r] !== 0) {
                                    row[r] = "3";
                                    FIELD.splice(k, 1, row.toString());
                                    n1--;
                                    special_food_num--;
                                }
                            }
                            if ( row[r] == 1 && n2 > 0) {
                                if(row[r]!==3&&row[r]!==6&&row[r]!==7&&row[r]!==5&&row[r]!==0) {
                                    row[r] = "7";
                                    FIELD.splice(k, 1, row.toString());
                                    n2--;
                                    special_food_num--;
                                }
                            }
                            if ( row[r] == 1 && n3 > 0) {
                                if(row[r]!==3&&row[r]!==6&&row[r]!==7&&row[r]!==5&&row[r]!==0) {
                                    row[r] = "6";
                                    FIELD.splice(k, 1, row.toString());
                                    n3--;
                                    special_food_num--;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    for (var z = 0; z < FIELD.length; z++) { // loop through each string
        var row = FIELD[z].split(",");
        for (var q = 0; q < row.length; q++) { // loop through numbers in string
            for (var s = 0; s < ghostsNum; s++) {
                if ((s == 0) && (z == 12) && (q == 1)) {
                    row[1] = "4";
                    FIELD.splice(12, 1, row.toString());
                }
                if ((s == 1) && (z == 1) && (q == 12)) {
                    row[12] = "9";
                    FIELD.splice(1, 1, row.toString());
                }
                if ((s == 2) && (z == 12) && (q == 12)) {
                    row[12] = "10";
                    FIELD.splice(12, 1, row.toString());
                }
                if(cherry_remain === 1){
                    if ((z == 1) && (q == 1)) {
                        row[1] = "8";
                        FIELD.splice(1, 1, row.toString());
                        cherry_remain--;
                    }
                }
            }
        }
    }
    var f = [];
    f.length = 0;
    for (var i = 0; i < FIELD.length; i++) { // loop through each string
        row = FIELD[i].split(",");
        for (var j = 0; j < row.length; j++) { // loop through numbers in string
            var type = TYPES[row[j]];
            var tile = new Tile(j, i, type, -1, -1);

            switch (type) {
                case "empty":
                    f.push(tile);
                    break;

                case "PACMAN":
                    pacman = tile;
                    f.push(tile);
                    break;

                case "GHOST1":
                    var behavior = 0; //agressive
                    ghosts.push(new Tile(j, i, type, behavior));
                    f.push(new Tile(j, i, "OPEN"));
                    break;

                case "GHOST2":
                    var behavior = 1; //nonchalant
                    ghosts.push(new Tile(j, i, type, behavior));
                    f.push(new Tile(j, i, "OPEN"));
                    break;

                case "GHOST3":
                    var behavior = 0; //agressive
                    ghosts.push(new Tile(j, i, type, behavior));
                    f.push(new Tile(j, i, "OPEN"));
                    break;

                case "BARRIER":
                    f.push(tile);
                    break;

                case "CHERRY":
                    cherry=tile;
                    endScore += 50; // worth 50 points
                    var behavior = 1; //nonchalant
                    cherrys.push(new Tile(j, i, type, behavior));
                    f.push(new Tile(j, i, "OPEN"));
                    break;

                case "+25_FOOD":
                    endScore += 25; // worth 25 points
                    f.push(tile);
                    break;

                case "+15_FOOD":
                    endScore += 15; // worth 15 points
                    f.push(tile);
                    break;

                case "+5_FOOD":
                    endScore += 5; // worth 5 point
                    f.push(tile);
                    break;
            }
        }
    }
    return f;
}

function generate2() {
    field = generate();
    shuffledField = shuffleBalls(field);
    shuffledField2 = shufflePacman(shuffledField);

    for (var i = 0; i < shuffledField2.length; i++) {
        if (shuffledField2[i].type == "OPEN") {
            shuffledField2[i].type = "CHERRY";
            break;
        }
    }
    for (var j = 0; j < shuffledField2.length; j++) {
        if (shuffledField2[j].type == "OPEN") {
            if (ghostsNum==1) {
                shuffledField2[j].type = "GHOST1";
                ghostsNum--;
            }
            if (ghostsNum==2) {
                shuffledField2[j].type = "GHOST2";
                ghostsNum--;
            }
            if (ghostsNum==3) {
                shuffledField2[j].type = "GHOST3";
                ghostsNum--;
            }
        }
    }
    return shuffledField2;
}

