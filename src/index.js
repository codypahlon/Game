/*global Phaser, window*/
import Scene0 from './scenes/Scene0.js';
import GameOverScene from './scenes/GameOverScene.js';
import Config from './config/config.js';

class Game extends Phaser.Game {
  constructor () {
    super(Config);
    this.scene.add('Scene0', Scene0);
    this.scene.add('GameOverScene', GameOverScene);
    this.scene.start('Scene0');
  }
}

window.game = new Game();