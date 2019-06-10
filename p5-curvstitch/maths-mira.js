"use strict";
var v=1 ;
var inc=1;
var record = false;
var datas = [];
var rotation = false;
var anglerot = 0;
var nbsectors = 4;
var frameslider;
var redslider;
var grnslider;
var bluslider;
var mystop = false;

var mira_a = 0.320;
var mira_b = 1.0;
var mira_x = 12.0;
var mira_y = 0.0;
var mira_nbiter = 20 ;

function setup() {
  createCanvas(800,400);
  background(255);
  smooth();
  frameslider = createSlider(10, 60, 25, 1);
  frameslider.position(700, 600);
  frameslider.style('width', '80px');
  redslider = createSlider(0, 255, 0, 1);
  redslider.position(700, 620);
  redslider.style('width', '80px');
  grnslider = createSlider(0, 255, 0, 1);
  grnslider.position(700, 640);
  grnslider.style('width', '80px');
  bluslider = createSlider(0, 255, 0, 1);
  bluslider.position(700, 660);
  bluslider.style('width', '80px');
  noLoop();
  pixelDensity(200);

}
   
function draw() {
    frameRate(frameslider.value());
    stroke(redslider.value(), grnslider.value(), bluslider.value(), 150);

    if (!record && !rotation) {
        background(255);
    } 
    if (v>40) {
        inc=-1;
    }
    if (v<2) {
        inc=1;
    }
    if (rotation && !record){
        translate(width/2, height/2);
        anglerot +=1;
        if (anglerot > 360) {
            anglerot = 0;
        }
        rotate(anglerot);
    }
    if (!record) {
        if (!rotation) {
            v+=inc;
        }
        graph(false);
    } else {
        if (iter >= datas.length) {
            iter = 0;
        }
        if (iter == 0) {
            background(255);
        }
        line(datas[iter].x1, datas[iter].y1, datas[iter].x2, datas[iter].y2) ;
        iter +=1;
    }
    //if (frameCount>500) noLoop();
}
   
function FMira(x) {
    x = abs(x);
    //console.log(x, sqrt(x));
    var result = mira_a * x + (1.0 - mira_a) * (2.0 * sqrt(x) / (1.0 + sqrt(x))) ;
    //console.log(mira_a, x, result);
    return result;
}

function graph(recdatas) {
    var n ;
    var x0 = mira_x;
    var y0 = mira_y;
    var x1, y1 = 0;
    
    if (recdatas) {
        datas = [];
        iter = 0;
    }
 
    for (n = 0 ; n <= mira_nbiter ; n+=1) {
        if (recdatas) {
            datas.push({x1: x0, y1:y0, x2:x0, y2:y0});
        } else {
            line(x0, y0, x0, y0) ;
        }       
        x1 = mira_b * y0 + FMira(x0);
        y1 = FMira(x1) - x0;
            //console.log({x1: x0, y1:y0, x2:x0, y2:y0});
        x0 = x1;
        y0 = y1;
    }
}

function keyPressed () {
    if (key=='s' || key == 'S'){
        saveCanvas("myProcessing"+frameCount+".png", 'png');
    }
    if (key=='x' || key == 'X'){
        println('nombre de segments lors du stop :' + v);
        if (stop) {
            stop = false ;
            println('relance');
            redraw();
        } else {
            stop = true ;
            noLoop();    
        }
        
    }
    if (key=='g' || key == 'G'){
        /*
         * On inverse la valeur du booléen "record"
         * Si record est vrai, alors on retrace la dernière forme en 
         * l'enregistrant dans le tableau "
        */
        record = !record;
        if (record) {
            println('tracé progressif pour '+v+' segments');
            graph(true);
        } else {
            println('retour au tracé global (un graphique complet par frame');
        }
    }
    if (key=='r' || key == 'R'){
        /*
         * l'activation de la rotation n'est possible que dans le premier 
         * mode d'affichage (tracé global à raison d'un graphique par frame)
         */
        if (!record) {
           rotation = !rotation;
        }
    }
    if (key=='1') {
        nbsectors = 1;
    }
    if (key=='2') {
        nbsectors = 2;
    }
    if (key=='3') {
        nbsectors = 3;
    }
    if (key=='4') {
        nbsectors = 4;
    }
    if (key=='5') {
        nbsectors = 5;
    }
    if (key=='6') {
        nbsectors = 6;
    }
    if (key=='7') {
        nbsectors = 7;
    }
    if (key=='8') {
        nbsectors = 8;
    }
    if (key=='9') {
        nbsectors = 9;
    }
    if (key=='0') {
        nbsectors = 10;
    }
    
}
