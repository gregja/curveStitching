
var v=100 ;
var inc=1;

function setup() {
  createCanvas(600,600);
  background(255);
  stroke(0, 90);
  frameRate(25);
}
   
function draw() {
    graph();
    noLoop();

}

function graph() {
    var r, g, t, h=0;
    var x=width/2;
    var y=height/2;
    for (h=0; h<=y+1; h+=y/v) {
        for (t=-1; t<=1; t+=2) {
            for (g=-1; g<=1; g+=2) {
                for (r=0; r<=1; r+=1) {
                    line(x+h+t, y*(1+g*r), x+y+t*r, y*(1+g)-h*g) ;
                }
            }
        }
    }
}