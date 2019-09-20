/*global Phaser*/
export default class Scene0 extends Phaser.Scene {
  constructor () {
    super('Scene0');
  }

  init (data) {
    // Initialization code goes here
    if (data != null) {
      this.scores = data.score;  
      console.log(this.scores);
    } else {
      this.scores = 0;
    }
    
  }

  preload () {
    // Preload assets
    this.load.image('sky', './assets/sprites/sky.png');
    this.load.image('platform', './assets/sprites/platform.png');
    this.load.image('volcano', './assets/sprites/volcano.png');
    this.load.image('bomb', './assets/sprites/bomb.png');
    this.load.spritesheet('alien', './assets/spriteSheets/player.png', {
      frameHeight: 93,
      frameWidth: 67
    });
    
    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Create the scene
    this.background = this.add.sprite(1280/2, 960/2, 'sky');
    this.background.setScale(5);

    //State the objective
    var text = this.add.text(100, this.centerY + 100, 'See how fast you can die in the volcano!', {fontSize: '20px'});
    var text = this.add.text(100, this.centerY + 120, 'Don\'t accidentally fall and die in the lava first!', {fontSize: '20px'});

    //Add timer object
    this.timer = this.time.addEvent({
      delay: 0,
      callback: null,
      callbackScope: this,
      loop: true
    });

    //Add player
    this.player = this.physics.add.sprite(100, 600, 'alien');
    this.player.collideWorldBounds = true;
    this.player.setSize(38, 93);

    //Add animations for player
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('alien', {start: 0, end: 4}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('alien', {start: 0, end: 0}),
      frameRate: 10,
      repeat: -1
    });

    //Add in the ground
    var lava = this.physics.add.staticGroup();

    lava
      .create(1280/2, 1050, 'platform')
      .setTintFill(0xff0000)
      .setScale(10)
      .refreshBody();

    //Create platforms
    var platforms = this.physics.add.staticGroup();
    
    platforms.refresh();

    platforms
      .create(250, 700, 'platform')  
      .setSize(400, 20)
      .setDisplaySize(400, 20);

    var i;
    var flag = 1;
    var x = 500;
    var y = 700;
    for (i = 0; i < 15; i++) {
      var random = Math.random();
      if (random < 0.5){
        flag = -1 * flag;
      } 

      y += flag * 100 * 2 * random;
      if (y >= 800) {
        y -= 200;
      } else if (y <= 0) {
        y += 200
      }

      x += 200;
      if (x >= 1750) {
        break
      }

      platforms
        .create(x, y, 'platform')
        .setSize(30, 20)
        .setDisplaySize(30, 20);
    }
    
    //Add in volcano
    var volcano = this.physics.add.staticGroup()
    volcano.refresh();

    volcano
      .create(1900, 790, 'volcano')
      .setSize(70, 200)
      .setDisplaySize(400, 200);

    this.gameOver = true;
    //Add in collisions
    this.physics.add.collider(this.player, lava, this.gameOverLose, null, this);
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.player, volcano, this.gameOverWin, null, this);

    //Set camera up
    this.cameras.main.setBounds(0, 0, 2000, 960);
    this.cameras.main.startFollow(this.player);
  }


  update (time, delta) {
    // Update the scene
    if (!this.gameOver) {
      if (this.scores == 0) {
        if (this.win){
          this.scores = this.timer.getElapsedSeconds();
        } else {
          this.scores = 0;
        }
      } else {
        if (this.win){
          var score = this.timer.getElapsedSeconds(); 
          this.scores[this.scores.length] = score;
        }
      }      
      this.scene.start('GameOverScene', {score: this.scores});
      this.gameOver = true;
      return;
    }

    //Set speed of player
    var speed = 10;

    //Create cursor keys and assign events
    var cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
      this.player.x -= speed;
      this.player.anims.play("walk", true);
      this.player.flipX = true;
    } else if (cursors.right.isDown) {
      this.player.x += speed;
      this.player.anims.play("walk", true);
      this.player.flipX = false;
    } else {
      this.player.anims.play("idle", true);
    }
    if (cursors.up.isDown) {
      this.player.y -= 25;
    } else if (cursors.down.isDown) {
    }
  }

  gameOverLose(player, lava) {
    this.gameOver = false;
    this.win = false;
  }

  gameOverWin(player, volcano) {
    this.gameOver = false;
    this.win = true;
  }

}

