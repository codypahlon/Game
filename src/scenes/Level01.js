/*global Phaser*/
export default class Level01 extends Phaser.Scene {
  constructor () {
    super('Level01');
  };

  init (data) {
    // Initialization code goes here
    if (data != null) {
      this.times = data.time;
      console.log(this.times);
    } else {
      this.times = 0;
    }

  };

  preload () {
    // Preload assets
    this.load.spritesheet("dragon", "./assets/spriteSheets/dragon.png",{
      frameHeight: 100,
      frameWidth: 121
    });
    this.load.image('spikes', './assets/sprites/spikes.png');
    this.load.image('tiles', './assets/tilesets/bad-tileset.png');
    this.load.image('platform', './assets/sprites/platform.png');
    this.load.tilemapTiledJSON('map', './assets/tilemaps/Level01.json');
    this.load.spritesheet("chest", "./assets/spriteSheets/chest.png", {
      frameHeight: 75,
      frameWidth: 100
    });
    this.load.spritesheet('viking', './assets/spriteSheets/viking.png', {
      frameHeight: 100,
      frameWidth: 80
    });
    this.load.spritesheet('wizard', './assets/spriteSheets/wizard.png', {
      frameHeight: 110,
      frameWidth: 75
    });
    this.load.spritesheet('dwarfAxe', './assets/spriteSheets/dwarfAxe.png', {
      frameHeight: 50,
      frameWidth: 50
    });
    this.load.spritesheet('fireball', './assets/spriteSheets/fireball.png', {
      frameHeight: 25,
      frameWidth: 16.666
    });
    this.load.spritesheet('explosion', './assets/spriteSheets/explosion.png', {
      frameHeight: 16,
      frameWidth: 16
    });
    this.load.spritesheet('coin', './assets/spriteSheets/coin.png', {
      frameHeight: 25,
      frameWidth: 17
    });
    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  };

  create (data) {
    // Declare variables
    this.gameOver = true;

    this.timer = this.time.addEvent({
      delay: 0,
      callback: null,
      callbackScope: this,
      loop: true
    });

    // Make the map work
    const map = this.make.tilemap({key: 'map'});
    const tileset = map.addTilesetImage('bad-tileset', 'tiles');
    this.platforms = map.createStaticLayer('Collision', tileset, 0, 0);
    const sky = map.createStaticLayer('Background', tileset, 0, 0);
    sky.setDepth(-10);
    this.platforms.setCollisionByExclusion(-1, true);

    // Add in the breakable blocks
    this.block = this.physics.add
      .sprite(784, 1135, 'platform')
      .setSize(96, 32)
      .setGravity(0, -1000)
      .setImmovable(true)
      .setDisplaySize(96, 32);
    this.block2 = this.physics.add
      .sprite(784 + 32 * 13, 1135, 'platform')
      .setSize(96, 32)
      .setGravity(0, -1000)
      .setImmovable(true)
      .setDisplaySize(96, 32);

    // Create all of the spikes
    var spikes = this.physics.add.staticGroup();
    this.createSpikes(2033, 1007, 3, spikes);
    this.createSpikes(2033 + 32 * 7, 1007, 2, spikes);
    this.createSpikes(2033 + 32 * 12, 1007, 3, spikes);
    this.createSpikes(2033 + 32 * 16, 1007, 2, spikes);
    this.createSpikes(2033 + 32 * 21, 1007, 4, spikes);
    this.createSpikes(2033 + 32 * 28, 1007, 2, spikes);

    // Add the dragon and all of his properities
    this.player = this.physics.add.sprite(100, 1000, 'dragon');
    this.player.health = 3;
    this.player.collideWorldBounds = true;
    this.player
      .setSize(100, 80)
      .setOffset(20, 20)
      .setDisplaySize(100, 80);
    this.player.body.setMaxSpeed(500);
    this.player.body.setMaxVelocity(1000);
    this.player.body.setGravity(0, 25000);
    this.physics.world.setBounds(0, 0, 5800, 1100);

    // Adding in the fireball
    var fireball, fireballs, enemy, enemyGroup;
    this.nextFire = 0;
    this.fireRate = 200;
    this.speed = 1000;

    this.fireballs = this.physics.add.group({
      defaultKey: 'fireball'
    });

    // Add event listener for movement of mouse
    this.input.keyboard.on('keydown_SPACE', this.shoot, this);

    // Add in all of the chests
    this.chest = this.physics.add.sprite(1020, 200, 'chest');
    this.chest2 = this.physics.add.sprite(3120, 1000, 'chest');
    this.chest2
      .setSize(96, 75)
      .setDisplaySize(96, 75);
    this.chest3 = this.physics.add.sprite(1000, 1200, 'chest');
    this.chest.name = 'chest';
    this.chest2.name = 'chest2';
    this.chest3.name = 'chest3';

    // Add in both of the vikings
    this.viking = this.physics.add.sprite(1420, 1010, 'viking');
    this.viking.setSize(70, 96);
    this.viking2 = this.physics.add.sprite(4100, 1010, 'viking');
    this.viking2.setSize(70, 96);
    this.viking.health = 2;
    this.viking2.health = 2;

    // Add in the wizard
    this.wizard = this.physics.add.sprite(5000, 200, 'wizard');
    this.wizard.setScale(1.2);
    this.wizard.health = 3;

    // Add in the 3 dwarves
    this.dwarf = this.physics.add.sprite(900, 1010, 'dwarfAxe');
    this.dwarf2 = this.physics.add.sprite(1000, 1010, 'dwarfAxe');
    this.dwarf3 = this.physics.add.sprite(1100, 1010, 'dwarfAxe');
    this.dwarf.health = 1;
    this.dwarf2.health = 1;
    this.dwarf3.health = 1;

    // Making enemy enemyGroup
    this.enemyGroup = this.physics.add.group();
    var enemies = [this.dwarf, this.dwarf2, this.dwarf3, this.viking, this.viking2];

    for (var i = 0; i < enemies.length; i++){
      this.enemyGroup.add(enemies[i]);
    };

    // All of the physics between all the sprites
    this.physics.add.overlap(this.player, this.chest, this.checkOverlap, null, this).name = 'chest';
    this.physics.add.overlap(this.player, this.chest2, this.checkOverlap, null, this).name = 'chest2';
    this.physics.add.overlap(this.player, this.chest3, this.checkOverlap, null, this).name = 'chest3';
    this.physics.add.collider([this.dwarf, this.dwarf2, this.dwarf3], this.platforms);
    this.physics.add.collider(this.viking, this.platforms);
    this.physics.add.collider(this.viking2, this.platforms);
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.chest, this.platforms);
    this.physics.add.collider(this.chest2, this.platforms);
    this.physics.add.collider(this.chest3, this.platforms);
    this.physics.add.collider(this.wizard, this.platforms);
    this.physics.add.collider(this.player, this.block, this.destroyBlock, null, this);
    this.physics.add.collider(this.player, this.block2, this.destroyBlock, null, this);
    this.physics.add.collider(this.player, this.wizard, this.gotHit, null, this);
    this.physics.add.collider(this.player, enemies, this.gotHit, null, this);
    this.physics.add.collider(this.player, spikes, this.gotHit, null, this);

