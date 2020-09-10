let loc, vel, mover;

function setup() {
	createCanvas(windowWidth, windowHeight);
	// loc = createVector(100,100);
	// vel = createVector(10,10);
	mover = new Mover();
}

function draw() {
	// background(255);
	// loc.add(vel);
	// if ((loc.x > width) || (loc.x < 0)) {
	// 	vel.x = vel.x * -1;
	// }
	// if ((loc.y > height) || (loc.y < 0)) {
	// 	vel.y = vel.y * -1;
	// }
	// stroke(0);
	// fill(175);
	// ellipse(loc.x,loc.y,50,50)

	background(255);
	mover.update();
	mover.display();
}

class Mover{
	constructor(){
		this.location = createVector(width/2,height/2);
		this.velocity = createVector(0,0);
		this.acc = createVector(0,0.1);
	}

	update(){
		this.acc = p5.Vector.random2D();
		this.location.add(this.velocity);
		this.velocity.add(this.acc);
		if ((this.location.x > width) || (this.location.x < 0)) {
			this.velocity.x = this.velocity.x * -1;
		}
		if ((this.location.y > height) || (this.location.y < 0)) {
			this.velocity.y = this.velocity.y * -1;
		}
		this.velocity.limit(5)
	}

	display(){
		stroke(0);
		fill(175);
		ellipse(this.location.x,this.location.y,16,16);
	}
}