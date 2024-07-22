class Complex {
    
    constructor(a, b, ispolar = false){
        if (!ispolar) {
            this.re = a;
            this.im = b;
            this.mod = Math.sqrt(a*a + b*b);
            this.arg = Math.atan2(b, a);
        }
        else {
            this.re = a*Math.cos(b);
            this.im = a*Math.sin(b);
            this.mod = a
            this.arg = b
        }
    }

    add(w){ return new Complex(this.re + w.re, this.im + w.im); }
    sub(w){ return new Complex(this.re - w.re, this.im - w.im); }

    neg(){ return new Complex(-this.re, -this.im); }
    conj(){ return new Complex(this.re, -this.im); }
    inv(){ return new Complex(1 / this.mod, -this.arg, true); }

    mul(w){ return new Complex(this.mod * w.mod, this.arg + w.arg, true); }
    div(w){ return new Complex(this.mod / w.mod, this.arg - w.arg, true); }


    static pow(z, n) {
        return new Complex(Math.pow(z.mod, n), n*z.arg, true);
    }

    static exp(z){
        return new Complex(Math.exp(z.re), z.im, true);
    }

    static sinh(z){
        return this.exp(z).sub(this.exp(z.neg())).div(new Complex(2, 0));
    }

    static cosh(z){
        return this.exp(z).add(this.exp(z.neg())).div(new Complex(2, 0));
    }

    static sin(z){
        return this.sinh(z.mul(new Complex(0,1))).mul(new Complex(0,-1))
    }

    static cos(z){
        return this.cosh(z.mul(new Complex(0,1)));
    }

    static tan(z){
        return this.sin(z).div(this.cos(z));
    }

    static tanh(z){
        return this.sinh(z).div(this.cosh(z));
    }


    static f(z) {
        return this.sin(z);
    }
}


// Давайте рисавать =================================================================================================== //

let scale = 20;
let xOffset = 0;
let yOffset = 0;
let gridIsOn = 1;
let axesIsOn = 1;

function setup() {
  createCanvas(900, 500);
}

function scx(num) {
    return Math.round(width/2 + scale*num + xOffset);
}

function scy(num) {
    return Math.round(height/2 - scale*num + yOffset);
}

function mouseDragged() {
    xOffset += mouseX - pmouseX;
    yOffset += mouseY - pmouseY;
}

function mouseWheel(event) {
    let delta = event.delta;
    if (delta < 0) {
    scale *= 1.1;
    } else {
    scale *= 0.9;
    }
}

function gridOnOff() {
    gridIsOn = (gridIsOn + 1)%2;
}

function axesOnOff() {
    axesIsOn = (axesIsOn + 1)%2;
}

function reset(){
    scale = 20;
    xOffset = 0;
    yOffset = 0;
    gridIsOn = 1;
    axesIsOn = 1;
}

function GridandAxes() {

    stroke(150);

    if (gridIsOn) {
        for (var i = scx(0); i>0; i -= scale) { line(i, -height, i, height); }
        for (var i = scx(0); i<width; i += scale) { line(i, -height, i, height); }

        for (var i = scy(0); i>0; i -= scale) { line(-width, i, width, i); }
        for (var i = scy(0); i<height; i += scale) { line(-width, i, width, i); }
    }

    if (axesIsOn) {
        stroke(0);
        line(-width, scy(0), width, scy(0));
        line(scx(0), -height, scx(0), height);
        stroke(150);
    }
}

function Border(){
    stroke(0);
    strokeWeight(5);
    line(0,0,0,height);
    line(0,0,width,0);
    line(width,0,width,height);
    line(0,height,width,height);
    strokeWeight(1);
    stroke(150);
}

function setpoint(w, h=0, s=1, v=1){
    push();
    colorMode(HSB, 360, 1, 1);
    fill(h, s, v);
    strokeWeight(2);
    stroke(0);
    circle(scx(w.re), scy(w.im), 10);
    pop();
}

function ComplexMap(a, h=0.05){
    
    for (let j=-a; j<a+1; j++) {

        let z_prev = Complex.f(new Complex(-a, j));
        let z_cur = Complex.f(new Complex(-a+h, j));

        let w_prev = Complex.f(new Complex(j, -a));
        let w_cur = Complex.f(new Complex(j, -a+h));

        for (let i=-a; i<a+h; i+=h){

            push();
            stroke("red");
            strokeWeight(2);
            line(scx(z_prev.re), scy(z_prev.im), scx(z_cur.re), scy(z_cur.im));
            pop();

            push();
            stroke("blue");
            strokeWeight(2);
            line(scx(w_prev.re), scy(w_prev.im), scx(w_cur.re), scy(w_cur.im));
            pop();

            z_prev = z_cur;
            z_cur = Complex.f(new Complex(i+h, j));

            w_prev = w_cur;
            w_cur = Complex.f(new Complex(j, i+h));
        }
    }
}

function draw() {
    background(255);

    GridandAxes();
    ComplexMap(2);
    setpoint(new Complex(1,1,true), 111,1,1);

    Border()
}