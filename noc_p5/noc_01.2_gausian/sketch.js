let dot;
let tx = 0;
let ty = 1000000;

function setup() {
	createCanvas(windowWidth, windowHeight);
	dot = new Walker();
}

function draw() {
	dot.step();
	dot.display();
}

class Walker{
	constructor(){
		this.x = width/2;
		this.y = height/2;
		this.xOld = width/2;
		this.yOld = height/2;
	}

	display(){
		stroke(0);
		line(this.xOld,this.yOld,this.x,this.y);
	}

	
	// RANDOM GAUSIAN CURVE MOVEMENT
	// step(){
	// 	this.xOld = this.x;
	// 	this.yOld = this.y;
	// 	const stepx = randomGaussian(0,5); 
	// 	const stepy = randomGaussian(0,5);
	// 	this.x += stepx;
	// 	this.y += stepy;
	// }
	
	// RANDOM MONTECARLO PROBABILITY MOVEMENT
	// step(){
	// 	this.xOld = this.x;
	// 	this.yOld = this.y;
	// 	const stepx = monte()*5; 
	// 	const stepy = monte()*5;
	// 	this.x += stepx;
	// 	this.y += stepy;
	// }

	// RANDOM PERLIN NOISE MOVEMENT
	step(){
		this.xOld = this.x;
		this.yOld = this.y;
		tx+=0.03;
		ty+=0.03;
		const stepx = map(noise(tx),0,1,-2,2) 
		const stepy = map(noise(ty),0,1,-2,2)
		this.x += stepx;
		this.y += stepy;
	}

}

function monte(){
	let test = true;
	while(test){
		let r1 = random(-1,1);
		let prob = Math.sqrt(Math.abs(r1));
		let r2 = random(0,1);
		if(prob>r2){
			test = false;
			return r1;
		}
	}
}