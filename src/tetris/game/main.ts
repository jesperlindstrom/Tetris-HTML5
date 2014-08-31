module Game {
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

		// Queue all assets to be preloaded
		Game.UI.preload();
		Game.Blocks.preload();
		Game.Player.preload();

		// Preload all queued assets, then start game
		Core.Assets.preload(() => {
			// Initialize game entities
			Game.UI.initialize();
			Game.Blocks.initialize();
			Game.Player.initialize();

			// Start game loop
			loop.start();
		});

		// Render to canvas after each frame
		loop.onUpdateLast((rate) => {
			layers.background.render();
			layers.game.render();
		});
	}

	window.onload = Game.start;
}