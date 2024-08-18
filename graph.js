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
        let res = this.exp(z.mul(-0.577215664902)).div(z);

        for (let i=1; i<100; i++) {

            //res = res.mul( this.exp( z.div(i) ).div(z.div(i).add(new Complex(1,0))) );
            res = res.mul( this.exp(new Complex(z.re / i, z.im / i)).div(new Complex(z.re / i + 1, z.im / i) ) );
        }

        // new Complex(z.re / i + 1, z.im / i)

        return res;
    }


    static f(z) {
        //return this.sin(this.ln(z.sub( (new Complex(1,1)).div(z.add(new Complex(0,1))) )));
        //return ( ( z.mul(new Complex(0,-1)).add(new Complex(1,0)) ).mul(Math.E) ).add( (new Complex(0,1)).mul(z).mul( this.exp(this.exp( (new Complex(0,1)).div(z) ) ) ) );
        //return (new Complex(1,0)).sub( z.mul(new Complex(0,1)) ).add( (new Complex(0,1)).mul( z.mul( this.exp( (new Complex(0,1)).div(z) ) ) ) );
        //return this.gamma( (new Complex(10,0)).div( this.pow(z,5).add( new Complex(1,0) ) ) )
        //return ( new Complex(Math.E, 0).sub( this.exp( (new Complex(0,1)).div(z) ).mul( this.exp( this.exp( (new Complex(0,1)).div(z) ) ) ) ) )

        //return ( this.exp( (new Complex(0,1)).mul(z) ).mul( this.exp(this.exp( (new Complex(0,2)).mul(z) )) ).sub( new Complex(Math.E, 0) ) ).div(this.sin(z));

        //return ( (new Complex(1,0)).sub( this.exp( (new Complex(0,1)).mul(z) ).div( (new Complex(1,0)).add(z.mul(z)) ) ) ).div( z.mul(z) )

        //return (new Complex(0,-1)).mul( this.ln( (new Complex(0,1)).mul(z).add( this.pow( (new Complex(1,0)).sub(z.mul(z)), 0.5 ) ) ) )

        //return this.ln(z.sub(this.sin(z.add(this.sin(z.inv())))));
        return this.pow(z, 2);
    }

    // static g(z) {
    //     return this.tan(z);
    // }
}


// Давайте рисавать =================================================================================================== //

var N = 10;
var R = 2;
var C = new Complex(-0.25,0.1)

var C1 = hsvToRgb(227.6, 0.76, 0.268);
var C2 = hsvToRgb(147, 0.2, 1);

let resW = 16*60;
let resH = 9*60;

let scale = 100;
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

function setup(){ 
    createCanvas(resW, resH);
    colorMode(HSB, 360, 1, 1);
    frameRate(60); 
}

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

    if (str2.split(" ").join("") !== "") { return "ERR"; }

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
        strokeWeight(2);

        let sc = 1;

        if (scale < 20){
            sc = Math.pow(2, Math.floor(Math.log2(40 / scale)));
        }

        for (var i = scx(0); i>0; i -= sc * scale) { line(i, -height, i, height); }
        for (var i = scx(0); i<width; i += sc * scale) { line(i, -height, i, height); }

        for (var i = scy(0); i>0; i -= sc * scale) { line(-width, i, width, i); }
        for (var i = scy(0); i<height; i += sc * scale) { line(-width, i, width, i); }
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
        }
    };
    updatePixels();
}

function Fractal(N_){

    let zx, zy, z, h, s, v, col;
    loadPixels();

    for (let i=0; i<width; i++){
        for (let j=0; j<height; j++){
            
            zx = (i - xOffset - width/2) / scale;
            zy = (height/2 - j + yOffset) / scale;
            //z = Complex.f(Complex.f(new Complex(zx, zy)));
            z = new Complex(zx, zy);

            for (let k=0; k<N_; k++){ 
                z = Complex.f(z).add(new Complex(zx, zy));
            }

            if (z.mod < R) {

                // pixels[4*width*j + 4*i] = C1[0] + (C2[0] - C1[0])*(N_-1)/N;
                // pixels[4*width*j + 4*i + 1] = C1[1] + (C2[1] - C1[1])*(N_-1)/N;
                // pixels[4*width*j + 4*i + 2] = C1[2] + (C2[2] - C1[2])*(N_-1)/N
                // pixels[4*width*j + 4*i + 3] = 255;

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
            }

            else {
                pixels[4*width*j + 4*i] = pixels[4*width*j + 4*i];
                pixels[4*width*j + 4*i + 1] = pixels[4*width*j + 4*i + 1];
                pixels[4*width*j + 4*i + 2] = pixels[4*width*j + 4*i + 2];
                pixels[4*width*j + 4*i + 3] = 255;
            }
        }
    }
    updatePixels();
}

function SetPoint(z) { circle(scx(z.re), scy(z.im), 10); }

function mouseDragged() {

    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height){
        xOffset += mouseX - pmouseX;
        yOffset += mouseY - pmouseY;
        rebuild = true;
    }
}

// function mouseWheel(event) {
//     let delta = event.delta;
//     if (delta < 0) {
//     scale *= 1.1;
//     } else {
//     scale *= 0.9;
//     }
//     rebuild = true;
// }

function draw() {    
    if (rebuild) {
        createCanvas(resW, resH);
        //DomainColoring();
        //background(227.6, 0.76, 0.268);
        //for (let i=2;i<N;i++){ Fractal(i); }
        Fractal(N);

        GridandAxes();
        Border();

        rebuild = false;
        document.getElementById('waitText').style.display = 'none';
    }

    document.getElementById("hui1").innerText = resW.toString() + " " + resH.toString();
    document.getElementById("hui2").innerText = xOffset.toString() + " " + yOffset.toString();
    document.getElementById("hui3").innerText = scale;
    document.getElementById("hui4").innerText = gridIsOn.toString() + " " + axesIsOn.toString() + " " + factorsIsOn.toString();
    //document.getElementById("hui5").innerText = eval("Complex.sin(z)");  + 2 * z + i - z / 3 - z^i
}

// let a;

// try {
//     a = eval("(new Complex(1,0)).add(new Complex(1,0))").mod;
//     console.log('> SUSCHTSCH said: ' + a);
// } catch(e) {
//     console.log('> SUSCHTSCH said: ' + e);
// }
