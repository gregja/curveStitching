var v=1 ;
var inc=1;
var record = 1;
var datas = [];
var rotation = 2;
var anglerot = 0;
var frameslider;
var redslider;
var grnslider;
var bluslider;
var mystop = false;
var iter;

function setup() {
  createCanvas(600,600);
  background(255);
  smooth();
  displaymode = createRadio();
  displaymode.option(" 1 ", 1);
  displaymode.option(" 2 ", 2);
  displaymode.style('width', '100px');
  displaymode.position(700, 660);
  displaymode.value(record);
  displayspan = createSpan('Display');
  displayspan.position(630, 660);

  rotationmode = createRadio();
  rotationmode.option(" oui ", 1);
  rotationmode.option(" non ", 2);
  rotationmode.style('width', '100px');
  rotationmode.position(700, 690);
  rotationmode.value(rotation);
  rotationspan = createSpan('Rotation');
  rotationspan.position(630, 690);

  frameslider = createSlider(10, 60, 25, 1);
  frameslider.position(700, 720);
  frameslider.style('width', '80px');
  framespan = createSpan('Nb FPS');
  framespan.position(630, 720);

  redslider = createSlider(0, 255, 0, 1);
  redslider.position(700, 740);
  redslider.style('width', '80px');
  redspan = createSpan('Red');
  redspan.position(630, 740);

  grnslider = createSlider(0, 255, 0, 1);
  grnslider.position(700, 760);
  grnslider.style('width', '80px');
  grnspan = createSpan('Green');
  grnspan.position(630, 760);

  bluslider = createSlider(0, 255, 0, 1);
  bluslider.position(700, 780);
  bluslider.style('width', '80px');
  bluspan = createSpan('Blue');
  bluspan.position(630, 780);
}

function draw() {
    frameRate(frameslider.value());
    stroke(redslider.value(), grnslider.value(), bluslider.value(), 150);

    displaymode.changed(changeMode);
    rotationmode.changed(changeRotation);

    if (record == 1 && rotation == 2) {
        background(255);
    }
    if (v>40) {
        inc=-1;
    }
    if (v<2) {
        inc=1;
    }
    if (rotation == 1 && record == 1){
        translate(width/2, height/2);
        anglerot +=1;
        if (anglerot > 360) {
            anglerot = 0;
        }
        rotate(anglerot);
    }
    if (record == 1) {
        if (rotation != 1) {
            v+=inc;
        }
        graph(false);
    } else {
        if (iter >= datas.length-1) {
            noLoop();
            mystop = true;
        }
        if (iter >= datas.length) {
            iter = 0;
        }
        if (iter === 0) {
            background(255);
        }
        line(datas[iter].x1, datas[iter].y1, datas[iter].x2, datas[iter].y2) ;
        iter +=1;
    }
    //if (frameCount>500) noLoop();
}

function graph(recdatas) {
    if (recdatas) {
        datas = [];
        iter = 0;
    }
    var r, g, t, h=0;
    var x=width/2;
    var y=height/2;
    var x1, y1, x2, y2;
    for (h=0; h<=y+1; h+=y/v) {
        for (t=-1; t<=1; t+=2) {
            for (g=-1; g<=1; g+=2) {
                for (r=0; r<=1; r+=1) {
                    x1 = x+h*t;
                    y1 = y*(1+g*r);
                    x2 = x+y*t*r;
                    y2 = y*(1+g)-h*g;
                    if (recdatas) {
                        datas.push({x1: x1, y1:y1, x2:x2, y2:y2});
                    } else {
                        line(x1, y1, x2, y2) ;
                    }
                }
            }
        }
    }
}

function keyPressed () {
    if (key=='s' || key == 'S'){
        saveCanvas("stitch01-"+frameCount+".png", 'png');
    }
    if (key=='x' || key == 'X'){
        if (mystop) {
            mystop = false ;
            console.log('relance');
            loop();
            redraw();
        } else {
            console.log('nombre de segments lors du stop :' + v);
            mystop = true ;
            noLoop();
        }
    }
}

function changeMode() {
    /*
     * On inverse la valeur du booléen "record"
     * Si record est vrai, alors on retrace la dernière forme en
     * l'enregistrant dans le tableau "
     */
    record = displaymode.value();

    if (record == 2) {
        console.log('tracé progressif pour '+v+' segments');
        graph(true);
        rotation = 2;
        rotationmode.value(rotation);
    } else {
        console.log('retour au tracé global (un graphique complet par frame');
        if (mystop) {
            mystop = false;
            loop();
            redraw();
        }
    }
    return true;
}

function changeRotation() {
    /*
     * l'activation de la rotation n'est possible que dans le premier
     * mode d'affichage (tracé global à raison d'un graphique par frame)
     */
    rotation = rotationmode.value();
    if (record == 2) {
        rotation = 2;
        rotationmode.value(rotation);
    }
}