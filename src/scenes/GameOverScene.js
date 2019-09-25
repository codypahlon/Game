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
    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2 - 100;
  }

  create (data) {
    //Create the scene
    var text = this.add.text(this.centerX - 20, this.centerY, 'GAME OVER');
    var len = this.time.length;
    var centerY = this.centerY;
    var yourTime = this.time[this.time.length - 1];
    this.time.sort(function(a,b){return a - b});
    for (var i = 0; i < 10; i++){
      centerY += 25;
      var j = i + 1;
      var time = this.add.text(this.centerX - 20, centerY, j.toString() + ': ' + this.time[i] + ' seconds');
    }
    var yourTime = this.add.text(this.centerX -20, centerY + 50, 'Your time: ' + yourTime);
    var yourScore = this.add.text(this.centerX -20, centerY + 75, 'Your score: ' + this.score);
    var tryAgain = this.add.text(this.centerX - 20, centerY + 100, 'Press left to try again.')
  }


  update (time, delta) {
    // Update the scene
    var cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
      this.scene.start('Level01', {time: this.time});
    }
  }
}
