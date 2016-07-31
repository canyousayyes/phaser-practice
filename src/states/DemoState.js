import _ from 'lodash';

class DemoState extends Phaser.State {

	constructor() {
		super();
		this._platforms = null;
		this._player = null;
		this._stars = null;
		this._scoreText = null;
		this._score = 0;
	}

	preload() {
		this.game.load.image('sky', 'assets/sky.png');
		this.game.load.image('ground', 'assets/platform.png');
		this.game.load.image('star', 'assets/star.png');
		this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
	}

	create() {
		// Background
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.add.sprite(0, 0, 'sky');

		// Platforms
		let platforms = this.game.add.group();
		platforms.enableBody = true;

		let ground = platforms.create(0, this.game.world.height - 64, 'ground');
		ground.scale.setTo(2, 2);
		ground.body.immovable = true;

		let ledge = platforms.create(400, 400, 'ground');
		ledge.body.immovable = true;

		let ledge2 = platforms.create(-150, 250, 'ground');
		ledge2.body.immovable = true;

		this._platforms = platforms;

		// Player
		let player = this.game.add.sprite(32, this.game.world.height - 150, 'dude');
		this.game.physics.arcade.enable(player);
		player.body.bounce.y = 0.2;
		player.body.gravity.y = 300;
		player.body.collideWorldBounds = true;
		player.animations.add('left', [0, 1, 2, 3], 10, true);
		player.animations.add('right', [5, 6, 7, 8], 10, true);

		this._player = player;

		// Stars
		let stars = this.game.add.group();
		stars.enableBody = true;
		_.times(12, (i) => {
			let star = stars.create(i * 70, 0, 'star');
			star.body.gravity.y = 120;
			star.body.bounce.y = 0.2 + Math.random() * 0.2;
		});
		this._stars = stars;

		// Score
		this._scoreText = this.game.add.text(32, 32, this.getScoreText(), {
			fontSize: '32px',
			fill: '#000'
		});
	}

	getScoreText() {
		return `Score: ${this._score}`;
	}

	collectStar(player, star) {
		star.kill();
		this._score += 10;
		this._scoreText.text = this.getScoreText();
	}

	update() {
		// Collision
		this.game.physics.arcade.collide(this._player, this._platforms);
		this.game.physics.arcade.collide(this._stars, this._platforms);
		this.game.physics.arcade.overlap(this._player, this._stars, this.collectStar, null, this);

		// Movement Control
		let cursors = this.game.input.keyboard.createCursorKeys();
		this._player.body.velocity.x = 0;
		if (cursors.left.isDown) {
			this._player.body.velocity.x = -150;
			this._player.animations.play('left');
		} else if (cursors.right.isDown) {
			this._player.body.velocity.x = 150;
			this._player.animations.play('right');
		} else {
			this._player.animations.stop();
			this._player.frame = 4;
		}

		if (cursors.up.isDown && this._player.body.touching.down) {
			this._player.body.velocity.y = -350;
		}
	}
}

export default DemoState;
