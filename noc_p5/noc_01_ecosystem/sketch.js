let actors = [];

function setup() {
	createCanvas(windowWidth-100, windowHeight-100);
	let bears = new Array(5).fill().map((a,i)=> new Bear(i))
	let flies = new Array(60).fill().map((a,i)=> new Fly(i))
	actors = [ ...bears, ...flies];
	frameRate(30)
}

function draw() {
	background(250,240,250);
	actors = actors.filter(a => a.alive);
	actors.forEach( actor => actor.update(actors));
	actors.forEach( actor => actor.display());
}

class Bear{
	constructor(i){
		this.loc = createVector(...randomLoc());
		this.vel = createVector(0,0);
		this.acc = createVector(0.1,0.1);
		this.color = [180, 75, 1];
		this.size = 100;
		this.species = 'bear';
		this.type = 'creature';
		this.maxSpeed = 2;
		this.maxAcc = 0.1;
		this.time = i*1000;
		this.alive = true;
		this.baseSmell = 1;
		this.smell = this.baseSmell;
		this.smellDecay = 0.002;
		this.smellFactor = 2;
	}

	display(){
		stroke(0);
		fill(...this.color);
		ellipse(this.loc.x,this.loc.y,this.size,this.size);
	}

	update(creatures){
		random() < 0.001 && this.poop();
		if(this.smell>this.baseSmell) this.smell -= this.smellDecay;
		let interaction = this.greet(creatures);
		!interaction && this.moveRandomly();
		this.edge();
	}

	moveRandomly(){
		const r = noise(this.time+=0.01);
		if(r < 0.2){
			this.acc = p5.Vector.mult(this.vel,-0.1);
		} else if(r < 1){
			let rAcc = p5.Vector.random2D();
			this.acc.add(rAcc);
			this.acc.limit(this.maxAcc)
		} 
		this.move();
	}

	move(){
		this.edge();
		this.vel.add(this.acc);
		this.vel.limit(this.maxSpeed);
		this.loc.add(this.vel);
	}

	greet(creatures){
		// check if creature interacted with anyone 
		let bears = creatures.filter( a => a.species === 'bear' && a !== this);
		let closeBears = bears.filter( a => p5.Vector.sub(this.loc,a.loc).mag() < this.size);
		if (closeBears.length){
			let closestBear = closeBears.sort( (a,b) => p5.Vector.sub(this.loc,a.loc).mag() <= p5.Vector.sub(this.loc,b.loc).mag() ? 1 : -1 ).pop();
			let distance = p5.Vector.sub(this.loc, closestBear.loc);
			if(distance.mag() < (this.size - this.maxSpeed*2) ){
				this.acc = distance.normalize().mult(this.maxSpeed);
			} else {
				const r = random();
				if(r < 0.99){
					this.acc = p5.Vector.mult(this.vel,-1);
				} else {
					this.acc = distance.normalize().mult(this.maxSpeed);
				}
			}
			
			this.move();
			return true;
		}
	}

	poop(){
		const poopSize = randomGaussian(30,5);
		this.smell += map(poopSize,0,40,0,this.smellFactor);
		actors.unshift(new Poop(this.loc.x,this.loc.y,poopSize))
	}

	edge(){
		if ((this.loc.x > width) || (this.loc.x < 0)||(this.loc.y > height) || (this.loc.y < 0)){
			this.vel.rotate(180)
			this.acc.rotate(180)
		}
	}

}

class Fly{
	constructor(i){
		this.loc = createVector(...randomLoc());
		this.vel = createVector(0,0);
		this.acc = createVector(0.1,0.1);
		this.color = [0, 0, 0];
		this.size = 5;
		this.type = 'creature';
		this.species = 'fly'
		this.maxSpeed = 5;
		this.maxAcc = 1;
		this.time = i*500;
		this.alive = true;
		this.maxSmellDistance = 200;
		this.target = undefined;
		this.targetUpdateTimer = 0;
		this.targetUpdateFrequency = 30;
		this.smell = 0;
	}

	display(){
		stroke(0);
		fill(...this.color);
		ellipse(this.loc.x,this.loc.y,this.size,this.size);
	}

	update(creatures){

		let closestCreature = creatures.map( creature => {
				let attraction = this.smellAttraction(creature);
				let creatureAttr = {creature,attraction};
				return creatureAttr;
			})
			.filter( c => c.attraction > 0 )
			.sort( (c1,c2) => c1.attraction - c2.attraction)
			.pop();
		if(this.targetUpdateTimer <= 0){
			if(!closestCreature){
				this.target = undefined;
			} else {
				this.target = closestCreature.creature;
				this.targetUpdateTimer = this.targetUpdateFrequency;
			}
		} 
		
		if(this.target){
			this.follow(this.target);
		} else {
			this.moveRandomly();
		}

		this.targetUpdateTimer--;
	}

	moveRandomly(){
		const r = random();
		if(r < 0.2){
			this.acc = p5.Vector.mult(this.vel,-0.1);
		} else if(r < 1){
			let rAcc = p5.Vector.random2D();
			this.acc.add(rAcc);
		} 
		this.acc.limit(this.maxAcc);
		this.move();
	}

	move(){
		this.edge();
		this.vel.add(this.acc);
		this.vel.limit(this.maxSpeed);
		this.loc.add(this.vel);
	}

	follow(target){
		let distance = p5.Vector.sub(target.loc, this.loc);
		let rAcc = p5.Vector.random2D().mult(this.maxAcc/2);
		this.acc.add(distance.normalize().mult(this.maxAcc/5)).add(rAcc);
		this.acc.limit(this.maxAcc);
		this.move();
	}

	edge(){
		if ((this.loc.x > width) || (this.loc.x < 0)||(this.loc.y > height) || (this.loc.y < 0)){
			this.vel.rotate(180)
			this.acc.rotate(180)
		}
	}

	smellAttraction(target){
		let distance = p5.Vector.sub(this.loc, target.loc).mag();
		// inverse square law 1 to 0 for distance, and multiplied by smellyness factor
		let attraction = sq(max(0,map(distance,0,this.maxSmellDistance,1,0)))*target.smell
		return attraction;
	}

}

// Self eexplanatory
class Poop{
	constructor(x,y,size){
		this.loc = createVector(x,y);
		this.size = size;
		this.age = 1;
		this.smell = this.age*map(this.size,0,40,0,5); // 0 to 5
		this.type = 'inanimate';
		this.alive = true;
		this.color = [74, 89, 23,map(this.age,0,1,0,255)];
	}

	update(){
		this.age -= 0.002;
		this.smell = this.age*map(this.size,0,40,0,5);
		this.color[3] = map(this.age,0,1,0,255);
		if(this.age < 0){
			this.alive = false;
		}
		// console.log(this.smell)
	}

	display(){
		noStroke();
		fill(...this.color);
		ellipse(this.loc.x,this.loc.y,this.size,this.size);
	}

}

// Function to genrate a random location vector for object creation
function randomLoc(){
	return [random(0,width),random(0,height)]
}