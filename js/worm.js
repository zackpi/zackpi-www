var theta = 0;
var col = 255;

function setup() {
    createCanvas(windowWidth-50, windowHeight-100);
}

function draw() {
    if(mouseIsPressed){
        col = Math.floor(Math.random()*256);
    }
    
    fill(col);
    ellipse(mouseX, mouseY, 15*Math.sin(theta)+50, 15*Math.sin(theta)+50);
    theta = (theta+.1)%360;
}

function windowResized() {
    resizeCanvas(windowWidth-50, windowHeight-100);
}
