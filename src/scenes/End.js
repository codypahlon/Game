/*global Phaser*/
export default class End extends Phaser.Scene {
  constructor () {
    super('End');
  }

  preload () {
    this.load.image('eTiles', './assets/tilesets/endtiles.png');
    this.load.tilemapTiledJSON('mapend', './assets/tilemaps/YouWin.json');
    this.load.image('youwin', './assets/sprites/youwin.png');
    this.load.image('playagain', './assets/sprites/playagain.png');
    //this.load.image('tutorialbutton', './assets/sprites/tutorial.png');
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
    this.registry.set('times', []);
    this.registry.set('scores', []);
    const mapend = this.make.tilemap({key: 'mapend'});
    const tileset = mapend.addTilesetImage('endtiles', 'eTiles');
    const sky = mapend.createStaticLayer('Background', tileset, -80, 0);
    sky.setScale(.38);
    this.platforms = mapend.createStaticLayer('Collision', tileset, -70, 0);
    this.platforms.setScale(.38);
    this.TILE_BIAS = 32;

    //Place title
    const youwin = this.add.sprite(405, 230, 'youwin');
    youwin.setScale(4);

    //Place start and tutorial buttons
    const playagain = this.add.sprite(410, 400, 'playagain');
    //const tutorialbutton = this.add.sprite(415, 467, 'tutorialbutton');
    //tutorialbutton.setScale(.6);

    //Place pointer (fireball)
    this.pointer = this.add.sprite(305, 400, 'pointer');
    this.pointer.setScale(1.5);

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
    // Update the scene
    var cursors = this.input.keyboard.createCursorKeys();

    //Press enter to go to next scene
    if (this.pointer.y == 400 & this.pointer.x == 305) {
      if (Phaser.Input.Keyboard.JustDown(this.enter)){
        this.scene.start('EasyNormal', {time: this.time});
      }
    }
  }
}
