/*global Phaser*/
export default class EasyNormal extends Phaser.Scene {
  constructor () {
    super('EasyNormal');
  }

  preload () {
    this.load.image('sTiles', './assets/tilesets/starttiles.png');
    this.load.tilemapTiledJSON('mapstart', './assets/tilemaps/Start.json');
    this.load.image('title', './assets/sprites/title.png');
    this.load.image('easy', './assets/sprites/easy.png');
    this.load.image('normal', './assets/sprites/normal.png');
    this.load.spritesheet('pointer', './assets/spriteSheets/fireball.png', {
      frameHeight: 25,
      frameWidth: 16.666
    });

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Load in Background
    const mapstart = this.make.tilemap({key: 'mapstart'});
    const tileset = mapstart.addTilesetImage('starttiles', 'sTiles');
    const sky = mapstart.createStaticLayer('Background', tileset, -80, 0);
    sky.setScale(.38);
    this.platforms = mapstart.createStaticLayer('Collision', tileset, -70, 0);
    this.platforms.setScale(.38);
    this.TILE_BIAS = 32;

    //Place title
    const fafnirdragon = this.add.sprite(410, 270, 'title');
    fafnirdragon.setScale(.34);

    //Place start and tutorial buttons
    const easy = this.add.sprite(410, 407, 'easy');
    easy.setScale(.7);
    const normal = this.add.sprite(415, 467, 'normal');
    normal.setScale(1.2);
    //tutorialbutton.setScale(.6);

    //Place pointer (fireball)
    this.pointer = this.add.sprite(330, 407, 'pointer');
    this.pointer.setScale(2);

    //animations
    this.anims.create({
      key: 'fireball',
      frames: this.anims.generateFrameNumbers('pointer', {start: 0, end: 2}),
      frameRate: 5,
      repeat: -1
    });
    this.pointer.anims.play('fireball', true);

    //Add enter keyboard key
    this.enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);



}

  update (time, delta) {
    this.times = [];
    // Update the scene
    var cursors = this.input.keyboard.createCursorKeys();
    if (cursors.down.isDown) {
      this.pointer.y = 467;
      this.pointer.x = 300;
    }
    if (cursors.up.isDown) {
      this.pointer.y = 407;
      this.pointer.x = 330;
      if (Phaser.Input.Keyboard.JustDown(this.enter)){
        this.scene.start('Level01', {times: this.times});
      }
    }

    //Press enter to go to next scene
    if (this.pointer.y == 407 & this.pointer.x == 330) {
      if (Phaser.Input.Keyboard.JustDown(this.enter)){
        this.scene.start('Level01', {times: this.times});
      }
    }
    if (this.pointer.y == 467 & this.pointer.x == 300) {
      if (Phaser.Input.Keyboard.JustDown(this.enter)){
        this.scene.start('Level01', {times: this.times});
      }
    }
  }
}
