var Nx = 80, Ny = 60;
var L = 0;
var hw = 0, hh = 0;

var running = true;
var mousestart = false;
var img;

var gol;
function conway(next, i, j){
    var self = gol[j][i];
    var count = 0;
    
    if(i > 0){
        if(j > 0) count += (gol[j-1][i-1] > 0);
        if(j < Ny-1) count += (gol[j+1][i-1] > 0);
        count += (gol[j][i-1] > 0);
    }
    if(i < Nx-1){
        if(j > 0) count += (gol[j-1][i+1] > 0);
        if(j < Ny-1) count += (gol[j+1][i+1] > 0);
        count += (gol[j][i+1] > 0);
    }
    if(j > 0) count += (gol[j-1][i] > 0);
    if(j < Ny-1) count += (gol[j+1][i] > 0);
    
    if(self){
        if(count < 2){ 
            next[j][i] = 0;
        }else if(count > 3){
            next[j][i] = 0;
        }
    }else{
        if(count == 3){
            next[j][i] = 1;
        }
    }
}

function peak(next, i, j){
    
}

function sandpile(next, i, j){
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

function custom(next, i, j){
    
}

var rules;
var rulesslider;
var rulefunc = sandpile;
var rfs = {"conway": conway, "peak": peak, "sandpile": sandpile, "custom": custom};

var cm;
var cmslider;
var cmval = "gray";
var cmsliderval = 0;

function setup(){
    createCanvas(windowWidth-20, windowHeight-250);
    L = 2*(windowWidth-20)/(Nx-4);
    
    gol = new Array(Ny);
    for(var j = 0; j < Ny; j++){
        gol[j] = new Array(Nx);
        for(var i = 0; i < Nx; i++){
            gol[j][i] = 0;
        }
    }
    
    tablediv = createDiv();
    tablediv.style("display", "table");
    parentdiv = createDiv();
    parentdiv.style("display", "table-row");
    parentdiv.style("padding-left", "200px");
    parentdiv.parent(tablediv);
    
    celldiv1 = createDiv();
    celldiv1.style("display", "table-cell");
    ctrldiv = createDiv();
    ctrldiv.style("display", "table");
    ctrldiv.parent(celldiv1);
    
    cleardiv = createDiv();
    cleardiv.style("display", "table-row");
    cleardiv.parent(ctrldiv);
    clearbtn = createButton("clear");
    clearbtn.parent(cleardiv);
    clearbtn.mousePressed(newDrawing);
    
    pausediv = createDiv();
    pausediv.style("display", "table-row");
    pausediv.parent(ctrldiv);
    pausebtn = createButton("pause");
    pausebtn.parent(pausediv);
    pausebtn.mousePressed(function(){ running = false; });
    
    playdiv = createDiv();
    playdiv.style("display", "table-row");
    playdiv.parent(ctrldiv);
    playbtn = createButton("play");
    playbtn.parent(playdiv);
    playbtn.mousePressed(function(){ running = true; });
    ctrldiv.parent(parentdiv);
    
    celldiv2 = createDiv();
    celldiv2.style("display", "table-cell");
    celldiv2.parent(parentdiv);
    
    optionsdiv = createDiv();
    optionsdiv.style("display", "table");
    optionsdiv.parent(celldiv2);
    
    rulesdiv = createDiv();
    rulesdiv.style("display", "table-row");
    rulesdiv.parent(optionsdiv);
    
    rulestextdiv = createDiv();
    rulestextdiv.style("display", "table-cell");
    rulestext = createP("rules: ");
    rulestext.parent(rulestextdiv);
    rulestextdiv.parent(rulesdiv);
    
    ruleseldiv = createDiv();
    ruleseldiv.style("display", "table-cell");
    ruleseldiv.parent(rulesdiv);
    rules = createSelect();
    rules.option("sandpile");
    rules.option("conway");
    //rules.option("peak");
    //rules.option("custom");
    rules.changed(configCustomPanel);
    rules.parent(ruleseldiv);
    
    ruleslidediv = createDiv();
    ruleslidediv.style("display", "table-cell");
    ruleslidediv.parent(rulesdiv);
    rulesslider = createSlider(0,255,1);
    rulesslider.parent(ruleslidediv);
    rulesslider.hide();
    
    cmdiv = createDiv();
    cmdiv.style("display", "table-row");
    cmdiv.parent(optionsdiv);
    
    cmtextdiv = createDiv();
    cmtextdiv.style("display", "table-cell");
    cmtext = createP("color: ");
    cmtext.parent(cmtextdiv);
    cmtextdiv.parent(cmdiv);
    
    cmseldiv = createDiv();
    cmseldiv.style("display", "table-cell");
    cmseldiv.parent(cmdiv);
    cm = createSelect();
    cm.option("gray");
    //cm.option("rainbow");
    cm.option("custom");
    cm.changed(configCustomPanel);
    cm.parent(cmseldiv);
    
    cmslidediv = createDiv();
    cmslidediv.style("display", "table-cell");
    cmslidediv.parent(cmdiv);
    cmslider = createSlider(0,255,1);
    cmslider.changed(function(){ cmsliderval = cmslider.value(); });
    cmslider.parent(cmslidediv);
    cmslider.hide();
}

function draw(){
    if(running){
        var next = new Array(Ny);
        for(var j = 0; j < Ny; j++){
            next[j] = new Array(Nx);
            for(var i = 0; i < Nx; i++){
                next[j][i] = gol[j][i];
            }
        }
        
        for(var j = 0; j < Ny; j++){
            for(var i = 0; i < Nx; i++){
                rulefunc(next, i, j);
            }
        }
        gol = next;
        
        clear();
        var col;
        for(var j = 0; j < Ny; j++){
            for(var i = 0; i < Nx; i++){
                render(i, j);
            }
        }
    }
    
    if(mouseIsPressed && mouseY <= windowHeight-250){
        if(!mousestart){
            var mi = Math.floor(mouseX/L+2);
            var mj = Math.floor(mouseY/L+2);
            if(typeof gol !== "undefined"){
                if(gol[mj] !== undefined){
                    if(gol[mj][mi] !== undefined){
                        gol[mj][mi] += 50;
                    }
                }
            }
            render(mi, mj);
        }
        mousestart = true;
    }else{
        mousestart = false;
    }
}

function resize(){
    createCanvas(windowWidth-20, windowHeight-250);
    L = 2*(windowWidth-20)/(Nx-4);
}

function windowResized(){
    resize();
}

function newDrawing(){
    gol = new Array(Ny);
    for(var j = 0; j < Ny; j++){
        gol[j] = new Array(Nx);
        for(var i = 0; i < Nx; i++){
            gol[j][i] = 0;
        }
    }
    running = true;
}

function render(i, j){
    g = gol[j][i];
    if(rulefunc == conway){
        g *= 10;
    }
    if(cmval == "gray"){
        col = map(Math.min(g, 10), 0, 10, 0, 255);
    }else if(cmval == "rainbow"){
        col = color("hsl("+map(Math.min(g, 10), 0, 10, 0, 255)+
                            +", 100%, 50%)");
    }else if(cmval == "custom"){
        col = color(cmsliderval, map(Math.min(g, 10), 0, 10, 0, 255), 127);
    }
    
    stroke(col);
    fill(col);
    x = Math.floor((i-2)*L);
    y = Math.floor((j-2)*L);
    rect(x, y, L, L);
}

function configCustomPanel(){
    if(rules.value() == "custom"){
        rulesslider.show();
        
        
    }else{
        rulesslider.hide();
        rulefunc = rfs[rules.value()];
    }
    
    cmval = cm.value();
    if(cmval == "custom"){
        cmslider.show();
    }else{
        cmslider.hide();
    }
}
