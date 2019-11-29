/*global Phaser*/
export default class Level01 extends Phaser.Scene {
  constructor () {
    super('Level01');
  }

  init (data) {
    // Initialization code goes here
    this.times = data.times;
    this.gameMode = data.gameMode;
    this.registry.set('gameMode', this.gameMode);
    if (data != null && !(data.tutorial)) {
      this.hasKey = data.hasKey;
      this.fromKey = data.fromKey;
      this.score = data.score;
      this.beatWizard = data.beatWizard;
      this.health = data.health;
      this.timeElapsed = data.timeElapsed;
    }
  }

  preload () {
    // Preload assets
    this.load.spritesheet("dragon", "./assets/spriteSheets/dragon.png",{
      frameHeight: 100,
      frameWidth: 121
    });
    //this.load.image('newBackground', './assets/sprites/bigbackground.png');
    this.load.image('spikes', './assets/sprites/spikes.png');
    this.load.image('spikesFlipped', './assets/sprites/spikesFlipped.png');
    this.load.image('tiles', './assets/tilesets/tilesetcolor.png');
    this.load.image('platform', './assets/sprites/platform.png');
    //this.load.image('swingingAxe', './assets/sprites/swingingAxe.png');
    this.load.tilemapTiledJSON('map', './assets/tilemaps/Level01color.json');
    this.load.spritesheet("chest", "./assets/spriteSheets/chest.png", {
      frameHeight: 75,
      frameWidth: 100
    });
    this.load.spritesheet('viking', './assets/spriteSheets/viking.png', {
      frameHeight: 100,
      frameWidth: 80
    });
    this.load.spritesheet('wizard', './assets/spriteSheets/bluewizard.png', {
      frameHeight: 110,
      frameWidth: 75
    });
    this.load.spritesheet('dwarfAxe', './assets/spriteSheets/dwarfAxe.png', {
      frameHeight: 50,
      frameWidth: 50
    });
    this.load.spritesheet('dwarfShield', './assets/spriteSheets/dwarfShield.png', {
      frameHeight: 50,
      frameWidth: 60
    });
    this.load.spritesheet('fireball', './assets/spriteSheets/fireball.png', {
      frameHeight: 25,
      frameWidth: 16.666
    });
    this.load.spritesheet('explosion', './assets/spriteSheets/explosion.png', {
      frameHeight: 16,
      frameWidth: 16
    });
    this.load.spritesheet('coin', './assets/spriteSheets/coin.png', {
      frameHeight: 25,
      frameWidth: 17
    });
    this.load.spritesheet('beam', './assets/spriteSheets/bluefire.png',{
      frameHeight: 25,
      frameWidth: 16.666
    });
    this.load.spritesheet('easyHeart', './assets/spriteSheets/easyHeart.png', {
      frameHeight: 35,
      frameWidth: 420
    });
    this.load.spritesheet('heart', './assets/spriteSheets/heart.png', {
      frameHeight: 35,
      frameWidth: 140
    });
    this.load.spritesheet('dragontail', './assets/spriteSheets/dragontail.png', {
      frameHeight: 120,
      frameWidth: 110
    });
    this.load.spritesheet('dragonjump', './assets/spriteSheets/dragonjump.png', {
      frameHeight: 60,
      frameWidth: 105
    });
    this.load.spritesheet('dwarfBow', './assets/spriteSheets/dwarfBow.png', {
      frameHeight: 51,
      frameWidth: 86
    });
    this.load.spritesheet('arrow', './assets/spriteSheets/arrow.png', {
      frameHeight: 10,
      frameWidth: 45
    });

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;

    //load sounds assets
    //this.load.audio("music", ["assets/sounds/sci-fi_platformer12.ogg", "assets/sounds/sci-fi_platormer12.mp3"]);
    this.load.audio("coin", ["assets/sounds/coinCollect.ogg", "assets/sounds/coinCollect.mp3"]);
    this.load.audio("explode", ["assets/sounds/explosion.ogg", "assets/sounds/explosion.mp3"]);
  }

