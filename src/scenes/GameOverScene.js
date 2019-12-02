/*global Phaser*/
export default class GameOverScene extends Phaser.Scene {
  constructor () {
    super('GameOverScene');
  }

  init (data) {
    this.times = data.times;
    this.scores = data.scores;
    this.gameMode = data.gameMode;
  }

  preload () {
    this.load.image('tiles', './assets/tilesets/tilesetcolor.png');
    this.load.tilemapTiledJSON('map1', './assets/tilemaps/GameOverScene.json');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2 - 100;

    //load musics
    this.load.audio("music", ["assets/sounds/sci-fi_platformer12.ogg", "assets/sounds/sci-fi_platormer12.mp3"]);
  }

  create (data) {
    //Load in Background
    const map = this.make.tilemap({key: 'map1'});
    const tileset = map.addTilesetImage('tilesetcolor', 'tiles');
    const sky = map.createStaticLayer('bg', tileset, 0, 0);
    sky.setDepth(-10);
    this.TILE_BIAS = 32;

    //Create the scene
    var len = this.times.length;
    var centerY = this.centerY;
    var yourTime = this.times[this.times.length - 1];
    this.times.sort(function(a,b){return a - b});
    for (var i = 0; i < len && i < 5; i++){
      centerY += 25;
      var j = i + 1;
      var time = this.add.text(this.centerX - 90, centerY + 90, j.toString() + ': ' + this.times[i] + ' seconds');
    }
    if (yourTime == 0){
      yourTime = 'YOU LOST';
    }
    var yourTime = this.add.text(this.centerX - 90, this.centerY + 250, 'Your time: ' + yourTime);
    var yourScore = this.add.text(this.centerX - 90, this.centerY + 275, 'Your score: ' + this.scores);
    var tryAgain = this.add.text(this.centerX - 120, this.centerY + 325, 'Press left to try again.')

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

    if (cursors.left.isDown) {
      this.scene.start('Level01', {times: this.times, fromKey: false, gameMode: this.gameMode});
    }
  }
}
