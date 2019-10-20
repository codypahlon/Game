/*global Phaser*/
export default class GameOverScene extends Phaser.Scene {
  constructor () {
    super('GameOverScene');
  }

  init (data) {
    // Initialization code goes here
    if (typeof data.time == 'number'){
      this.time = [data.time];
    } else {
      this.time = data.time;
    };
    this.score = data.score;
  }

  preload () {
    this.load.image('tiles', './assets/tilesets/tilesetcolor.png');
    this.load.tilemapTiledJSON('map1', './assets/tilemaps/GameOverScene.json');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2 - 100;
  }

  create (data) {
    //Load in Background
    const map = this.make.tilemap({key: 'map1'});
    const tileset = map.addTilesetImage('tilesetcolor', 'tiles');
    const sky = map.createStaticLayer('bg', tileset, 0, 0);
    sky.setDepth(-10);
    this.TILE_BIAS = 32;

    //Create the scene
    var len = this.time.length;
    var centerY = this.centerY;
    var yourTime = this.time[this.time.length - 1];
    this.time.sort(function(a,b){return a - b});
    for (var i = 0; i < len && i < 5; i++){
      centerY += 25;
      var j = i + 1;
      var time = this.add.text(this.centerX - 90, centerY + 90, j.toString() + ': ' + this.time[i] + ' seconds');
    }
    if (yourTime == 0){
      yourTime = 'YOU LOST';
    }
    var yourTime = this.add.text(this.centerX - 90, this.centerY + 250, 'Your time: ' + yourTime);
    var yourScore = this.add.text(this.centerX - 90, this.centerY + 275, 'Your score: ' + this.score);
    var tryAgain = this.add.text(this.centerX - 120, this.centerY + 325, 'Press left to try again.')
  }


  update (time, delta) {
    // Update the scene
    var cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
      this.scene.start('Level01', {time: this.time});
    }
  }
}
