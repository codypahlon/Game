/*global Phaser*/
export default class Level01 extends Phaser.Scene {
  constructor () {
    super('Level01');
  }

  init (data) {
    // Initialization code goes here

  }

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

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    this.power = 0;

    const map = this.make.tilemap({key: 'map'});

    const tileset = map.addTilesetImage('bad-tileset', 'tiles');
    const platforms = map.createStaticLayer('Collision', tileset, 0, 0);
    const sky = map.createStaticLayer('Background', tileset, 0, 0);
    sky.setDepth(-10);
    platforms.setCollisionByExclusion(-1, true);

    var spikes = this.physics.add.staticGroup();
    spikes.create(100, 1000, 'spikes');

    /*
    var platforms = this.physics.add.staticGroup();
    platforms.create(100, 1000, 'platform');
    platforms.setDepth(10);
    platforms
      .create(0, 1000, 'platform')
      .setSize(1000, 1000)
      .setTintFill(0x654321)
      .setDisplaySize(1000, 1000);
    platforms
      .create(100, 400, 'platform')
      .setSize(100, 200)
      .setDisplaySize(100, 200);
    platforms.create(200, 400, 'platform');
    */



    this.player = this.physics.add.sprite(0, 1000, 'dragon');
    this.player.collideWorldBounds = true;
    this.player
      .setSize(100, 80)
      .setOffset(20, 20)
      .setDisplaySize(100, 80);
    this.player.body.setMaxSpeed(500);
    this.player.body.setMaxVelocity(1000);
    this.player.body.setGravity(0, 10000);

    this.physics.add.collider(this.player, spikes);
    this.physics.add.collider(this.player, platforms);

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('dragon', {start: 1, end: 4}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('dragon', {start: 0, end: 0}),
      frameRate: 10,
      repeat: -1
    });
  }


  update (time, delta) {
    // Update the scene
    //Set speed of player
    const speed = 500;
    const prevVelocity = this.player.body.velocity.clone();
    //Create cursor keys and assign events
    var cursors = this.input.keyboard.createCursorKeys();
    this.player.setVelocity(0);

    if (cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
      this.player.anims.play("walk", true);
      this.player.flipX = true;
    } else if (cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
      this.player.anims.play("walk", true);
      this.player.flipX = false;
    } else {
      this.player.anims.play("idle", true);
    }
    if (cursors.up.isDown) {
      this.player.body.setVelocityY(-2 * speed);
    }
  }


stopWalking(player, platforms){
}
gameOverLose(player, lava) {
}
gameOverWin(player, volcano) {
}
}
