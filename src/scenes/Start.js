/*global Phaser*/
export default class Start extends Phaser.Scene {
  constructor () {
    super('Start');
  }

  preload () {
    this.load.image('sTiles', './assets/tilesets/starttiles.png');
    this.load.tilemapTiledJSON('mapstart', './assets/tilemaps/Start.json');
    this.load.image('title', './assets/sprites/title.png');
    this.load.image('startbutton', './assets/sprites/start.png');
    this.load.image('tutorialbutton', './assets/sprites/tutorial.png');
    this.load.spritesheet('pointer', './assets/spriteSheets/fireball.png', {
      frameHeight: 25,
      frameWidth: 16.666
    });

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;

    //load sounds assets
    this.load.audio("music", ["assets/sounds/sci-fi_platformer12.ogg", "assets/sounds/sci-fi_platormer12.mp3"]);
  }

  create (data) {
    //Load in Background
    this.registry.set('times', []);
    this.registry.set('scores', []);
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
    const startbutton = this.add.sprite(410, 407, 'startbutton');
    startbutton.setScale(.8);
    const tutorialbutton = this.add.sprite(415, 467, 'tutorialbutton');
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

    //create music
    this.music = this.sound.add("music");

    var musicConfig = {
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: false,
      delay: 0
    }

    this.music.play(musicConfig);

}

  update (time, delta) {
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
        this.scene.start('EasyNormal', {time: this.time});
      }
    }

    //Press enter to go to next scene
    if (this.pointer.y == 407 & this.pointer.x == 330) {
      if (Phaser.Input.Keyboard.JustDown(this.enter)){
        this.scene.start('EasyNormal', {time: this.time});
      }
    }
    if (this.pointer.y == 467 & this.pointer.x == 300) {
      if (Phaser.Input.Keyboard.JustDown(this.enter)){
        this.scene.start('Tutorial', {time: this.time});
      }
    }
  }
}
