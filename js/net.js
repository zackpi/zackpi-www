var N = 15;
var K = 20;
var G = 10;
var M = 50;
var F = .02;
var L = 50;
var O = 50;
var R = 5;

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

var net = new Array(N);
function setup(){
    createCanvas(windowWidth-50, windowHeight-100);
    
    for(var j = 0; j < N; j++){
        net[j] = new Array(N);
        for(var i = 0; i < N; i++){
            net[j][i] = {x: i*L+O, y: j*L+O, dx: 0, dy: 0, ddx: 0, ddy: 0, pos: [j,i]};
        }
    }
}

function draw(){
    clear();
    fill(255);
    
    for(var j = 0; j < N; j++){
        for(var i = 0; i < N; i++){
            net[j][i].ddx = 0;
            net[j][i].ddy = G/M;
            
            if(i > 0){
                spring(net[j][i], net[j][i-1]);
            }
            if(i < N-1){
                spring(net[j][i], net[j][i+1]);
            }
            if(j > 0){
                spring(net[j][i], net[j-1][i]);
            }
            if(j < N-1){
                spring(net[j][i], net[j+1][i]);
            }
        }
    }
    
    net[0][0].ddx = 0;
    net[0][0].ddy = 0;
    net[0][N-1].ddx = 0;
    net[0][N-1].ddy = 0;
    
    for(var j = 0; j < N; j++){
        for(var i = 0; i < N; i++){
            net[j][i].dx *= 1-F;
            net[j][i].dy *= 1-F;
            net[j][i].dx += net[j][i].ddx;
            net[j][i].dy += net[j][i].ddy;
            net[j][i].x += net[j][i].dx;
            net[j][i].y += net[j][i].dy;
            
            /*
            if(net[j][i].x < R){
                net[j][i].x = R;
                net[j][i].dx = 0;
            }
            if(net[j][i].x > windowWidth-50-R){
                net[j][i].x = windowWidth-50-R;
                net[j][i].dx = 0;
            }
            if(net[j][i].y < R){
                net[j][i].y = R;
                net[j][i].dy = 0;
            }
            if(net[j][i].y > windowHeight-100-R){
                net[j][i].y = windowHeight-100-R;
                net[j][i].dy = 0;
            }
            */
        }
    }
    
    
    
    for(var j = 0; j < N; j++){
        for(var i = 0; i < N; i++){
            ellipse(net[j][i].x, net[j][i].y, 2*R, 2*R);
        }
    }
}

function windowResized(){
    resizeCanvas(windowWidth-50, windowHeight-100);
}
