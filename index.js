let c = document.getElementById('GameBox');
let ctx = c.getContext('2d');

//setting the screen
c.width = 1200;
c.height = 600;

//engine variables
let celSize = 30;
let maxSnakeLength = (c.width / celSize) * (c.height / celSize);
let direction = 'right';
let appleSpawnMap = [];

//player variables
let player = {
    x: 0,
    y: 0,
    length: 1,
    coordinatesArray: []
}

class coordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

//apple variables
let appleLoc = new coordinate(-1, -1);
let appleEaten = true;
let appleIsGold = false;

window.addEventListener('keydown', function (event) {
    switch (event.keyCode) {
        case 65:
            direction = direction == 'right' ? 'right' : 'left';
            break;
        case 68:
            direction = direction == 'left' ? 'left' : 'right';
            break;
        case 87:
            direction = direction == 'down' ? 'down' : 'up';
            break;
        case 83:
            direction = direction == 'up' ? 'up' : 'down';
            break;
        default:
            break;
    }
}, false);

//gameloop
setInterval(() => {
    update();
    draw();
}, 100);

//updating the entities
function update() {
    if (player.x == appleLoc.x && player.y == appleLoc.y) {
        if (appleIsGold) {
            appleIsGold = false;
            player.length += 5;
        } else {
            player.length++;
        }
        appleEaten = true;
    }

    //checking if the array is not longer than the player.length property
    if (player.length < player.coordinatesArray.length) {
        player.coordinatesArray.splice(player.coordinatesArray.length - (player.coordinatesArray.length - player.length));
    }

    //shifting the array
    if (player.length > 1) {
        for (let i = player.length - 1; i > 0; i--) {
            if (player.coordinatesArray[i - 1] != null) {
                player.coordinatesArray[i] = player.coordinatesArray[i - 1];
            }
        }
    }

    //updating movement
    switch (direction) {
        case 'left':
            player.x--;
            break;
        case 'right':
            player.x++;
            break;
        case 'up':
            player.y--
            break;
        case 'down':
            player.y++
            break;
        default:
            break;
    }

    //checking out of bounds
    if (player.x > (c.width / celSize) - 1) {
        player.x = 0;
    } else if (player.x < 0) {
        player.x = (c.width / celSize) - 1;
    } else if (player.y > (c.height / celSize) - 1) {
        player.y = 0;
    } else if (player.y < 0) {
        player.y = (c.height / celSize) - 1;
    }

    //adding the new head to the array
    player.coordinatesArray[0] = new coordinate(player.x, player.y)

    //spawning the apple
    if (appleEaten) {
        appleSpawnMap = new Array(maxSnakeLength).fill(0);
        for (let i = 0; i < player.length; i++) {
            if (player.coordinatesArray[i] != null) {
                appleSpawnMap[player.coordinatesArray[i].x + (player.coordinatesArray[i].y * (c.width / celSize))] = 1;
            }
        }

        let randPos = Math.floor(Math.random() * (maxSnakeLength - player.length)) + 1;

        for (let i = 0; i < appleSpawnMap.length; i++) {
            if (appleSpawnMap[i] == 0) {
                randPos--;
                if (randPos == 0) {
                    appleLoc = new coordinate(i % (c.width / celSize), Math.floor(i / (c.width / celSize)));
                    appleEaten = false;
                    break;
                }
            }
        }

        if (Math.random() < .1) {
            appleIsGold = true;
        }
    }

    //checking for collision
    for (let i = 1; i < player.coordinatesArray.length; i++) {
        if (player.coordinatesArray[0].x == player.coordinatesArray[i].x && player.coordinatesArray[0].y == player.coordinatesArray[i].y) {
            reset();
            break;
        }
    }
}

//drawing the screen
function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, c.width, c.height);
    if (appleIsGold) {
        ctx.fillStyle = 'gold';
    } else {
        ctx.fillStyle = 'red';
    }
    ctx.fillRect(appleLoc.x * celSize, appleLoc.y * celSize, celSize, celSize);
    for (let i = 0; i < player.coordinatesArray.length; i++) {
        if (i == 0) {
            ctx.fillStyle = 'white';
        } else {
            ctx.fillStyle = `rgb(${55 + ((200 / player.length) * i)},${0},${55 + ((200 / player.length))}`;
        }
        ctx.fillRect(player.coordinatesArray[i].x * celSize, player.coordinatesArray[i].y * celSize, celSize, celSize);
    }
}

//reset function
function reset() {
    player.length = 1;
    player.x = 0;
    player.y = 0;
    direction = 'right';
    player.coordinatesArray = [];
    player.coordinatesArray.push(new coordinate(player.x, player.y));
}

//this is called at the beginning
function setup() {
    player.coordinatesArray.push(new coordinate(player.x, player.y));
    update();
    draw();
    appleEaten = false;
}

setup();
