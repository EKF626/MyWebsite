let tables = [];
let yearSlider;
let globalIndex = 0;
let selectType;
let selectData;
let hues = [];
let yearBase;
let prevYear = 0;
let maxVal;
let maxSize = 440;
let minSize = 15;
let ticLength = 26;
let subReferences;

const spreadsheets = [
  "Amazon Square Footage Data.csv", 
  "Switch Square Footage Data.csv"
];
const titles = [
  "Amazon", 
  "Switch"
];
const titleEnd = "Square Footage";
const references = [
  ["Central Park", 36721080],
  ["Downtown LA", 162810000],
  ["Manhattan", 636185000],
  ["100 football fields", 4800000],
];


function preload() {
  for (let i = 0; i < spreadsheets.length; i++) {
    let newTable = loadTable(spreadsheets[i], "csv");
    tables.push(newTable);
  }
}

function setup() {
  createCanvas(660, 660);
  colorMode(HSB, 255);
  textAlign(LEFT, CENTER);
  
  selectData = createSelect();
  selectData.position(500, height-38);
  for (let i = 0; i < titles.length; i++) {
    selectData.option(titles[i], i);
  }
  selectData.changed(setScene);
  
  setScene();
}

function draw() {
  if (prevYear != yearSlider.value()) {
    updateGraphic();
  }
  prevYear = yearSlider.value();
}

function setScene() {
  globalIndex = selectData.value();
  table = tables[globalIndex];
  
  if (yearSlider) {
      yearSlider.remove();
  }
  yearSlider = createSlider(0, table.getColumnCount()-2, 0, 1);
  yearSlider.position(14, height-35);
  yearSlider.size(160);
  yearSlider.class('custom-slider');
    
  yearBase = table.getNum(0, 1);
  
  if (selectType) {
    selectType.remove();
  }
  selectType = createSelect();
  selectType.position(280, height-38);
  for (let i = 1; i < table.getRowCount(); i++) {
    selectType.option(table.getString(i, 0), i-1);
  }
  selectType.changed(updateGraphic);
  
  let hueOffset = int(random(255));
  hues = [];
  for (let i = 0; i < table.getRowCount()-1; i++) {
    let h = (hueOffset+i*15)%255;
    hues.push(h);
  }
  
  maxVal = 0;
  for (let i = 1; i < table.getRowCount(); i++) {
    for (let j = 1; j < table.getColumnCount(); j++) {
      let val = sqrt(table.getNum(i, j));
      if (val > maxVal) {
        maxVal = val;
      }
    }
  }
  
  subReferences = [];
  for (let i = 0; i < references.length; i++) {
    if (sqrt(references[i][1])/maxVal*maxSize >= minSize && sqrt(references[i][1]) <= maxVal) {
      subReferences.push(references[i]);
    }
  }
    updateGraphic();
}

function updateGraphic() {
  let typeIndex = int(selectType.value());
  let yearIndex = int(yearSlider.value());
  let yearNum = yearBase+yearIndex;
  let table = tables[globalIndex];
  
  background(255);
  
  style();
  
  let vals = [];
  let yearSpan = tables[selectData.value()].getColumnCount()-1;
  for (let i = 0; i <= yearIndex; i++) {
    let sizeVal = table.getNum(typeIndex+1, i+1);
    vals.push(sizeVal);
  }
  push();
  stroke(0);
  strokeWeight(1.5);
  for (let i = 0; i < vals.length; i++) {
    let sideLength = sqrt(vals[i])/maxVal*maxSize;
    let length = ticLength*(i+1)/yearSpan;
    line(35+sideLength, 515, 35+sideLength, 515+length);
    line(30, 510-sideLength, 30-length, 510-sideLength);
  }
  pop();
  vals = sort(vals);
  push();
  noStroke();
  for (let i = vals.length-1; i >= 0; i--) {
    let sideLength = sqrt(vals[i])/maxVal*maxSize;
    fill(hues[typeIndex], 70+8*(yearIndex-i), 255-20*(yearIndex-i));
    rect(35-1, 510+1, sideLength+1, -sideLength-1);
  }
  pop();
  
  push();
  noFill();
  for (let i = 0; i < subReferences.length; i++) {
    let sideLength = sqrt(subReferences[i][1])/maxVal*maxSize;
    rect(35, 510, sideLength, -sideLength);
    let h = 510-sideLength/2;
    line(35+sideLength, h, 505, h);
    push();
    noStroke();
    fill(0);
    textSize(15);
    textFont('Verdana');
    text(subReferences[i][0], 515, h);
    pop();
  }
  pop();
  
  push();
  noStroke();
  fill(hues[typeIndex], 100, 75);
  rect(0, height-55, width, height-55);
  pop();
  
  push();
  textSize(25);
  textFont('Verdana');
  textStyle(ITALIC);
  noStroke();
  fill(255);
  text(yearNum, 193, height-26);
  pop();
  
  push();
  textSize(30);
  textFont('Verdana');
  noStroke();
  fill(0);
  let formattedVal = nfc(table.get(typeIndex+1, yearIndex+1));
  text(formattedVal + " sq ft", 25, height-80);
  pop();
  
  if (yearIndex > 0) {
    let sizeVal = table.get(typeIndex+1, yearIndex+1);
    let prevVal = table.get(typeIndex+1, yearIndex);
    let diff = sizeVal - prevVal;
    let perChange = round(100*diff/prevVal, 2);
    let perText = perChange+"%";
    if (perChange >= 0) {
      perText = "+"+perText;
    }
    push();
    textSize(25);
    textFont('Verdana');
    textStyle(ITALIC);
    noStroke();
    fill(hues[typeIndex], 255, 125);
    text(perText, 400, height-80);
    pop();
  }
  
  push();
  fill(hues[typeIndex], 60, 215);
  strokeWeight(3);
  rect(0, 0, width, 60);
  pop();
  
  push();
  textAlign(CENTER, CENTER);
  textSize(50);
  textFont("Impact");
  textStyle(BOLD);
  noStroke();
  text(titles[globalIndex] + " " + titleEnd, width/2, 30);
  pop();
}

function style() {
  h = hues[int(selectType.value())];
  
  yearSlider.style('background-color', color(h, 175, 200).toString());
  
  selectData.style('background-color', color(h, 175, 100).toString());
  selectData.style('color', 'white');
  selectData.style('border', '1px solid #FFFFFF');
  selectData.style('font-family', 'Verdana');
  selectData.style('width', '140px');
  
  selectType.style('background-color', color(h, 175, 100).toString());
  selectType.style('color', 'white');
  selectType.style('border', '1px solid #FFFFFF');
  selectType.style('font-family', 'Verdana');
  selectType.style('width', '200px');
}