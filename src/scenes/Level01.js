/*global Phaser*/
export default class Level01 extends Phaser.Scene {
  constructor () {
    super('Level01');
  };

  init (data) {
    // Initialization code goes here

  };

  preload () {
    // Preload assets
    this.load.spritesheet("dragon", "./assets/spriteSheets/dragon.png",{
      frameHeight: 100,
      frameWidth: 121
    });
    this.load.image('tiles', './assets/tilesets/bad-tileset.png');
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

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  };

  create (data) {
    const map = this.make.tilemap({key: 'map'});

    const tileset = map.addTilesetImage('bad-tileset', 'tiles');
    const platforms = map.createStaticLayer('Collision', tileset, 0, 0);
    const sky = map.createStaticLayer('Background', tileset, 0, 0);
    sky.setDepth(-10);
    platforms.setCollisionByExclusion(-1, true);

    this.physics.world.setBounds(0, 0, 5800, 1100);

    this.player = this.physics.add.sprite(100, 850, 'dragon');
    this.player.setCollideWorldBounds(true);

    this.chest = this.physics.add.sprite(1020, 200, 'chest');
    this.chest2 = this.physics.add.sprite(3120, 530, 'chest');
    this.chest.setCollideWorldBounds(true);
    this.chest2.setCollideWorldBounds(true);

    this.viking = this.physics.add.sprite(1500, 200, 'viking');
    this.viking.setCollideWorldBounds(true);
    this.viking2 = this.physics.add.sprite(4000, 200, 'viking');
    this.viking2.setCollideWorldBounds(true);

    this.wizard = this.physics.add.sprite(5000, 200, 'wizard');
    this.wizard.setScale(1.2);
    this.wizard.setCollideWorldBounds(true);



    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.chest, platforms);
    this.physics.add.collider(this.chest2, platforms);

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
    this.viking.anims.play("vikingwalk", true);
    this.viking2.anims.play("vikingwalk", true)

    this.tweens.add({
    targets: this.viking,
    x: 1000,
    duration: 5000,
    ease: 'Linear',
    loop: -1
    });

    this.tweens.add({
    targets: this.viking2,
    x: 3700,
    duration: 4000,
    ease: 'Linear',
    loop: -1
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
    this.wizard.anims.play("wizard", true);

    this.physics.add.overlap(
      this.player,
      this.chest,
      this.checkOverlap,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.chest2,
      this.checkOverlap,
      null,
      this
    );
  }

  update (time, delta) {
    // Update the scene
    //Set speed of player
    var speed = 10;

    //Create cursor keys and assign events
    var cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
      this.player.x -= speed;
      this.player.anims.play("dragonwalk", true);
      this.player.flipX = true;
    } else if (cursors.right.isDown) {
      this.player.x += speed;
      this.player.anims.play("dragonwalk", true);
      this.player.flipX = false;
    } else {
      this.player.anims.play("idle", true);
    }
    if (cursors.up.isDown) {
      this.player.y -= 25;
    } else if (cursors.down.isDown) {
      this.player.y += 25;
    };

  };

  checkOverlap(spriteA, spriteB) {
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();
    if (boundsA = boundsB) {
      this.chest.anims.play("open", true);
    this.chest.anims.play("open", false);
    }
  };

}
