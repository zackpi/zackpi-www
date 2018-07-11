var Nx = 0, Ny = 0;
var K = 15;
var G = 7;
var M = 50;
var F = .01;
var L = 40;
var O = 50;
var R = 5;
var P = 3;

var selected;
var mousestart = false;
var fixed = [];

var DM_LINE = 0, DM_FILL = 1, DM_TEXT = 2;
var dm_slider;

function spring(node, other){
    // determine distance and angle between nodes
    dely = node.y-other.y;
    delx = node.x-other.x;
    theta = Math.atan2(dely, delx)
    radius = Math.sqrt(delx*delx + dely*dely);
    
    // compute spring force
    force = K*(L-radius);
    fx = force*Math.cos(theta);
    fy = force*Math.sin(theta);
    
    // add to acceleration of node
    node.ddx += fx/M;
    node.ddy += fy/M;
}

var net = new Array(Ny);
function setup(){
    Nx = Math.floor((windowWidth-50)/L/2);
    Ny = Math.floor((windowHeight-250)/L);
    createCanvas((windowWidth-50)/2, windowHeight-100);
    
    for(var j = 0; j < Ny; j++){
        net[j] = new Array(Nx);
        for(var i = 0; i < Nx; i++){
            net[j][i] = {x: i*(L-2)+O, y: j*(L-2)+O, dx: 0, dy: 0, ddx: 0, ddy: 0, pos: [j,i]};
        }
    }
    fixed = [net[0][0], net[0][Math.floor(Nx/2)], net[0][Nx-1]];
    
    dm_slider = createSlider(0, 2, 0, 1);
}

function draw(){
    
    for(var j = 0; j < Ny; j++){
        for(var i = 0; i < Nx; i++){
            net[j][i].ddx = 0;
            net[j][i].ddy = G/M;
            
            if(i > 0){
                spring(net[j][i], net[j][i-1]);
            }
            if(i < Nx-1){
                spring(net[j][i], net[j][i+1]);
            }
            if(j > 0){
                spring(net[j][i], net[j-1][i]);
            }
            if(j < Ny-1){
                spring(net[j][i], net[j+1][i]);
            }
            
        }
    }
    
    if(mouseIsPressed){
        if(!mousestart){
            var closest = [0,0];
            var mindist = windowWidth*windowHeight;
            for(var j = 0; j < Ny; j++){
                for(var i = 0; i < Nx; i++){
                    d = (mouseX-net[j][i].x)**2 + (mouseY-net[j][i].y)**2
                    if(d < mindist){
                        closest = [j,i];
                        mindist = d;
                    }
                }
            }
            if(mindist < R*R){
                selected = closest;
            }
            mousestart = true;
        }else{
            if(selected !== undefined){
                cursor(MOVE);
                node = net[selected[0]][selected[1]];
                node.x = mouseX;
                node.y = mouseY;
                node.dx = 0;
                node.dy = 0;
                node.ddx = 0;
                node.ddy = 0;
            }else{
                for(var j = 0; j < Ny; j++){
                    for(var i = 0; i < Nx; i++){
                        dely = net[j][i].y-mouseY;
                        delx = net[j][i].x-mouseX;
                        radius = Math.sqrt(delx*delx + dely*dely);
                        
                        dmy = mouseY - pmouseY;
                        dmx = mouseX - pmouseX;
                        theta = Math.atan2(dmy, dmx)
                        velocity = dmx*dmx + dmy*dmy;
                        
                        force = Math.min(P*velocity/radius, 100);
                        fx = force*Math.cos(theta);
                        fy = force*Math.sin(theta);
                        
                        net[j][i].ddx += fx/M;
                        net[j][i].ddy += fy/M;
                    }
                }
            }
        }
    }else{
        if(selected !== undefined){
            var node = net[selected[0]][selected[1]];
            var ind = fixed.indexOf(node);
            if(ind == -1){
                fixed.push(node);
            }else{
                fixed.splice(ind, 1);
            }
        }
        
        cursor(HAND);
        selected = undefined;
        mousestart = false;
    }
    
    for(var node in fixed){
        fixed[node].ddx = 0;
        fixed[node].ddy = 0;
    }
    
    for(var j = 0; j < Ny; j++){
        for(var i = 0; i < Nx; i++){
            net[j][i].dx *= 1-F;
            net[j][i].dy *= 1-F;
            net[j][i].dx += net[j][i].ddx;
            net[j][i].dy += net[j][i].ddy;
            net[j][i].x += net[j][i].dx;
            net[j][i].y += net[j][i].dy;
        }
    }
    
    clear();
    for(var j = 0; j < Ny; j++){
        for(var i = 0; i < Nx; i++){
            x = net[j][i].x;
            y = net[j][i].y;
            
            switch(dm_slider.value()){
            case DM_LINE:
                stroke(127);
                noFill();
                if(i < Nx-1){
                    line(x, y, net[j][i+1].x, net[j][i+1].y);
                }
                if(j < Ny-1){
                    line(x, y, net[j+1][i].x, net[j+1][i].y);
                }
                
                fill(255);
                ellipse(net[j][i].x, net[j][i].y, 2*R, 2*R);
                break;
            
            case DM_FILL:
                if(i < Nx-1 && j < Ny-1){
                    noStroke();
                    var x0 = net[j][i].x, y0 = net[j][i].y;
                    var x1 = net[j][i+1].x, y1 = net[j][i+1].y;
                    var x2 = net[j+1][i+1].x, y2 = net[j+1][i+1].y;
                    var x3 = net[j+1][i].x, y3 = net[j+1][i].y;
                    
                    var hval;
                    var delx = x1-x0;
                    if(delx == 0){
                        hval = 100;
                    }else{
                        var th = Math.atan((y1-y0)/delx)
                        hval = Math.floor(map(th, -1.57, 1.57, 0, 255));
                    }
                    var sval = Math.floor(100);
                    var lval = Math.floor(100);
                    
                    var c = color("hsl(" + hval + ", 70%, 50%)");
                    fill(c);
                    quad(x0, y0, x1, y1, x2, y2, x3, y3);
                }
                break;
            
            case DM_TEXT:
                stroke(200);
                if(i < Nx-1){
                    line(x, y, net[j][i+1].x, net[j][i+1].y);
                }
                if(j < Ny-1){
                    line(x, y, net[j+1][i].x, net[j+1][i].y);
                }
                if(i < Nx-1 && j < Ny-1){
                    noStroke();
                    var x0 = net[j][i].x, y0 = net[j][i].y;
                    var x1 = net[j][i+1].x, y1 = net[j][i+1].y;
                    var x2 = net[j+1][i+1].x, y2 = net[j+1][i+1].y;
                    var x3 = net[j+1][i].x, y3 = net[j+1][i].y;
                    
                    fill(100);
                    quad(x0, y0, x1, y1, x3, y3, x2, y2);
                }
                break;
            
            default: break;
            }
        }
    }
}

function windowResized(){
    resizeCanvas(windowWidth-50, windowHeight-100);
    Nx = Math.floor((windowWidth-50)/L/2);
    Ny = Math.floor((windowHeight-250)/L);
    for(var j = 0; j < Ny; j++){
        net[j] = new Array(Nx);
        for(var i = 0; i < Nx; i++){
            net[j][i] = {x: i*(L-2)+O, y: j*(L-2)+O, dx: 0, dy: 0, ddx: 0, ddy: 0, pos: [j,i]};
        }
    }
    fixed = [net[0][0], net[0][Math.floor(Nx/2)], net[0][Nx-1]];
}
