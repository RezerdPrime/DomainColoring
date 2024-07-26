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

    mul(w){
        if (typeof(w) === "number"){
            return new Complex(this.re * w, this.im * w);
        }
        return new Complex(this.mod * w.mod, this.arg + w.arg, true); 
    }
    div(w){
        if (typeof(w) === "number"){
            return new Complex(this.re / w, this.im / w);
        }
        return new Complex(this.mod / w.mod, this.arg - w.arg, true); 
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

    static ln(z){
        return new Complex(Math.log(z.mod), z.arg);
    }

    static pow(z, w) {
        if (typeof(w) === "number"){
            return new Complex(Math.pow(z.mod, w), w*z.arg, true);
        }
        return this.exp(this.ln(z).mul(w));
    }

    static arctan(z){
        return ( new Complex(0, 0.5) ).mul( this.ln( (new Complex(0, 1).add(z)).div( (new Complex(0, 1).sub(z)) ) ) );
    }

    static gamma(z){
        let res = this.exp(z.mul(-0.577215664902)).div(z)

        for (let i=1; i<100; i++) {
            res = res.mul( this.exp(z.div(i)).div(z.div(i).add(new Complex(1,0))) );
        }

        return res;
    }


    static f(z) {
        return this.sin(this.ln(z.sub( (new Complex(1,1)).div(z.add(new Complex(0,1))) )));
    }
}


// Давайте рисавать =================================================================================================== //

let resW = 960;//16*40;
let resH = 540;//9*40;

let scale = 60;
let xOffset = 0;
let yOffset = 0;
let func = "";

let oplist = ["+", "-", "*", "/", "^", "(", ")"];
let numlist = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "i"]
let funclist = ["conj", "exp", "sin", "cos", "sinh", "cosh", "ln", "tan", "tanh", "arctan", "gamma", "z"]

let gridIsOn = false;
let axesIsOn = false;
let factorsIsOn = true;

let rebuild = true;

function setup(){ colorMode(HSB, 360, 1, 1); }

function scx(num) {
    return Math.round(width/2 + scale*num + xOffset);
}

function scy(num) {
    return Math.round(height/2 - scale*num + yOffset);
}

// function parser(input) {
//     const parsedFunc = input.replace(/([a-z]+)/g, 'Math.$1').replace(/([0-9.]+)/g, '$1');
//     //const result = eval(parsedFunc);
//     return parsedFunc;
// } sin(z+1.2)-ln(cos(1-2*z))

function parser(input){ // hui
    let str = input;
    let str2 = input;

    for (let i=0; i<oplist.length; i++){
        str = str.split(oplist[i]).join(" " + oplist[i] + " ");
        str2 = str2.split(oplist[i]).join(" ");
    }

    for (let i=0; i<numlist.length; i++){ str2 = str2.split(numlist[i]).join(" ");}
    for (let i=0; i<funclist.length; i++){ str2 = str2.split(funclist[i]).join(" ");}

    if (str2.split(" ").join("") !== "") { return "Input error"; }

    return "hui";
}

function reset(event){

    event.preventDefault();

    resW = 16*60;
    resH = 9*60;
    scale = 20;
    xOffset = 0;
    yOffset = 0;
    gridIsOn = false;
    axesIsOn = false;
    factorsIsOn = true;

    rebuild = true;
}

function submitshit(event) {

    let h = parseInt(document.getElementById('h').value);
    let w = parseInt(document.getElementById('w').value);

    let x = parseFloat(document.getElementById('x').value);
    let y = parseFloat(document.getElementById('y').value);

    let s = parseFloat(document.getElementById('s').value);
    let f = document.getElementById('f').value;
    
    let grid = document.getElementById("grid").checked;
    let axes = document.getElementById("axes").checked;
    let factor = document.getElementById("factor").checked;

    if (!isNaN(w) && !isNaN(h)) {
        if (h > 0 && w > 0){
            resW = w;
            resH = h;
        }
    }
    if (!isNaN(x) && !isNaN(y)) {
        xOffset = -x * scale;
        yOffset = y * scale;
    }

    if (!isNaN(s)) {
        scale = s;
    }

    gridIsOn = grid;
    axesIsOn = axes;
    factorsIsOn = factor;
    func = '"' + parser(f) + '"'; // hui

    rebuild = true;
}

function submitshita(event) {
    event.preventDefault();
    document.getElementById('waitText').style.display = 'block';

    setTimeout(function() {
        submitshit(event);
      }, 100);
}

function GridandAxes() {

    if (gridIsOn) {
        stroke(0,0,0.75);
        for (var i = scx(0); i>0; i -= scale) { line(i, -height, i, height); }
        for (var i = scx(0); i<width; i += scale) { line(i, -height, i, height); }

        for (var i = scy(0); i>0; i -= scale) { line(-width, i, width, i); }
        for (var i = scy(0); i<height; i += scale) { line(-width, i, width, i); }
    }

    if (axesIsOn) {
        stroke(0);
        strokeWeight(2);
        line(-width, scy(0), width, scy(0));
        line(scx(0), -height, scx(0), height);
    }
}

function Border(){
    stroke(0);
    strokeWeight(5);
    line(0,0,0,height);
    line(0,0,width,0);
    line(width,0,width,height);
    line(0,height,width,height);
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

function hsvToRgb(h, s, v) {
    let r, g, b;
    let i, f, p, q, t;
    if (s === 0) {
      r = g = b = v;
      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
    h /= 60;
    i = Math.floor(h);
    f = h - i;
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));
    switch (i) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      default: r = v; g = p; b = q; break;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
  

function DomainColoring(){

    let zx, zy, z, h, s, v, col;
    loadPixels();

    for (let i=0; i<width; i++){
        for (let j=0; j<height; j++){
            
            zx = (i - xOffset - width/2) / scale;
            zy = (height/2 - j + yOffset) / scale;

            z = Complex.f(new Complex(zx, zy));
            h = 180 / Math.PI * z.arg + ((z.arg < 0) ? 360 : 0);
            h = 360 * (h / 360 - Math.floor(h / 360));

            s = 1; v = 1;

            if (factorsIsOn) {
                s = 1 - Math.tanh(z.mod / 3);
                v = Math.tanh(z.mod);
            }

            col = hsvToRgb(h, s, v);

            pixels[4*width*j + 4*i] = col[0];
            pixels[4*width*j + 4*i + 1] = col[1];
            pixels[4*width*j + 4*i + 2] = col[2];
            pixels[4*width*j + 4*i + 3] = 255;
            // stroke(h, s, v);
            // strokeWeight(2);
            // point(i, j);
        }
    };
    updatePixels();
}

function SetPoint(z) { circle(scx(z.re), scy(z.im), 10); }

function draw() {
    
    if (rebuild) {
        createCanvas(resW, resH);

        DomainColoring();

        GridandAxes();
        Border();

        rebuild = false;
        document.getElementById('waitText').style.display = 'none';
    }

    document.getElementById("hui1").innerText = resW.toString() + " " + resH.toString();
    document.getElementById("hui2").innerText = xOffset.toString() + " " + yOffset.toString();
    document.getElementById("hui3").innerText = scale;
    document.getElementById("hui4").innerText = gridIsOn.toString() + " " + axesIsOn.toString() + " " + factorsIsOn.toString();
    document.getElementById("hui5").innerText = func;//eval("Complex.sin(new Complex(1,1))").mod;
}
