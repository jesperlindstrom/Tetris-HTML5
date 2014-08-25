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
		layers.background = new Core.Renderer('background', 800, 480, 1);
		layers.game = new Core.Renderer('game', 800, 480, 2);

		loop = new Core.Loop();
		loop.start();

		var deg: number = 0;
		var x, y;

		loop.onUpdate(rate => {
			deg += rate * 0.05;

			Game.layers.background.draw(context => {
				context.fillStyle = 'red';

				x = Math.round(Math.cos(deg) * 150) + 200;
				y = Math.round(Math.sin(deg) * 150) + 200;

				context.fillRect(x, y, 30, 30);
			});

			Game.layers.background.render();
		});
	}

	window.onload = Game.start;
}