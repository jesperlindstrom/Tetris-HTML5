/// <reference path="../../lib/modernizr.d.ts" />

module Game {
	export var layers: any = {};
	export var loop: Core.Loop;

	/**
	 * Initialize the Tetris game
	 */
	export function start() {
		// No canvas support?
		if (!Modernizr.canvas) {
			document.body.innerHTML = 'HTML5 canvas is not supported. Please upgrade your web browser.';
			return;
		}

		Core.Log.info('Initialized game', 'Game/Main');

		// Create graphics layers
		layers.background = new Core.Renderer('background', 440, 600, 1, '#000');
		layers.game = new Core.Renderer('game', 440, 600, 2);

		// Create game loop
		loop = new Core.Loop();

		// Queue all assets to be preloaded
		Game.UI.preload();
		Game.Blocks.preload();

		// Preload all queued assets, then start game
		Core.Assets.preload(() => {
			// Initialize game entities
			Game.UI.initialize();
			Game.Blocks.initialize();

			// Start game loop
			loop.start();
		});

		// Render to canvas after each frame
		loop.onUpdateLast((rate) => {
			layers.background.render();
			layers.game.render();
		});

		// Touch device? Enable touch controls
		if (Modernizr.touch) {
			Game.Mobile.initialize();
		}

		// Show FPS?
		if (Game.config.showFPS) {
			Core.Debug.initialize(loop);
		}
	}

	window.onload = Game.start;
}