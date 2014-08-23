var game = new Phaser.Game(800, 480, Phaser.AUTO, 'game');

var main = {
	preload: function() {
		game.time.advancedTiming = true;
	},

	create: function() {
		
	},

	update: function() { },

	render: function() {
		game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
	}
};

game.state.add('main', main);
game.state.start('main');