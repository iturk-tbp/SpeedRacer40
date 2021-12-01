class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
    this.leaderBoardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
  }
  getState(){
    var gameStateref = database.ref("gameState")
    gameStateref.on("value",function(data){
      gameState = data.val();
    })
  }
  update(state){
    database.ref("/").update({
      gameState: state
    })
  }
  start() {
    form = new Form();
    form.display();
    player = new Player();
    playerCount = player.getCount();

    car1 = createSprite(width/2-50,height-100);
    car1.addImage("car1",car1_img);
    car1.scale = 0.07

    car2 = createSprite(width/2 + 100,height-100);
    car2.addImage("car2",car2_img);
    car2.scale = 0.07

    cars = [car1,car2];
    obstaclesPositions = [
      {x: width/2+250, y:height-800,image:ob2},
      {x: width/2-150, y:height-1300,image:ob1}, 
      {x: width/2+250, y:height-1800,image:ob1}, 
      {x: width/2-180, y:height-2300,image:ob2}, 
      {x: width/2, y:height-2800,image:ob2}, 
      {x: width/2-180, y:height-3300,image:ob1}, 
      {x: width/2+180, y:height-3300,image:ob2}, 
      {x: width/2+250, y:height-3800,image:ob2}, 
      {x: width/2-150, y:height-4300,image:ob1}, 
      {x: width/2+250, y:height-4800,image:ob2}, 
      {x: width/2, y:height-5300,image:ob1}, 
      {x: width/2-180, y:height-5500,image:ob2}, 
      
    ]

    fuels = new Group();
    coins = new Group();
    obstacles = new Group();

    this.addSprites(fuels,4,fuel,0.02);
    this.addSprites(coins,18,gold,0.09);
    this.addSprites(obstacles,obstaclesPositions.length,ob1,0.04,obstaclesPositions);
  }
  handleElements(){
    form.hide()
    form.titleImage.position(40,50);
    form.titleImage.class("gameTitle2");
    this.resetTitle.html("Reset Game")
    this.resetTitle.class("resetText")
    this.resetTitle.position(width/2+200,40);
    this.resetButton.position(width/2+200,15);
    this.resetButton.class("resetButton");
    this.leaderBoardTitle.html("Leader Board");
    this.leaderBoardTitle.class("resetText");
    this.leaderBoardTitle.position(width/3-60,40);
    this.leader1.class("leadersText");
    this.leader1.position(width/3-50,80);
    this.leader2.class("leadersText");
    this.leader2.position(width/3-50,130);
  }
  play(){
    this.handleElements();
    this.handleResetButton();
    Player.getPlayersInfo();
    if(allPlayers !== undefined){
      image(track,0,-height*5,width,height*6);
      this.showLeaderboard();
      var index = 0
      for(var plr in allPlayers){
        index = index+1
        //Use data from the database to display the cars in x and y direction
        var x = allPlayers[plr].positionx
        var y = height-allPlayers[plr].positiony
        cars[index-1].position.x = x;
        cars[index-1].position.y = y;
        if(index === player.index){
          stroke(10)
          fill("yellow")
          ellipse(x,y,60,60);
           
          this.handleFuel(index)
          this.handlePowerCoins(index)

          //changing camera position in Y direction
          //camera.position.x = cars[index-1].position.x
          camera.position.y = cars[index-1].position.y
         
        }
      }
      this.handlePlayercontrols();
      drawSprites();
    }
    
  }
  showLeaderboard(){
    var leader1, leader2
    var players = Object.values(allPlayers);
    if(
      (players[0].rank === 0 && players[1].rank === 0) || players[0].rank === 1
    )
    {
      leader1 = 
      players[0].rank + 
      "&emsp;" + 
      players[0].name +
      "&emsp;" +
      players[0].score

      leader2 = 
      players[1].rank + 
      "&emsp;" + 
      players[1].name +
      "&emsp;" +
      players[1].score
    }
    if(
      players[1].rank === 1
    )
    {
      leader1 = 
      players[1].rank + 
      "&emsp;" + 
      players[1].name +
      "&emsp;" +
      players[1].score

      leader2 = 
      players[0].rank + 
      "&emsp;" + 
      players[0].name +
      "&emsp;" +
      players[0].score
      
    }
    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }
  handleResetButton(){
    this.resetButton.mousePressed(() =>{
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {}
      })
    window.location.reload();
    })
  }
  handlePlayercontrols(){
    if(keyIsDown(UP_ARROW)){
      player.positiony += 10;
      player.update();
    }
    if(keyIsDown(LEFT_ARROW) && player.positionx > width/3 - 50 ){
      player.positionx -= 5;
      player.update();
    }
    if(keyIsDown(RIGHT_ARROW) && player.positionx < width/2 + 300){
      player.positionx += 5;
      player.update();
    }
  }

  addSprites(spriteGrp, NumberOfSprites, spriteImg, scale, positions = []){
    for(var i = 0; i < NumberOfSprites; i++){
      var x,y
      if(positions.length>0){
        x = positions[i].x
        y = positions[i].y
        spriteImg = positions[i].image
      }
      else{
        x = random(width/2+150,width/2-150);
        y = random(-height*4.5,height-400)
      }
      var sprite = createSprite(x,y)
      sprite.addImage("sprite",spriteImg);
      sprite.scale = scale;
      spriteGrp.add(sprite);
    }
  }

  handleFuel(index){
    cars[index-1].overlap(fuels,function(collector,collected){
      player.fuel = 185
      collected.remove()
    })
  }
  handlePowerCoins(index){
    cars[index-1].overlap(coins,function(collector,collected){
      player.score += 5
      player.update();
      collected.remove();
    })
  }
}
