var Nx = 80, Ny = 60;
var L = 0;
var hw = 0, hh = 0;
var mousestart = false;

var gol;
function setup(){
    createCanvas(windowWidth-30, windowHeight-90);
    L = 2*windowWidth/Nx;
    
    gol = new Array(Ny);
    for(var j = 0; j < Ny; j++){
        gol[j] = new Array(Nx);
        for(var i = 0; i < Nx; i++){
            gol[j][i] = 0;
        }
    }
        
    resize();
}

function draw(){
    if(mouseIsPressed){
        if(!mousestart){
            var mi = Math.floor(mouseX/L+Nx/4);
            var mj = Math.floor(mouseY/L+Ny/4);
            gol[mj][mi] += 50;
        }
        mousestart = true;
    }else{
        mousestart = false;
    }
    
    var next = new Array(Ny);
    for(var j = 0; j < Ny; j++){
        next[j] = new Array(Nx);
        for(var i = 0; i < Nx; i++){
            next[j][i] = gol[j][i];
        }
    }
    
    for(var j = 0; j < Ny; j++){
        for(var i = 0; i < Nx; i++){
            var self = gol[j][i];
            var neighbors = [
                (i == 0)    ? self : gol[j][i-1],
                (i == Nx-1) ? self : gol[j][i+1],
                (j == 0)    ? self : gol[j-1][i],
                (j == Ny-1) ? self : gol[j+1][i]
            ];
            
            var count = 0;
            for(var k = 0; k < neighbors.length; k++){
                var nbr = neighbors[k];
                count += (nbr < self);
            }
            if(count >= 3 && count <= self){
                for(var k = 0; k < neighbors.length; k++){
                    if(neighbors[k] < self){
                        switch(k){
                            case 0: next[j][i-1]++; break;
                            case 1: next[j][i+1]++; break;
                            case 2: next[j-1][i]++; break;
                            case 3: next[j+1][i]++; break;
                            default: break;
                        }
                    }
                }
                next[j][i] -= count;
            }
        }
    }
    gol = next;
    
    clear();
    textSize(Math.floor(L/3));
    for(var j = 0; j < Ny; j++){
        for(var i = 0; i < Nx; i++){
            c = map(Math.min(gol[j][i], 9), 0, 9, 0, 255)
            noStroke();
            fill(c);
            
            x = Math.floor(i*L-Nx*L/4);
            y = Math.floor(j*L-Ny*L/4);
            rect(x, y, L, L);
            
            //fill(127);
            //var s = j+","+i;
            //text(s, x+L/2-L/12*s.length, y+L/2);
            
        }
    }
    
}

function resize(){
    resizeCanvas(windowWidth-30, windowHeight-90);
    L = 2*windowWidth/Nx;
}

function windowResized(){
    resize();
}
