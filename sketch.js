//Create variables here
var dog, happyDog, hungrydog, database, foodS, foodStock, foodStockRef
var frameCountNow = 0
var fedTime, lastFed, foodObj, currentTime
var milk, input, name, button;
var gameState = "hungry";
var gameStateRef;
var bedroomIMG, gardenIMG, washroomIMG, sleepingIMG, runIMG;
var feed, addFood;

function preload()
{
	//load images here
  dog = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  bedroomIMG = loadImage("images/Bed Room.png");
  gardenIMG = loadImage("images/Garden.png");
  washroomIMG = loadImage("images/Wash Room.png");
  sleepIMG = loadImage("images/Lazy.png");
  runIMG = loadImage("images/running.png");

}

function setup() {
  datatbase = firebase.database();
  createCanvas(1200, 500);

  foodObj  = new Food();

  dog = createSprite(width/2+250,height/2,10,10);
  dog.addAnimation("hungry", hungryDog);
  dog.addAnimation("happy", happyDog);
  dog.addAnimation("sleeping", sleepingIMG);
  dog.addAnimation("run", runIMG );
  dogscale = 0.3

  getGameState();

  feed = createButton("Feed the Dog")
  feed.position(950,95)
  feed.mousePressed(feedDog)

  addFood = createButton("Add Food")
  addFood.position(800,95)
  addFood.mousePressed(addFoods)
  
  input = createInput("Pet name");
  input.position(950, 120);

  button = createButton("Confirm");
  button.position(1000,145);
  button.mousePressed(createName);
  
 
}


function draw() {  
  currentTime = hour();
  if(currentTime === lastFed + 1){
    gameState = "playing";
    updateGameState();
    foodObj.garden();
  }
  else if(currentTime === lastFed + 2){
    gameState = "sleeping";
    updateGameState();
    foodObj.bedroom();
  }
  else if(currentTime > lastFed + 2 && currentTime <= lastFed + 4){
    gameState = "bathing";
    updateGameState();
    foodObj.washroom();
  }
  else{
 
    gameState = "hungry";
    updateGameState();
    foodObj.display();
  }

  foodObj.getFoodStock();

  getGameState();

  fedTime = database.ref("FeedTime")
  fedTime.on("value",function(data){
    lastFed = data.val();
  })

  if(gameState === "hungry"){
    feed.show();
    addFood.show();
    dog.addAnimation("hungry", hungryDog)
  }
  else{
    feed.hide();
    addFood.hide()
  }
 
}



function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(FoodS);
}

function feedDog(){
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock() - 1)
  datatbase.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })

}


function addFoods(){
  foodS ++;
  datatbase.ref('/').update({
    Food:foodS
  })
}