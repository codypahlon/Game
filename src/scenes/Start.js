/*global Phaser*/
export default class Start extends Phaser.Scene {
  constructor () {
    super('Start');
  }

  preload () {
    this.load.image('sTiles', './assets/tilesets/starttiles.png');
    this.load.tilemapTiledJSON('mapstart', './assets/tilemaps/Start.json');
    this.load.image('title', './assets/sprites/title.png');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Load in Background
    const mapstart = this.make.tilemap({key: 'mapstart'});
    const tileset = mapstart.addTilesetImage('starttiles', 'sTiles');
    const sky = mapstart.createStaticLayer('Background', tileset, -70, 0);
    sky.setScale(.38);
    this.platforms = mapstart.createStaticLayer('Collision', tileset, -70, 0);
    this.platforms.setScale(.38);
    this.TILE_BIAS = 32;

    const fafnirdragon = this.add.sprite(410, 270, 'title');
    fafnirdragon.setScale(.34);

}

  update (time, delta) {
    // Update the scene
    var cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
      this.scene.start('Level01', {time: this.time});
    }
  }
}
