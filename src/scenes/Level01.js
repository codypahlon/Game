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
    this.load.image('tiles', './assets/tilesets/bad-tileset.png');
    this.load.tilemapTiledJSON('map', './assets/tilemaps/Level01.json');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    const map = this.make.tilemap({key: 'map'});

    const tileset = map.addTilesetImage('bad-tileset', 'tiles');
    const platforms = map.createStaticLayer('Collision', tileset, 0, 0);
    const sky = map.createStaticLayer('Background', tileset, 0, 0);
    sky.setDepth(-10);
    platforms.setCollisionByExclusion(-1, true);

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
      this.player.y += 25;
    }
  }

  gameOverLose(player, lava) {

  }

  gameOverWin(player, volcano) {

  }

}
