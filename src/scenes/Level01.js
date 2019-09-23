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
    this.load.image('dragon', './assets/spriteSheets/dragon.png');
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
  }



  update (time, delta) {
    // Update the scene
  }

  gameOverLose(player, lava) {

  }

  gameOverWin(player, volcano) {

  }

}
