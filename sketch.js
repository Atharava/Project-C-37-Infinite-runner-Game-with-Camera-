
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

var runningMan;
var man;
var bg, ground, invisWall;
var gamestate, argument, score, count;
	var PLAY = 1;
	var END = 2;
	var TRUE = 2;
	var FALSE = 3;

var manDed, dethScreen, reviveButton, groundImg;
var spikes;

var spikesGroup;

var cameraLimit;

// var camera1;

function preload(){
	runningMan = loadAnimation("Image/Image.001.png","Image/Image.002.png","Image/Image.003.png","Image/Image.004.png","Image/Image.005.png","Image/Image.005.png","Image/Image.006.png","Image/Image.007.png","Image/Image.008.png","Image/Image.009.png","Image/Image.010.png","Image/Image.011.png");
	bg = loadImage("longbg2.png");
	manDed = loadAnimation("manDed2.png");
	spikes = loadImage("spikes.png");
	dethScreen = loadImage("dedScreen.png");
	reviveButton = loadImage("restartImg.png");
	groundImg = loadImage("ground1.png");
}

function setup() {
	createCanvas(displayWidth, displayHeight);

	frameRate(30);

	argument = TRUE;

	score = 0;
	count = 0;

	gamestate = PLAY

	backGround = createSprite(displayWidth, displayHeight/2, 3800, displayHeight);
	backGround.addImage(bg);
	//backGround.velocityX = -3;

	dedScreen = createSprite(displayWidth/2, displayHeight/2 - 100, 500, 500);
	dedScreen.addImage(dethScreen);
	dedScreen.scale = 0.5;
	dedScreen.visible = false;

	man = createSprite(138, 598, 200, 200);
	man.debug = true;
	man.setCollider("rectangle", -40, -10, 300, 450);
	man.addAnimation("run", runningMan);
	man.addAnimation("ded", manDed);
	man.scale = 0.5;

	ground = createSprite(200,displayHeight-10,displayWidth,20);
	ground.debug = true;
	ground.addImage(groundImg);
	ground.x = ground.width /2;

	invisWall = createSprite(16, 735, 50, displayHeight);
	invisWall.visible = false;

	restart = createSprite(displayWidth/2, displayHeight/2+200, 200, 200);
	restart.addImage(reviveButton);
	restart.scale = 0.3;
	restart.visible = false;

	spikesGroup = new Group();


	engine = Engine.create();
	world = engine.world;

	Engine.run(engine);
  
}


function draw() {
	rectMode(CENTER);
	background(255);
	findMousePos();
	cameraLimit = (displayHeight-130)-(backGround.height/2);

	// console.log(cameraLimit);

	man.collide(ground);
	man.collide(invisWall);
	
	if(backGround.x===0){
		backGround.x = displayWidth;
	}

	if(gamestate === PLAY){

		if(cameraLimit>130){
			print("Oi, it happened");
		}

		camera.position.x = displayWidth/2;
		camera.position.y = man.y-300;

		if(argument === TRUE){
			if(frameCount%3 === 0){
			  count = (count + 1);
			}
		  }else if(argument === FALSE){
			count = count;
		  }

		if(argument === TRUE){
			if(frameCount%60 === 0){
			  score = (score + 1);
			}
		  }else if(argument === FALSE){
			score = score;
		  }


		ground.velocityX = -(4+3*count/100);
		if(keyWentDown("space")){
		  man.velocityY = -20;
		  man.velocityX = 20;
		}
		man.velocityY = man.velocityY + 0.9
		man.velocityX = man.velocityX-0.6
		if (ground.x < 0){
			ground.x = ground.width/2;
		}
		spawnSpikes();
		if (spikesGroup.isTouching(man)){
			gamestate = END;
		}
	  }

	  if (gamestate === END){
		camera.position.x = displayWidth/2;
		camera.position.y = displayHeight/2;
		count = 0;
		score = 0;
		dedScreen.visible = true;
		restart.visible = true;
		ground.velocityX = 0;
		man.velocityY = 0;
		spikesGroup.setVelocityXEach(0);
		man.changeAnimation("ded", manDed);
		man.velocityX = 0;
		man.velocityY = 0;
		spikesGroup.setLifetimeEach(-1);
		if(mousePressedOver(restart)){
		  reset();
		}
	  }

	drawSprites();
 
}

function findMousePos(){
	var argument1;
	argument1 = 1;
	if(keyWentDown(32) && argument1 === 1){
		print("{"+"x: "+ mouseX + ", y: "+ mouseY+"}");
		print(mouseX + ", "+ mouseY);
		argument1 = 0;
		argument1 = 1;
	}
}

function spawnSpikes(){
	if(frameCount%120===0){
		var spike = createSprite(displayWidth + 30, displayHeight-30, 100, 100);
		spike.addImage(spikes);
		spike.scale = 0.4;
		//spike.debug = true;
		spike.setCollider("rectangle" , 10, 5, 250, 300);
		spike.velocityX = -(6 + 3*count/100);
		spikesGroup.add(spike);
	}
}

function reset(){
	gamestate = PLAY;
	dedScreen.visible = false;
	restart.visible = false;
	spikesGroup.destroyEach();
	man.changeAnimation("run", runningMan);
	score = 0;
  }