    // Properties of the camera
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    //Create animations
    this.anims.create({
      key: 'dragonwalk',
      frames: this.anims.generateFrameNumbers('dragon', {start: 1, end: 4}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'vikingwalk',
      frames: this.anims.generateFrameNumbers('viking', {start: 1, end: 3}),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'dwarfAttack',
      frames: this.anims.generateFrameNumbers('dwarfAxe', {start: 0, end: 2}),
      frameRate: 1,
      repeat: -1
    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('dragon', {start: 0, end: 0}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'open',
      frames: this.anims.generateFrameNumbers('chest', {start: 0, end: 1}),
      frameRate: 10,
      repeat: 0
    });

    this.anims.create({
      key: 'wizard',
      frames: this.anims.generateFrameNumbers('wizard', {start: 0, end: 1}),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'explosion',
      frames: this.anims.generateFrameNumbers('explosion', {start: 0, end:4}),
      framerate: 10,
      repeat: 0
    });

    this.anims.create({
      key: 'spin',
      frames: this.anims.generateFrameNumbers('coin', {start: 0, end: 5}),
      frameRate: 9,
      repeat: -1
    });

    // Play animations
    this.viking.anims.play("vikingwalk", true);
    this.viking2.anims.play("vikingwalk", true);
    this.dwarf.anims.play('dwarfAttack', true);
    this.dwarf2.anims.play('dwarfAttack', true);
    this.dwarf3.anims.play('dwarfAttack', true);
    this.wizard.anims.play("wizard", true);

    // Add in the tweens
    this.tweens.add({
    targets: this.viking,
    x: 1290,
    duration: 1000,
    ease: 'Linear',
    loop: -1,
    yoyo: true,
    flipX: true
    });

    this.tweens.add({
    targets: this.viking2,
    x: 3850,
    duration: 1000,
    ease: 'Linear',
    loop: -1,
    yoyo: true,
    flipX: true
    });

    this.tweens.add({
      targets: [this.dwarf, this.dwarf2, this.dwarf3],
      duration: 1000,
      ease: 'Linear',
      loop: true
    });

    //  The score
    this.score = 0;
    this.scoreText = this.add.text(16, 16, "score: 0", {
      fontSize: "32px",
      fill: "#000"
    });
    this.scoreText.setScrollFactor(0);
  }

  update (time, delta) {
    // Win condition
    this.fireballs.children.each(
      function (b) {
        if (b.active) {
          this.physics.add.overlap(b, this.wizard, this.hitEnemy, null, this);
        };
      }.bind(this)
    );

    // Update the scene
    this.fireballs.children.each(
      function (b) {
        if (b.active) {
          this.physics.add.overlap(b, this.enemyGroup, this.hitEnemy, null, this);
          this.physics.add.collider(b, this.platforms, this.hitEnemy, null, this);
          if (b.y < 0) {
            b.setActive(false);
          } else if (b.y > this.cameras.main.height) {
            b.setActive(false);
          } else if (b.x < 0) {
            b.setActive(false);
          } else if (b.x > this.cameras.main.width) {
            b.setActive(false);
          }
        }
      }.bind(this)
    );

    if (!this.gameOver) {
      if (this.times == 0) {
        if (this.win){
          this.times = this.timer.getElapsedSeconds();
        } else {
          this.times = 0;
        }
      } else {
        if (this.win){
          var time = this.timer.getElapsedSeconds();
          this.times[this.times.length] = time;
        }
      };
      this.scene.start('GameOverScene', {time: this.times, score: this.score});
      this.gameOver = true;
      return;
    }

    //Set speed of player
    const speed = 500;
    const prevVelocity = this.player.body.velocity.clone();
    //Create cursor keys and assign events
    var cursors = this.input.keyboard.createCursorKeys();
    this.player.setVelocity(0);

    if (cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
      this.player.anims.play("dragonwalk", true);
      this.player.flipX = true;
    } else if (cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
      this.player.anims.play("dragonwalk", true);
      this.player.flipX = false;
    } else {
      this.player.anims.play("idle", true);
    }
    if (cursors.up.isDown) {
      this.player.body.setVelocityY(-2 * speed);
    }
  };

gotHit(spriteA, spriteB){
  spriteA.health -= 1;
  spriteA.body.enable = false;
  this.time.addEvent({
    delay: 500,
    callback: ()=>{
      spriteA.body.enable = true;
    }
  });
  if (spriteA.health == 0){
    this.gameOver = false;
    this.win = false;
  };
};

destroyBlock(spriteA, spriteB){
  this.time.addEvent({
    delay: 500,
    callback: ()=>{
      spriteB.disableBody(true, true);
    }
  });
}

collectCoins(player, coins) {
      coins.disableBody(true, true);
      //  Add and update the score
      this.score += 10;
      this.scoreText.setText("Score: " + this.score);
};

gameOverWin(spriteA, spriteB){
  this.gameOver = false;
  this.win = true;
};

flipSprite(sprite) {
  sprite.flipX = !(sprite.flipX);
  console.log(sprite.flipX);
};

checkOverlap(spriteA, spriteB) {
  // Destroying chest collider
  this.physics.world.colliders.getActive().find(function(i){
    return i.name == spriteB.name;
  }).destroy();

  // Playing chest animation
  spriteB.anims.play("open", true);

  // Checking which chest so no boundary issues
  var repeat = 4;
  if (spriteB.name == 'chest2'){
    repeat = 2;
  };

  // Creating coins from chest
  this.coins = this.physics.add.group({
    key: "coin",
    repeat: repeat,
    setXY: { x: spriteB.x - 50, y: spriteB.y, stepX: 30}
  });
  this.physics.add.collider(this.coins, this.platforms);
  this.physics.add.overlap(this.player, this.coins, this.collectCoins, null, this);
  this.coins.children.iterate(function(child){
    child.play('spin')
  });
};

createSpikes(x, y, num, spikes) {
  for (var i = 0; i < num; i++){
  spikes
    .create(x + 32 * i, y, 'spikes')
    .setSize(32, 32)
    .setDisplaySize(32, 32);
  }
};

shoot(space) {
  var fireball = this.fireballs.get();
  fireball.enableBody(true, this.player.x, this.player.y, true, true)
  if (this.player.flipX == true){
    var flag = -1;
  } else {
    var flag = 1;
  }
  fireball.setVelocity(flag * 1000, 0);
  fireball.setGravity(0, -1000);
};

hitEnemy (fireball, enemy){
  console.log('hit');
  enemy.health -= 1;
  if (enemy.health == 0){
    this.explosion = this.physics.add.sprite(enemy.x, enemy.y, 'explosion');
    this.explosion.setGravity(0, -1000);
    this.explosion.setDisplaySize(50, 50);
    enemy.disableBody(true, true);
    this.explosion.anims.play('explosion', true);
    this.time.addEvent({
      delay: 200,
      callback: ()=>{
        this.explosion.disableBody(true, true);
      }
    });
    if (enemy == this.wizard){
      this.gameOverWin();
    }
  };
  fireball.disableBody(true, true);
}

}
