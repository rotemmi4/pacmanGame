const TYPES = ["BARRIER", "empty", "OPEN", "+15_FOOD", "GHOST1", "PACMAN","+25_FOOD","+5_FOOD","CHERRY","GHOST2","GHOST3"];
const DIMENSIONS = 14;	// size of maze
const SIZE = 35;	// size of each tile of the maze
const HALF_SIZE = SIZE / 2;
const THIRD_SIZE = SIZE / 3;
const QUARTER_SIZE = SIZE / 4;
var distance;
var colors = {
    fivePoint : 255,
    fifteenPoint : "#FF2222",
    twentyFivePoint: "#040dff"
};

function setColors(newColors) {
    colors=newColors;
}
function Tile(x, y, type, behavior) {

    this.x = x;
    this.y = y;
    this.type = type;

    this.destination = (-1, -1);
    this.moving = false;
    this.intact = true;

    if(type=="GHOST1" || type=="GHOST2" || type=="GHOST3") {
        if(Ghost_speed===1) { //easy game level
            this.speed = 0.05;
        }
        else if(Ghost_speed===2) { //medium game level
            this.speed = 0.1;
        }
        else if(Ghost_speed===3) {  //hard game level
            this.speed = 0.15;
        }
    }
    else if(type=="PACMAN"){
        this.speed = 0.2;
    }
    else if(type=="CHERRY"){
        this.speed = 0.06;
    }
    this.behavior = behavior; // 0 = agressive, 1 = nonchalant
}

Tile.prototype.update = function() {

    if (!this.intact) // no need to update
        return;

    // movement
    if (this.moving) {

        this.x = lerp(this.x, this.destination.x, this.speed);
        this.y = lerp(this.y, this.destination.y, this.speed);

        var distanceX = Math.abs(this.x - this.destination.x);
        var distanceY = Math.abs(this.y - this.destination.y);

        if (distanceX < 0.1 && distanceY < 0.1) { // round to the nearest position

            this.x = this.destination.x;
            this.y = this.destination.y;

            this.moving = false; // done moving
        }
    }

    // eating
    if (this.type == "PACMAN") { // only PACMAN may eat!

        // Tile to which Pac-man is moving
        var destinationTile = getTile(Math.floor(this.x), Math.floor(this.y));

        if (destinationTile.intact) {

            switch (destinationTile.type) {

                case "+5_FOOD":
                    score += 5;	// worth 5 point
                    destinationTile.intact = false;
                    break;

                case "+15_FOOD":
                    score += 15;	// worth 15 points
                    destinationTile.intact = false;
                    break;

                case "+25_FOOD":
                    score += 25;	// worth 25 points
                    destinationTile.intact = false;
                    break;
            }
        }
        if (score == endScore && endScore!=0) {
            endGame('won');
        }

    } else if (this.type == "GHOST1" || this.type == "GHOST2" || this.type == "GHOST3" || this.type == "CHERRY") {

        distance = dist(pacman.x, pacman.y, this.x, this.y);

        if (distance < 0.3) {// pacman collision in a ghost or a cherry
            if (this.type == "CHERRY") {
                score += 50;	// worth 50 points
                cherry.intact=false;
            }
            else if(this.type == "GHOST1" || this.type == "GHOST2" || this.type == "GHOST3"){
                pacman_lives--;
                score -=10;
                endScore-=10;// lose 10 points
                newGame();
                if(pacman_lives === 0){
                    endGame('lost');
                }
            }
        }
        // movement
        if (this.moving) // can't move multiple times at once
            return;

        var possibleMoves = [

            getTile(this.x - 1, this.y),	// left
            getTile(this.x + 1, this.y),	// right
            getTile(this.x, this.y - 1),	// top
            getTile(this.x, this.y + 1),	// bottom
        ];

        //sort by distance from pacman
        possibleMoves.sort(function (a, b) {

            var aD = dist(a.x, a.y, pacman.x, pacman.y);
            var bD = dist(b.x, b.y, pacman.x, pacman.y);

            return aD - bD;
        });

        if (this.behavior === 0) {	//agressive

            for (var i = 0; i < possibleMoves.length; i++) {

                if (this.move(possibleMoves[i].x, possibleMoves[i].y, false)) { // attempt to move
                    break;
                }
            }
        } else { //nonchalant
            var index = Math.floor(random(4));
            this.move(possibleMoves[index].x, possibleMoves[index].y, false);
        }
    }
};

