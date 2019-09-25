/*global Phaser*/
export default class Level01 extends Phaser.Scene {
  constructor () {
    super('Level01');
  };

  init (data) {
    // Initialization code goes here
    if (data != null) {
      this.scores = data.score;
      console.log(this.scores);
    } else {
      this.scores = 0;
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
    const platforms = map.createStaticLayer('Collision', tileset, 0, 0);
    const sky = map.createStaticLayer('Background', tileset, 0, 0);
    sky.setDepth(-10);
    platforms.setCollisionByExclusion(-1, true);

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
    this.player.body.setGravity(0, 10000);
    this.physics.world.setBounds(0, 0, 5800, 1100);

    // Add in both of the chests
    this.chest = this.physics.add.sprite(1020, 200, 'chest');
    this.chest2 = this.physics.add.sprite(3120, 1000, 'chest');
    this.chest2
      .setSize(96, 75)
      .setDisplaySize(96, 75);
    this.chest.setCollideWorldBounds(true);
    this.chest2.setCollideWorldBounds(true);

    // Add in both of the vikings
    this.viking = this.physics.add.sprite(1420, 1010, 'viking');
    this.viking.setSize(70, 96);
    this.viking2 = this.physics.add.sprite(4100, 1010, 'viking');
    this.viking2.setSize(70, 96);

    // Add in the wizard
    this.wizard = this.physics.add.sprite(5000, 200, 'wizard');
    this.wizard.setScale(1.2);
    this.wizard.setCollideWorldBounds(true);

    // Add in the 3 dwarves
    this.dwarf = this.physics.add.sprite(820, 1010, 'dwarfAxe');
    this.dwarf2 = this.physics.add.sprite(1000, 1010, 'dwarfAxe');
    this.dwarf3 = this.physics.add.sprite(1180, 1010, 'dwarfAxe');

    // All of the physics between all the sprites
    this.physics.add.overlap(this.player, this.chest, this.checkOverlap, null, this);
    this.physics.add.overlap(this.player, this.chest2, this.checkOverlap, null, this);
    this.physics.add.collider([this.dwarf, this.dwarf2, this.dwarf3], platforms);
    this.physics.add.collider(this.viking, platforms);
    this.physics.add.collider(this.viking2, platforms);
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.chest, platforms);
    this.physics.add.collider(this.chest2, platforms);
    var enemies = [this.dwarf, this.dwarf2, this.dwarf3, this.viking, this.viking2, this.wizard];
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
  this.gameOver = false;
  this.win = false;
};

gameOverWin(spriteA, spriteB){
  this.gameOver = false;
  this.win = true;
}
flipSprite(sprite) {
  sprite.flipX = !(sprite.flipX);
  console.log(sprite.flipX);
};

checkOverlap(spriteA, spriteB) {
  spriteB.anims.play("open", true);
};

createSpikes(x, y, num, spikes) {
  for (var i = 0; i < num; i++){
  spikes
    .create(x + 32 * i, y, 'spikes')
    .setSize(32, 32)
    .setDisplaySize(32, 32);
  }
};


}
