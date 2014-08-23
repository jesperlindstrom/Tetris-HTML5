window.onload = function() {
	var game = new Phaser.Game(700, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
	var logo;
	var platforms;

	function preload () {
		game.load.image('logo', 'phaser.png');
		game.load.image('ground', 'ground.png');
	}

	function create() {
		game.physics.startSystem(Phaser.Physics.ARCADE);

		logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
		logo.anchor.setTo(0.5, 0.5);
		game.physics.arcade.enable(logo);
		logo.body.gravity.y = 900;
		logo.body.bounce.y = 1;
		logo.body.collideWorldBounds = true;

		platforms = game.add.group();
		platforms.enableBody = true;

		var ground = platforms.create(0, game.world.height - 64, 'ground');
		ground.scale.setTo(11, 2);
		ground.body.immovable = true;
	}

	function update() {
		game.physics.arcade.collide(logo, platforms);
	}
};