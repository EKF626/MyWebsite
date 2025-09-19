const variance = 0.01;
const EFPoints = [[0.5, 0.5], [0.45, 0.5], [0.45, 0.4], [0.5, 0.4], [0.5, 0.45]];
const minNumLines = 4;
const maxNumLines = 9;
const minDist = 20;

let savedMouse = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  savedMouse = [mouseX, mouseY];
}

function mouseMoved() {
    print(dist(mouseX, mouseY, savedMouse[0], savedMouse[1]));
    if (dist(mouseX, mouseY, savedMouse[0], savedMouse[1]) >= minDist) {
        drawLines();
        savedMouse = [mouseX, mouseY];
    }
}

function drawLines() {
    background(250, 249, 242);

    let newPoints = []
    for (let i = 0; i < int(random(minNumLines, maxNumLines+1)); i++) {
        newPoints = [];
        for (let j = 0; j < EFPoints.length; j++) {
            newPoints.push([EFPoints[j][0], EFPoints[j][1]]);
            newPoints[j][0] += newPoints[j][0]*random(-variance, variance);
            newPoints[j][1] += newPoints[j][1]*random(-variance, variance);
        }
        line(newPoints[0][0]*width, newPoints[0][1]*height, newPoints[1][0]*width, newPoints[1][1]*height);
        line(newPoints[1][0]*width, newPoints[1][1]*height, newPoints[2][0]*width, newPoints[2][1]*height);
        line(newPoints[2][0]*width, newPoints[2][1]*height, newPoints[3][0]*width, newPoints[3][1]*height);
        line(lerp(newPoints[1][0], newPoints[2][0], 0.5)*width, lerp(newPoints[1][1], newPoints[2][1], 0.5)*height, newPoints[4][0]*width, newPoints[4][1]*height);
    }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}