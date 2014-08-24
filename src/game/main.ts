module Game {
	export var config = {
		logLevel: Core.LogLevel.Info
	};

	export var layers: any = {};

	export function start() {
		Core.Log.info('Initialized game', 'Game/Main');
		layers.background = new Core.Renderer('background', 800, 480, 1);
		layers.game = new Core.Renderer('game', 800, 480, 2);
	}

	window.onload = Game.start;
}