var theta = 0;
var col = 255;
var width, height;

function setup() {
    width = windowWidth;
    height = windowHeight;
    
    createCanvas(width-20, height-20);
    img = createGraphics(width-20, height-20);
}

function draw() {
    theta = (theta+.1)%360;
    if(mouseIsPressed){
        col = Math.floor(Math.random()*256);
    }
    
    img.fill(col);
    img.ellipse(mouseX, mouseY, 15*Math.sin(theta)+50, 15*Math.sin(theta)+50);
    
    image(img.get(), 0, 0);
}

function windowResized() {
    if(windowWidth > width || windowHeight > height){
        c = img.get();
        img = createGraphics(windowWidth-20, windowHeight-20);
        img.image(c, 0, 0);
    }
    
    width = windowWidth;
    height = windowHeight;
    resizeCanvas(width-20, height-20);
}
