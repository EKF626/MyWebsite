const dist = 15;
const colorVal = 12;
const levels = 8;
const FR = 20;
const resetRate = 3;

let cells = [];
let newCells = [];
let rules = [];
let resetCount = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(HSB, 255);
    frameRate(FR);

    createCells();
    createRules();
}

function draw() {
    cellLogic();
    noStroke();
    let found = false;
    background(170, 255, 37);
    for (let x = 0; x < cells.length; x++) {
        for (let y = 0; y < cells[x].length; y++) {
            fill(170, 255, cells[x][y]*colorVal);
            if (mouseIsPressed) {
                // fill(17, 255, cells[x][y]*colorVal);
                fill(170, 255, cells[x][y]*colorVal*2);
            }
            // rect(x*dist+1, y*dist+1, dist-2, dist-2);
            circle(x*dist+dist/2, y*dist+dist/2, dist);
            if (cells[x][y] > 0) {
                found = true;
            }
        }
    }
    resetCount++;
    if (resetCount >= FR*resetRate) {
        createRules();
        resetCount = 0;
    }
    else if (!found) {
        createCells();
        createRules();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    createCells();
}

// function mouseClicked() {
//     createCells();
//     createRules();
// }

function createCells() {
    let numX = 0;
    cells = [];
    for (let x = 0; x <= width; x += dist) {
        numX++;
        cells.push([]);
        for (let y = 0; y <= height; y += dist) {
            cells[numX-1].push(max(int(random(-10*levels, levels)), 0));
        }
    }
}

function createRules() {
    rules = [];
    for (let i = 0; i <= 8*(levels-1); i++) {
        rules.push(int(random(levels)));
    }
}

function cellLogic() {
    arrayCopy(cells, newCells);
    for (let x = 0; x < cells.length; x++) {
        for (let y = 0; y < cells[x].length; y++) {
            newCells[x][y] = rules[getNeighborVal(x, y)];
        }
    }
    arrayCopy(newCells, cells);
}

function getNeighborVal(x, y) {
    let val = 0;
    if (y > 0) {
        if (x > 0) {
            val += cells[x-1][y-1];
        }
        val += cells[x][y-1];
        if (x < cells.length-1) {
            val += cells[x+1][y-1];
        }
    }
    if (x > 0) {
        val += cells[x-1][y];
    }
    if (x < cells.length-1) {
        val += cells[x+1][y];
    }
    if (y < cells[0].length-1) {
        if (x > 0) {
            val += cells[x-1][y+1];
        }
        val += cells[x][y+1];
        if (x < cells.length-1) {
            val += cells[x+1][y+1];
        }
    }
    return val;
}