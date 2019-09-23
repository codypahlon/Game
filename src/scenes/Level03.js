/*global Phaser*/
export default class Level03 extends Phaser.Scene {
  constructor () {
    super('Level03');
  }

  init (data) {
    // Initialization code goes here

  }

  preload () {
    // Preload assets
    this.load.spritesheet("dragon", "./assets/spriteSheets/dragon.png",{
      frameHeight: 100,
      frameWidth: 121
    });

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Create the scene


    //State the objective

    //Add timer object

    //Add player


    //Add animations for player
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('dragon', {start: 1, end: 4}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('dragon', {start: 0, end: 0}),
      frameRate: 10,
      repeat: -1
    });
  }

  update (time, delta) {
    // Update the scene

    //Set speed of player
    var speed = 10;

    //Create cursor keys and assign events
    var cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
      this.player.x -= speed;
      this.player.anims.play("walk", true);
      this.player.flipX = true;
    } else if (cursors.right.isDown) {
      this.player.x += speed;
      this.player.anims.play("walk", true);
      this.player.flipX = false;
    } else {
      this.player.anims.play("idle", true);
    }
    if (cursors.up.isDown) {
      this.player.y -= 25;
    } else if (cursors.down.isDown) {
      this.player.y += 25;
    }

};