  create (data) {
    // Declare variables
    if (this.beatWizard == null){
      this.beatWizard = false;
    }
    this.gameOver = true;
    this.meleeing = false;
    this.initialized = false;
    this.bowDwarfDead = 0;
    this.inLava = false;
    if (this.hasKey == null){
      this.hasKey = false;
    }

    // Adding timer for the level
    this.timer = this.time.addEvent({
      delay: 0,
      callback: null,
      callbackScope: this,
      loop: true
    });

    // Make the map work
    const map = this.make.tilemap({key: 'map'});
    const tileset = map.addTilesetImage('tilesetcolor', 'tiles');
    this.platforms = map.createStaticLayer('Collision', tileset, 0, 0);
    const sky = map.createStaticLayer('Background', tileset, 0, 0);
    this.lava = map.createStaticLayer('Lava', tileset, 0, 0);
    sky.setDepth(-10);
    const door1 = map.createStaticLayer('Door1', tileset, 0, 0);
    const door2 = map.createStaticLayer('Door2', tileset, 0, 0);
    this.lava.name = 'lava';
    this.lava.setCollisionByExclusion(-1, true);
    this.platforms.setCollisionByExclusion(-1, true);
    this.TILE_BIAS = 32;

    // Add swinging axe
    /*
    this.swingingAxe = this.physics.add
      .sprite(6600, 535, 'swingingAxe')
      .setSize(250, 375)
      .setDisplaySize(250, 375)
      .setGravity(0, -1000);
    this.swingingAxe.flipY = true;
    */

    // Add in the breakable blocks
    this.door1 = this.physics.add
      .sprite(3750, 1088, 'platform')
      .setSize(100, 25)
      .setAlpha(0)
      .setGravity(0, -1000)
      .setImmovable(true)
      .setDisplaySize(64, 64);
    this.door2 = this.physics.add
      .sprite(9568, 1088, 'platform')
      .setSize(100, 25)
      .setAlpha(0)
      .setGravity(0, -1000)
      .setImmovable(true)
      .setDisplaySize(64, 64);
    this.block = this.physics.add
      .sprite(720, 1137, 'platform')
      .setSize(99, 32)
      .setGravity(0, -1000)
      .setImmovable(true)
      .setDisplaySize(96, 32);
    this.block2 = this.physics.add
      .sprite(1296, 1137, 'platform')
      .setSize(99, 32)
      .setGravity(0, -1000)
      .setImmovable(true)
      .setDisplaySize(96, 32);
    this.block3 = this.physics.add
      .sprite(8800, 1088, 'platform')
      .setSize(100, 25)
      .setGravity(0, -1000)
      .setImmovable(true)
      .setDisplaySize(64, 64);
    this.block3.name = 'bossBlock';


    // Create all of the spikes
    var spikes = this.physics.add.staticGroup();
    var spikesFlipped = this.physics.add.staticGroup();
    spikesFlipped.name = 'spikesFlipped';
    spikes.name = 'spikes';
    this.createSpikes(2033, 1007, 3, spikes);
    this.createSpikes(2033 + 32 * 7, 1007, 2, spikes);
    this.createSpikes(2033 + 32 * 12, 1007, 3, spikes);
    this.createSpikes(2033 + 32 * 16, 1007, 2, spikes);
    this.createSpikes(2033 + 32 * 21, 1007, 4, spikes);
    this.createSpikes(2033 + 32 * 28, 1007, 2, spikes);
    this.createSpikes(2033 + 32 * 39, 1007, 3, spikes);
    this.createSpikes(2033 + 32 * 44, 1007, 7, spikes);
    this.createSpikes(7696, 1107, 3, spikes);
    this.createSpikes(7696 + 32 * 6, 1107, 3, spikes);
    this.createSpikes(7696 + 32 * 15, 1107, 3, spikes);
    this.createSpikes(5328, 688, 8, spikesFlipped);
    this.createSpikes(7696 + 32 * 6, 336, 4, spikesFlipped);
    this.createSpikes(7696 + 32 * 10, 336 - 32, 2, spikesFlipped);
    this.createSpikes(7696 + 32 * 12, 336 - 32* 2, 2, spikesFlipped);

    // Add the dragon and all of his properities
    //150, 1000
    if (this.fromKey){
      this.player = this.physics.add.sprite(3850, 1000, 'dragon');
    } else {
      this.player = this.physics.add.sprite(150, 1000, 'dragon');
    }
    //this.player.disableBody(true, true);
    this.player.collideWorldBounds = true;
    this.player
      .setDisplaySize(80, 64)
      .setSize(80, 64)
      .setOffset(30, 30);
    this.player.name = 'dragon';
    this.player.body.setMaxSpeed(10000);
    this.player.body.setMaxVelocity(1000);
    this.player.body.setDragX(10000);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    // Adding in the fireball
    var fireball, fireballs, enemy, enemyGroup;

    this.fireballs = this.physics.add.group({
      defaultKey: 'fireball',
    });

    // Adding in the wizard's fireballs
    this.wizardFireballs = this.physics.add.group({
      defaultKey: 'beam'
    });

    // Adding in the arrows for bowDwarf
    this.arrows = this.physics.add.group({
      defaultKey: 'arrow'
    });

    // Add event listener for shoot
    this.input.keyboard.on('keydown_SPACE', this.shoot, this);

    // Add event listener for jump
    this.jumpMax = 2;
    this.jumpCount = 0;
    this.input.keyboard.on('keydown_UP', this.doubleJump, this);

    // Add in all of the chests
    this.chest = this.physics.add.sprite(1020, 200, 'chest');
    this.chest.setDepth(-10);
    this.chest2 = this.physics.add.sprite(3120, 1000, 'chest');
    this.chest2
      .setSize(96, 75)
      .setDisplaySize(96, 75)
      .setDepth(-10);
    this.chest3 = this.physics.add.sprite(1000, 1200, 'chest');
    this.chest3.setDepth(-10);
    this.chest4 = this.physics.add.sprite(8575, 100, 'chest');
    this.chest4.setDepth(-10);
    this.chest.name = 'chest';
    this.chest2.name = 'chest2';
    this.chest3.name = 'chest3';
    this.chest4.name = 'chest4';

    // Add in both of the vikings
    this.viking = this.physics.add.sprite(1420, 1010, 'viking');
    this.viking.setSize(70, 96);
    this.viking2 = this.physics.add.sprite(4100, 1010, 'viking');
    this.viking2.setSize(70, 96);
    this.viking.health = 2;
    this.viking2.health = 2;
    this.viking.name = 'viking';
    this.viking2.name = 'viking';

    // Add in the wizard
    this.wizard = this.physics.add.sprite(9480, 1050, 'wizard');
    this.wizard.setScale(1.2);
    this.wizard.setImmovable(true);
    this.wizard.body.enable = false;
    this.wizard.name = 'wizard';
    if (this.gameMode == 'normal'){
      this.wizard.health = 50;
    } else {
      this.wizard.health = 15;
    }


    // Add in the 3 dwarves
    this.dwarf = this.physics.add.sprite(900, 1010, 'dwarfAxe');
    this.dwarf2 = this.physics.add.sprite(1000, 1010, 'dwarfAxe');
    this.dwarf3 = this.physics.add.sprite(1100, 1010, 'dwarfAxe');
    this.dwarf.health = 1;
    this.dwarf2.health = 1;
    this.dwarf3.health = 1;
    this.dwarf.name = 'dwarf';
    this.dwarf2.name = 'dwarf';
    this.dwarf3.name = 'dwarf';

    //Add in shield dwarves
    this.shieldDwarf = this.physics.add.sprite(1970, 900, 'dwarfShield');
    this.shieldDwarf.health = 1;
    this.shieldDwarf.name = 'shieldDwarf';
    this.shieldDwarf.setImmovable(true);

    //Add in the bow dwarves
    this.bowDwarf = this.physics.add.sprite(1500, 700, 'dwarfBow');
    this.bowDwarf2 = this.physics.add.sprite(4360, 700, 'dwarfBow');
    this.bowDwarf3 = this.physics.add.sprite(4840, 500, 'dwarfBow');
    this.bowDwarf.health = 1;
    this.bowDwarf2.health = 1;
    this.bowDwarf3.health = 1;
    this.bowDwarf.name = 'bowDwarf';
    this.bowDwarf2.name = 'bowDwarf';
    this.bowDwarf3.name = 'bowDwarf';

    // Making enemy enemyGroup
    this.enemyGroup = this.physics.add.group();
    var enemies = [this.dwarf, this.dwarf2, this.dwarf3, this.viking, this.viking2, this.shieldDwarf, this.bowDwarf, this.bowDwarf2, this.bowDwarf3];

    for (var i = 0; i < enemies.length; i++){
      this.enemyGroup.add(enemies[i]);
    }

    // All of the physics between all the sprites
    this.platformCollisions = [this.viking, this.viking2, this.player, this.chest, this.chest2, this.chest3, this.chest4, this.wizard, this.dwarf, this.dwarf2, this.dwarf3, this.shieldDwarf, this.bowDwarf, this.bowDwarf2, this.bowDwarf3];
    this.physics.add.overlap(this.player, this.chest, this.checkOverlap, null, this).name = 'chest';
    this.physics.add.overlap(this.player, this.chest2, this.checkOverlap, null, this).name = 'chest2';
    this.physics.add.overlap(this.player, this.chest3, this.checkOverlap, null, this).name = 'chest3';
    this.physics.add.overlap(this.player, this.chest4, this.checkOverlap, null, this).name = 'chest4';
    this.physics.add.collider(this.platformCollisions, this.platforms);
    this.physics.add.collider(this.player, this.lava, ()=>{
      this.inLava = true;
      this.gotHit(this.player, this.lava);
    }, null, this);
    this.physics.add.collider(enemies, [this.block, this.block2, this.block3]);
    this.physics.add.collider(this.player, this.block, this.destroyBlock, null, this);
    this.physics.add.collider(this.player, this.block2, this.destroyBlock, null, this);
    this.physics.add.collider(this.player, this.block3, this.destroyBlock, null, this);
    this.physics.add.collider(this.player, this.wizard, this.gotHit, null, this).name = 'wizard';
    this.physics.add.collider(this.player, enemies, this.gotHit, null, this);
    this.physics.add.collider(this.player, spikes, this.gotHit, null, this);
    this.physics.add.collider(this.player, spikesFlipped, this.gotHit, null, this);
    this.physics.add.collider(this.player, this.door1, this.goToKeyScene, null, this);
    this.physics.add.collider(this.player, this.door2, this.endLevel, null, this);

    // Properties of the camera
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBackgroundColor('#1f2712')

    //Create animations
    this.anims.create({
      key: 'dragonwalk',
      frames: this.anims.generateFrameNumbers('dragon', {start: 1, end: 4}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'dragonjump',
      frames: this.anims.generateFrameNumbers('dragonjump', {start: 0, end: 1}),
      frameRate: 5,
      repeat: -1
    });

    this.whip = this.anims.create({
      key: 'dragontailwhip',
      frames: this.anims.generateFrameNumbers('dragontail', {start: 0, end: 5}),
      duration: 500,
      repeat: -1
    })

    this.anims.create({
      key: 'vikingwalk',
      frames: this.anims.generateFrameNumbers('viking', {start: 1, end: 3}),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'dwarfAttack',
      frames: this.anims.generateFrameNumbers('dwarfAxe', {start: 0, end: 2}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'shieldDwarfIdle',
      frames: this.anims.generateFrameNumbers('dwarfShield', {start: 0, end: 0}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'shieldDwarfBlock',
      frames: this.anims.generateFrameNumbers('dwarfShield', {start: 2, end: 2}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('dragon', {start: 0, end: 0}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'open',
      frames: this.anims.generateFrameNumbers('chest', {start: 0, end: 1}),
      frameRate: 10,
      repeat: 0
    });

    this.anims.create({
      key: 'wizard',
      frames: this.anims.generateFrameNumbers('wizard', {start: 1, end: 2}),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'explosion',
      frames: this.anims.generateFrameNumbers('explosion', {start: 0, end:4}),
      framerate: 10,
      repeat: 0
    });

    this.anims.create({
      key: 'spin',
      frames: this.anims.generateFrameNumbers('coin', {start: 0, end: 5}),
      frameRate: 9,
      repeat: -1
    });

    this.anims.create({
      key: 'fireball',
      frames: this.anims.generateFrameNumbers('fireball', {start: 0, end: 2}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'beam',
      frames: this.anims.generateFrameNumbers('beam', {start: 0, end: 2}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'outOfBeam',
      frames: this.anims.generateFrameNumbers('wizard', {start: 0, end: 0}),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: 'bowDwarfShoot',
      frames: this.anims.generateFrameNumbers('dwarfBow', {start: 0, end: 1}),
      frameRate: 10,
      repeat: 0
    });

    // Add in the tweens
    this.wizard.anims.play('wizard', true);
    this.countTween = 0;
    this.wizardTween = this.tweens.add({
    paused: true,
    targets: this.wizard,
    delay: 2000,
    props: {
      x: 8890,
      y: {value: 900, duration: 1500, ease: 'Linear'}
    },
    duration: 2000,
    ease: 'Power2',
    loop: -1,
    yoyo: true,
    onLoop: ()=>{
      this.countTween += 1;
      this.wizardAttack();
      this.wizard.anims.play('outOfBeam', true);
      this.time.addEvent({
        delay: 2000,
        callback: ()=>{
          this.wizard.anims.play('wizard', true);
        }
      });
      }
    });

    this.bowDwarfTween = this.tweens.add({
      paused: true,
      targets: [this.bowDwarf, this.bowDwarf2, this.bowDwarf3],
      delay: 200,
      duration: 100,
      loop: -1,
      loopDelay: 1000,
      onLoop: ()=>{
        var targets = this.bowDwarfTween.targets;
        for (var i = 0; i < targets.length; i++){
          if (targets[i].x - this.player.x < 500 && targets[i].x - this.player.x > 0){
            targets[i].anims.play('bowDwarfShoot', true);
            targets[i].flipX = false;
            this.shootArrow(targets[i], this.player);
          } else if (this.player.x - targets[i].x < 500 && this.player.x - targets[i].x > 0){
            targets[i].anims.play('bowDwarfShoot', true);
            targets[i].flipX = true;
            this.shootArrow(targets[i], this.player);
          }
        }
      }
    })

    /*
    this.swingingAxeAngle = 0;
    this.swingingAxe.setOrigin(0.5, 0);
    this.swingingAxeTween = this.tweens.add({
      targets: this.swingingAxe,
      duration: 1000,
      loop: -1,
      onLoop: ()=>{
        if (this.swingingAxeAngle < 90){
          this.swingingAxeAngle += 1;
        } else if (this.swingingAxe > 90){
          this.swingingAxeAngle -= 1;
        }
        this.swingingAxe.setAngle(this.swingingAxeAngle);
      }
    });
    */

    //  The score
    if (this.fromKey){
      var score = this.score;
    } else {
      score = 0;
    }
    this.score = score;
    this.scoreText = this.add.text(20, 55, "Score: " + score, {
      fontSize: "32px"
    });
    this.scoreText.setScrollFactor(0);

    //Player health tracker
    if (this.health == null && this.gameMode == 'normal'){
      this.health = 100;
    } else if (this.health == null && this.gameMode == 'easy'){
      this.health = 300;
    }

    if (this.gameMode == 'normal'){
      this.heart = this.physics.add.sprite(85, 40, 'heart');
      this.smallHeart = this.physics.add.sprite(400, 270, 'heart');
      this.heart.setGravity(0, -1000);
      this.smallHeart.setGravity(0, -1000);
      this.player.health = this.health;
      this.heart.setFrame((1 - (this.player.health / 100)) * 4);
      this.smallHeart.setFrame((1 - (this.player.health / 100)) * 4);
      this.heart.setScrollFactor(0, 0);
      this.smallHeart.setScrollFactor(0, 0);
      this.smallHeart.setDisplaySize(100, 30);
      this.smallHeart.setAlpha(0.25);
    } else {
      this.heart = this.physics.add.sprite(225, 40, 'easyHeart');
      this.smallHeart = this.physics.add.sprite(400, 270, 'easyHeart');
      this.heart.setGravity(0, -1000);
      this.smallHeart.setGravity(0, -1000);
      this.player.health = this.health;
      var frame = Math.round((1 - (this.player.health / 300)) * 12)
      this.heart.setFrame(frame);
      this.smallHeart.setFrame(frame);
      this.heart.setScrollFactor(0, 0);
      this.smallHeart.setScrollFactor(0, 0);
      this.smallHeart.setDisplaySize(300, 30);
      this.smallHeart.setAlpha(0.25);
    };

    if (this.beatWizard == true){
      this.wizard.disableBody(true, true);
      this.block3.disableBody(true, true);
    }

    //play music

    //this.music = this.sound.add("music");
    this.coinSound = this.sound.add("coin");
    this.explodeSound = this.sound.add("explode");

    //var musicConfig = {
      //mute: false,
      //volume: 1,
      //rate: 1,
      //: 0,
      //seek: 0,
      //loop: true,
      //delay: 0
    //}

    //this.music.play(musicConfig);

  }

  update (time, delta) {
    // Flipping wizard
    if (this.wizard.x == 8890){
      this.wizard.flipX = true;
    } else if (this.wizard.x == 9480){
      this.wizard.flipX = false;
    }

    // Attacking from the sky
    if (this.wizard.x == 9480 && this.countTween == 3){
      this.wizardSkyAttack();
      this.countTween = 0;
      this.wizardTween.pause();
      this.wizard.body.enable = true;
      this.wizard.setTint(0xff9999);
      this.time.addEvent({
        delay: 5000,
        callback: ()=>{
          if (this.beatWizard == false){
            this.wizardTween.resume();
            this.wizard.clearTint();
            this.wizard.body.enable = false;
          }
        }
      });
    }

    // Add colliders to wizard wizardFireballs
    this.wizardFireballs.children.each(
      function (b) {
        if (b.active) {
          b.name = 'wizardFireball';
          this.physics.add.overlap(this.player, b, this.gotHit, null, this);
          this.physics.add.collider(b, this.platforms, function destroy() {b.destroy();}, null, this);
          if (b.x > this.wizard.x + 500){
            b.destroy();
          }
        }
      }.bind(this)
    );

    // Add colliders to arrows
    this.arrows.children.each(
      function (b) {
        if (b.active) {
          b.name = 'wizardFireball';
          this.physics.add.overlap(this.player, b, this.gotHit, null, this);
          this.physics.add.collider(b, this.platforms, function destroy() {b.destroy();}, null, this);
          if (Math.abs(this.player.x - b.x) > 500){
            b.destroy();
          }
        }
      }.bind(this)
    );

    // Add colliders to fireballs
    this.fireballs.children.each(
      function (b) {
        if (b.active) {
          this.physics.add.overlap(b, this.wizard, this.hitEnemy, null, this);
          this.physics.add.overlap(b, this.enemyGroup, this.hitEnemy, null, this);
          this.physics.add.collider(b, this.platforms, function destroy(){b.destroy();}, null, this);
          if (b.x > this.player.x + 500){
            b.destroy();
          }
        }
      }.bind(this)
    );

    if (this.fireballs.children.entries.length == 0){
      this.meleeing = false;
    };

    // Make the enemies track the player when you get close
    this.enemyGroup.children.each(
      function (b) {
        if (b.active) {
          var anim;
          if (b.name != 'shieldDwarf' && b.name != 'bowDwarf'){
            if (b.name == 'viking'){
              anim = 'vikingwalk';
            } else if (b.name == 'dwarf'){
              anim = 'dwarfAttack';
            }
            if (this.player.x - b.x <= 400 && this.player.x - b.x > 10){
              b.body.setVelocityX(150);
              b.anims.play(anim, true);
              b.flipX = true;
            } else if (b.x - this.player.x <= 400 && b.x - this.player.x > 10){
              b.body.setVelocityX(-150);
              b.anims.play(anim, true);
              b.flipX = false;
            } else {
              b.body.setVelocityX(0);
              b.anims.play(anim, false);
            }
          } else if (b.name == 'bowDwarf' && this.initialized == false){
            this.initialized = true;
            this.bowDwarfTween.resume();
          }
        }
      }.bind(this)
    );


    //Changing scenes to gameover
    if (!this.gameOver) {
      if (this.timeElapsed == null){
        this.timeElapsed = 0;
      }
      console.log(this.times);
      this.times.push(this.timer.getElapsedSeconds() + this.timeElapsed);
      if (this.beatWizard && this.hasKey){
        this.scene.start('End', {times: this.times, scores: this.score});
      } else {
        this.scene.start('GameOverScene', {times: this.times, scores: this.score, gameMode: this.gameMode});
      }
      this.gameOver = true;
      return;
    }

    //Set speed of player
    const speed = 600;
    const prevVelocity = this.player.body.velocity.clone();

    //Create cursor keys and assign events
    var cursors = this.input.keyboard.createCursorKeys();


    if (cursors.left.isDown) {
      this.player.body.setVelocityX(-speed);
      this.player.anims.play("dragonwalk", true);
      this.player.flipX = true;
    } else if (cursors.right.isDown) {
      this.player.body.setVelocityX(speed);
      this.player.anims.play("dragonwalk", true);
      this.player.flipX = false;
    } else if (cursors.shift.isDown) {
      this.player.anims.play("dragontailwhip", true);
      this.meleeing = true;
      this.melee();
    } else if (cursors.up.isDown) {
      this.player.anims.play("dragonjump", true);
    } else if (!(cursors.shift.isDown) && !(cursors.right.isDown) && !(cursors.left.isDown)){
      this.player.anims.play("idle", false);
    }
    if (this.jumpCount == 2 && this.player.body.onFloor()){
      this.jumpCount = 0;
    }
  }

goToKeyScene (player, door){
  this.scene.start('Key', {times: this.times, score: this.score, beatWizard: this.beatWizard, health: this.player.health, timeElapsed: this.timer.getElapsedSeconds(), gameMode: this.gameMode});
}

// Checking whether the player was hit
gotHit(spriteA, spriteB){
  if (this.inLava){
    spriteA.health = 0;
    spriteA.destroy();
    this.gameOver = false;
    this.win = false;
  } else {
    spriteA.health -= 25;
    if (this.gameMode == 'normal'){
      var frame = (1- (spriteA.health / 100)) * 4;
    } else if (this.gameMode == 'easy'){
      var frame = Math.round((1 - (spriteA.health / 300)) * 12);
    }
    this.heart.setFrame(frame);
    this.smallHeart.setFrame(frame);

    if (spriteB.name == 'wizardFireball'){
      spriteB.destroy();
    } else {
      if (this.meleeing == false){
        spriteB.body.enable = false;
        this.time.addEvent({
          delay: 500,
          callback: ()=>{
            spriteB.body.enable = true;
          }
        });
      } else if (this.meleeing == true){
        spriteA.body.enable = false;
        this.time.addEvent({
          delay: 200,
          callback: ()=>{
            spriteA.body.enable = true;
          }
        })
      }
    }

    if (spriteA.health == 0){
      this.gameOver = false;
      this.win = false;
    }
  }
}

// Having the archer dwarves shoot arrows
shootArrow(bowDwarf, player){
  var arrow = this.arrows.get();
  var betweenPoints = Phaser.Math.Angle.BetweenPoints;
  var angle = betweenPoints(bowDwarf, player);
  var velocityFromRotation = this.physics.velocityFromRotation;
  //Create a variable called velocity from a Vector2
  var velocity = new Phaser.Math.Vector2();
  velocityFromRotation(angle, 200, velocity);
  //Get the bullet group
  arrow.setAngle(Phaser.Math.RAD_TO_DEG * angle + 180);
  arrow
    .enableBody(true, bowDwarf.x, bowDwarf.y, true, true)
    .setVelocity(velocity.x, velocity.y)
    .setGravity(0, -1000);
}

// Destroying blocks when player touches them
destroyBlock(spriteA, spriteB){
  this.time.addEvent({
    delay: 500,
    callback: ()=>{
      spriteB.disableBody(true, true);
    }
  });
  if (spriteB.name == 'bossBlock'){
    this.wizardTween.resume();

  }
}

// Reflecting the bullet
reflectFireball(fireball){
  if (this.meleeing == false){
    var velocity = fireball.body.velocity.x;
    fireball.body.velocity.x = -velocity;
    this.physics.add.collider(this.player, fireball, ()=>{
      fireball.name = 'wizardFireball';
      this.gotHit(this.player, fireball);
      fireball.destroy();
    }, null, this);
  }
}

// Collecting coins when player walks over them
collectCoins(player, coins) {
      coins.disableBody(true, true);
      //  Add and update the score
      this.score += 10;
      this.scoreText.setText("Score: " + this.score);
      this.coinSound.play();
}

// Checking to see if player won
endLevel (spriteA, spriteB){
  if (this.hasKey && this.beatWizard){
    this.gameOver = false;
    this.win = true;
  } else {
    if (!(this.hasKey) && ((this.keyText == null) || !(this.keyText.visible))){
      this.keyText = this.add.text(300, 400, "Need a key!", {
        fontSize: "32px"
      });
      this.keyText.setScrollFactor(0);
      this.time.addEvent({
       delay: 500,
       callbackScope: this,
       callback: this.deleteText
     });
    }
  }
}

deleteText(x, y) {
  this.keyText.destroy();
  this.keyText == null;
}

// Flpping the sprite
flipSprite(sprite) {
  sprite.flipX = !(sprite.flipX);
}

// Opening the chests
checkOverlap(spriteA, spriteB) {
  // Destroying chest collider
  this.physics.world.colliders.getActive().find(function(i){
    return i.name == spriteB.name;
  }).destroy();

  // Playing chest animation
  spriteB.anims.play("open", true);

  // Checking which chest so no boundary issues
  var repeat = 4;
  if (spriteB.name == 'chest2'){
    repeat = 2;
  }

  // Creating coins from chest
  this.coins = this.physics.add.group({
    key: "coin",
    repeat: repeat,
    setXY: { x: spriteB.x - 50, y: spriteB.y, stepX: 30}
  });
  this.physics.add.collider(this.coins, this.platforms);
  this.physics.add.overlap(this.player, this.coins, this.collectCoins, null, this);
  this.coins.children.iterate(function(child){
    child.play('spin');
  });
}

// Creating the spikes
createSpikes(x, y, num, spikes) {
  for (var i = 0; i < num; i++){
  spikes
    .create(x + 32 * i, y, spikes.name)
    .setSize(32, 32)
    .setDisplaySize(32, 32);
  }
}

// Shooting a fireball
shoot(space) {
  var fireball = this.fireballs.get();
  fireball.anims.play('fireball');
  fireball.enableBody(true, this.player.x, this.player.y, true, true);
  if (this.player.flipX == true){
    var flag = -1;
  } else {
    var flag = 1;
  }
  fireball.setVelocity(flag * 1000, 0);
  fireball.setGravity(0, -1000);
}

melee(shift) {
  var melee = this.fireballs.get();
  melee.enableBody(true, this.player.x, this.player.y, true, true);
  if (this.player.flipX == true){
    var flag = -1;
  } else {
    var flag = 1;
  }
  melee.setGravity(0, -1000);
  melee.setSize(120, 1);
  melee.setAlpha(0);
  this.time.addEvent({
    delay: 500,
    callback: ()=>{
      melee.destroy();
    }
  });
}

// Having the wizard shoot fireballs
wizardAttack(){
  var x, y, r;
  r = Math.random();
  x = 9480;
  y = this.wizard.y;
  if (r <= 0.33){
    this.enableWizardBall(x, y + 40);
    this.enableWizardBall(x, y -160);
  } else if (r <= 0.66 && r > 0.33) {
    this.enableWizardBall(x, y + 40);
    this.enableWizardBall(x, y -60);
  } else if (r > 0.66 && r <= 1.0){
    this.enableWizardBall(x, y -60);
    this.enableWizardBall(x, y -160);
  }
}

// Creating the fireballs
enableWizardBall(x, y, size = 40, gravity = -1000, velocity = -600){
  var wizardFireball = this.wizardFireballs.get();
  wizardFireball.enableBody(true, x, y, true, true);
  wizardFireball.setVelocity(velocity, 0);
  wizardFireball.setDisplaySize(size, size);
  wizardFireball.setGravity(0, gravity);
  wizardFireball.anims.play('beam');
}

// Having the wizard drop fireballs from the sky
wizardSkyAttack(){
  var r = Math.floor(Math.random() * 4);
  for (var i = 0; i < 5; i++){
    if (i != r){
      this.enableWizardBall(4469 + 118 * i + 4480, 600, 118, -800,  0);
    }
  }
}

// Checking to see whether you have hit an enemy
hitEnemy (fireball, enemy){
  if (enemy.name != 'shieldDwarf'){
    enemy.health -= 1;
    this.score += 5;
    this.scoreText.setText("Score: " + this.score);
  } else if (this.meleeing == true){
    enemy.health -= 1;
    this.score += 5;
    this.scoreText.setText('Score: ' + this.score);
  } else {
    enemy.anims.play('shieldDwarfBlock');
    this.time.addEvent({
      delay: 200,
      callback: ()=>{enemy.anims.play('shieldDwarfIdle');}
    })
  }

  if (enemy.health == 0){
    this.explosion = this.physics.add.sprite(enemy.x, enemy.y, 'explosion');
    this.explosion.setGravity(0, -1000);
    this.explosion.setDisplaySize(50, 50);
    this.explodeSound.play();
    enemy.disableBody(true, true);
    this.explosion.anims.play('explosion', true);
    this.time.addEvent({
      delay: 200,
      callback: ()=>{
        this.explosion.disableBody(true, true);
      }
    });

    if (enemy.name == 'wizard'){
      this.beatWizard = true;
      this.wizardTween.pause();
      this.wizard.disableBody(true, true);
    }
    if (enemy.name == 'bowDwarf'){
      var len = this.bowDwarfTween.targets.length
      var newLst = [];
      for (var i = 0; i < len; i++){
        if (this.bowDwarfTween.targets[i] != enemy){
          newLst.push(this.bowDwarfTween.targets[i]);
        }
      }
      this.bowDwarfTween.targets = newLst;
    }
  }
  if (enemy.name != 'shieldDwarf' && this.meleeing == false){
    fireball.disableBody(true, true);
  } else if (enemy.name == 'shieldDwarf'){
    this.reflectFireball(fireball);
  }
}

// Single jumping
singleJump (){
  this.player.body.velocity.y = -600;
}

// Double jumping
doubleJump (){
  if (this.jumpCount < this.jumpMax){
    this.singleJump();
    this.jumpCount++;
  }
}
}
