let dot;

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
	}

	display(){
		stroke(0);
		point(this.x,this.y);
	}

	step(){
		const stepx = random(-1,1); 
		const stepy = random(-1,1);
		this.x += stepx;
		this.y += stepy;
	}
}