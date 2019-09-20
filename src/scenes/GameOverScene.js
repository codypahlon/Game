/*global Phaser*/
export default class GameOverScene extends Phaser.Scene {
  constructor () {
    super('GameOverScene');
  }

  init (data) {
    // Initialization code goes here
    if (typeof data.score == 'number'){
      this.score = [data.score];
    } else {
      this.score = data.score;
    }
  
  }

  preload () {
    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2 - 100;
  }

  create (data) {
    //Create the scene
    var text = this.add.text(this.centerX - 20, this.centerY, 'GAME OVER');
    var len = this.score.length;
    var centerY = this.centerY;
    var yourScore = this.score[this.score.length - 1];
    this.score.sort(function(a,b){return a - b});
    for (var i = 0; i < 10; i++){
      centerY += 25;
      var j = i + 1;
      var score = this.add.text(this.centerX - 20, centerY, j.toString() + ': ' + this.score[i] + ' seconds');    
    }
    var yourScore = this.add.text(this.centerX -20, centerY + 50, 'Your Score: ' + yourScore);
    var tryAgain = this.add.text(this.centerX - 20, centerY + 75, 'Press left to try again.')
  }
  

  update (time, delta) {
    // Update the scene
    var cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
      this.scene.start('Scene0', {score: this.score});
    }
  }  
}