Tile.prototype.draw = function() {

    switch (this.type) {

        case "BARRIER":

            strokeWeight(5);
            stroke(0);
            fill("#3e8e41");
            rect(this.x * SIZE, this.y * SIZE, SIZE, SIZE);
            break;

        case "+5_FOOD":

            ellipseMode(CORNER);
            noStroke();
            fill(colors['fivePoint']);
            ellipse(this.x * SIZE + THIRD_SIZE, this.y * SIZE + THIRD_SIZE, THIRD_SIZE);
            break;

        case "+15_FOOD":

            ellipseMode(CORNER);
            stroke(255);
            strokeWeight(2);
            fill(colors['fifteenPoint']);
            ellipse(this.x * SIZE + QUARTER_SIZE, this.y * SIZE + QUARTER_SIZE, HALF_SIZE);
            break;

        case "+25_FOOD":

            ellipseMode(CORNER);
            stroke(255);
            strokeWeight(2);
            fill(colors['twentyFivePoint']);
            ellipse(this.x * SIZE + QUARTER_SIZE, this.y * SIZE + QUARTER_SIZE, HALF_SIZE);
            break;

        case "CHERRY":
            image(cherryImg, this.x * SIZE, this.y * SIZE, cherryImg.height / 25, cherryImg.width / 25);
            break;

        case "GHOST1":
            image(ghostImg1, this.x * SIZE, this.y * SIZE, ghostImg1.height / 12, ghostImg1.width / 12);
            break;

        case "GHOST2":
            image(ghostImg2, this.x * SIZE, this.y * SIZE, ghostImg2.height / 12, ghostImg2.width / 12);
            break;

        case "GHOST3":
            image(ghostImg3, this.x * SIZE, this.y * SIZE, ghostImg3.height / 12, ghostImg3.width / 12);
            break;

        case "PACMAN":

            if(lastKeyPressed===1) {//up
                ellipseMode(CORNER);
                stroke("#ffd30d");
                strokeWeight(5);
                fill("#ffd30d");
                arc(this.x * SIZE + QUARTER_SIZE, this.y * SIZE + QUARTER_SIZE, HALF_SIZE, HALF_SIZE, PI + 40, PI - 100, PIE);
                break;
            }

            else if(lastKeyPressed===2) { //down
                ellipseMode(CORNER);
                stroke("#ffd30d");
                strokeWeight(5);
                fill("#ffd30d");
                arc(this.x * SIZE + QUARTER_SIZE, this.y * SIZE + QUARTER_SIZE, HALF_SIZE, HALF_SIZE, PI + 100, PI - 90, PIE);
                break;
            }

            else if(lastKeyPressed===3) { //left
                ellipseMode(CORNER);
                stroke("#ffd30d");
                strokeWeight(5);
                fill("#ffd30d");
                arc(this.x * SIZE + QUARTER_SIZE, this.y * SIZE + QUARTER_SIZE, HALF_SIZE, HALF_SIZE, TWO_PI - 40, TWO_PI + 40, PIE);
                break;
            }
            else if(lastKeyPressed===4){ //right
                ellipseMode(CORNER);
                stroke("#ffd30d");
                strokeWeight(5);
                fill("#ffd30d");
                arc(this.x * SIZE + QUARTER_SIZE, this.y * SIZE + QUARTER_SIZE, HALF_SIZE, HALF_SIZE, PI - 40, PI + 40, PIE);
                break;
            }
    }
};

Tile.prototype.move = function(x, y, relative) {

    var destinationX, destinationY;

    if (relative) {

        destinationX = this.x + x;
        destinationY = this.y + y;
    } else {

        destinationX = x;
        destinationY = y;
    }

    var destinationTile = getTile(destinationX, destinationY);

    if(typeof destinationTile === 'undefined')
        return false;

    var type = destinationTile.type;

    if ((type == "BARRIER" && this.type != "BARRIER") ||
        (type == "GHOST1" && this.type == "GHOST1") || (type == "GHOST2" && this.type == "GHOST2") || (type == "GHOST3" && this.type == "GHOST3") || (type == "CHERRY" && this.type == "CHERRY"))
        return false;

    this.moving = true; // will begin movement next update

    this.destination = createVector(destinationX, destinationY);

    return true;
};

function getTile(x, y) {

    return fie[y * DIMENSIONS + x];
}
