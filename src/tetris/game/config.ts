module Game {
	export var config = {
		logLevel: Core.LogLevel.Info,
		grid: {
			size: 40,
			width: 10,
			height: 14
		},
		assetsPath: 'assets/',
		showFPS: true,
		rate: 500, // ms
		blockColors: [ 'light_blue', 'blue', 'orange', 'yellow', 'green', 'purple', 'red' ],
		blockFormations: {
			light_blue: [
				[0,0], [1,0], [2,0], [3,0]
			],

			blue: [
				[0,0],
				[0,1], [1,1], [2,1], [3,1]
			],

			orange: [
				                     [3,0],
				[0,1], [1,1], [2,1], [3,1]
			],

			yellow: [
				[0,0], [1,0],
				[0,1], [1,1]
			],

			green: [
				       [1,0], [2,0],
				[0,1], [1,1]
			],

			purple: [
				       [1,0],
				[0,1], [1,1], [2,1]
			],

			red: [
				[0,0], [1,0],
				       [1,1], [2,1]
			],
		}
	};
}