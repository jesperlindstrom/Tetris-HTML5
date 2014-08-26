module Game {
	export class Blocks {
		private static blocks: any = {};
		private static blockSize = 40;
		private static blockFormations: any = {
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
		};

		public static preload() {
			Core.Assets.queue('block_light_blue', 'assets/block_light_blue.png');
			Core.Assets.queue('block_blue', 'assets/block_blue.png');
			Core.Assets.queue('block_orange', 'assets/block_orange.png');
			Core.Assets.queue('block_yellow', 'assets/block_yellow.png');
			Core.Assets.queue('block_green', 'assets/block_green.png');
			Core.Assets.queue('block_purple', 'assets/block_purple.png');
			Core.Assets.queue('block_red', 'assets/block_red.png');
		}

		public static initialize() {
			this.blocks.light_blue = Core.Assets.get('block_light_blue');
			this.blocks.blue = Core.Assets.get('block_blue');
			this.blocks.orange = Core.Assets.get('block_orange');
			this.blocks.yellow = Core.Assets.get('block_yellow');
			this.blocks.green = Core.Assets.get('block_green');
			this.blocks.purple = Core.Assets.get('block_purple');
			this.blocks.red = Core.Assets.get('block_red');

			Game.loop.onUpdate((rate) => {
				Game.layers.game.draw((context) => {
					this.blockFormations.green.forEach(block => {
						context.drawImage(this.blocks.green, block[0] * this.blockSize, block[1] * this.blockSize, this.blockSize, this.blockSize);
					});
				});
			});
		}
	}
}