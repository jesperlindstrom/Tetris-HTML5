module Game {
	export var config = {
		logLevel: Core.LogLevel.Info
	};

	export var layers: any = {};
	export var loop: Core.Loop;

	/**
	 * Initialize the Tetris game
	 */
	export function start() {
		Core.Log.info('Initialized game', 'Game/Main');

		// Create graphics layers
		layers.background = new Core.Renderer('background', 800, 480, 1, '#000');
		layers.game = new Core.Renderer('game', 800, 480, 2);

		// Create game loop
		loop = new Core.Loop();

		// Initialize game entities
		Game.UI.initialize();
		Game.Blocks.initialize();
		Game.Player.initialize();

		// Preload assets, then start game loop
		Core.Assets.onPreload(loop.start);
	}

	window.onload = Game.start;
}