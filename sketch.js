var bg;
var player, playerImg, playerShootingImg;
var bullet, bulletImg, bulletGroup; 
var explosionSound;
var zombie, zombieImg, zombieGroup;
var killSound;
var kills = 0;
var gameState = "0";
var gameOver, gameOverImg;
var restart, restartImg;
var killedSound;
var respawnSound;

function preload()
{
    bg = loadImage("images/bg.jpeg");
    playerImg = loadImage("images/shooter_2.png");
    playerShootingImg = loadImage("images/shooter_3.png");
    bulletImg = loadImage("images/bullet.png");
    explosionSound = loadSound("sounds/explosion.mp3");
    zombieImg = loadImage("images/zombie.png");
    killSound = loadSound("sounds/kill.mp3");
    gameOverImg = loadImage("images/gameOver.png");
    restartImg = loadImage("images/restart.png");
    killedSound = loadSound("sounds/killed.wav");
    respawnSound = loadSound("sounds/respawn.wav");
}

function setup()
{
    createCanvas(windowWidth - 20, windowHeight - 20);

    player = createSprite(displayWidth/5, displayHeight/3 + 50, 10, 10);
    player.addImage(playerImg);
    player.scale = 0.4;
    //player.debug = true;
    player.setCollider("rectangle", -15, -20, 260, 550);

    restart = createSprite(displayWidth/3 + 70, displayHeight/2 - 40, 10, 10);
    restart.addImage(restartImg);
    restart.scale = 0.2;
    restart.visible = false;

    gameOver = createSprite(displayWidth/3 + 100, displayHeight/4, 50, 50);
    gameOver.addImage(gameOverImg);
    gameOver.scale = 1.5;
    gameOver.visible = false;

    zombieGroup = new Group();
    bulletGroup = new Group();
}

function draw()
{
    background(bg);

    if(gameState === "0")
    {
        player.visible = true;
        restart.visible = false;
        gameOver.visible = false;
        
        if(keyDown("up_arrow"))
        {
            player.y -= 5;
        }

        if(keyDown("down_arrow"))
        {
            player.y += 5;
        }

        if(keyDown("right_arrow"))
        {
            player.x += 5;
        }

        if(keyDown("left_arrow"))
        {
            player.x -= 5;
        }

        if(keyWentDown("space"))
        {
            player.addImage(playerShootingImg);
        }
        else if(keyWentUp("space"))
        {
            player.addImage(playerImg);
            spawnBullet();
            explosionSound.play();
        }

        spawnZombie();

        if(bulletGroup.isTouching(zombieGroup))
        {
            bulletGroup.get(0).destroy();
            zombieGroup.get(0).destroy();
            killSound.play();
            kills += 1;
        }

        if(zombieGroup.isTouching(player))
        {
            gameState = "1";
            killedSound.play();
        }
    }

    if(gameState === "1")
    {
        player.visible = false;
        gameOver.visible = true;
        restart.visible = true;

        zombieGroup.destroyEach();

        if(mousePressedOver(restart))
        {
            gameState = "0";
            respawnSound.play();
        }
    }

    fill(255);
    textSize(30);
    text("Kills: " + kills, 50, 50);

    drawSprites();
}

function spawnBullet()
{
    bullet = createSprite(0, 0, 10, 10);
    bullet.addImage(bulletImg);
    bullet.velocityX = 20;
    bullet.x = player.x + 80;
    bullet.y = player.y - 40;
    bullet.scale = 0.02;
    bullet.lifetime = 100;
    //bullet.debug = true;
    bulletGroup.add(bullet);
}

function spawnZombie()
{
    if(frameCount % 100 === 0)
    {
        zombie = createSprite(displayWidth, displayHeight/2, 10, 10);
        zombie.addImage(zombieImg);
        zombie.velocityX = -6;
        zombie.scale = 0.25;
        zombie.scale = random(0.15, 0.27);
        zombie.y = Math.round(random(200, 400));
        //zombie.debug = true;
        zombie.setCollider("rectangle", 0, 0, 500, 1000);
        zombie.lifetime = 310;
        zombieGroup.add(zombie);
    }
}