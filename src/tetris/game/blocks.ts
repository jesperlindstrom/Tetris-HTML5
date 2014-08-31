module Game {
	export class Blocks {
		private static assets: any = {};
		private static grid = [];
		private static currentBlock = {
			color: 'green',
			coordinates: []
		};

		/**
		 * Preload any game assets
		 */
		public static preload() {
			Game.config.blockColors.forEach(name => {
				Core.Assets.queue('block_' + name, 'block_' + name + '.png');
			});
		}

		/**
		 * Start the game logic
		 */
		public static initialize() {
			// Load assets
			Game.config.blockColors.forEach(name => {
				this.assets[name] = Core.Assets.get('block_' + name);
			});

			// Set up grid
			this.prepareGrid(Game.config.grid.width, Game.config.grid.height);
		
			console.log(this.grid);

			// Delegate loop update
			Game.loop.onUpdate((rate) => {
				this.update(rate);
				this.render();
			});
		}

		/**
		 * Set up the grid at a specific size
		 * @param Number width
		 * @param Number height
		 */
		private static prepareGrid(width: number, height: number) {
			for (var x = 0; x < width; x++) {
				this.grid[x] = [];

				for (var y = 0; y < height; y++) {
					this.grid[x][y] = null;
				}
			}
		}

		/**
		 * Update the game logic
		 * @param Number rate
		 */
		private static update(rate: number) {

		}

		/**
		 * Draw the game based on the game state
		 */
		private static render() {

		}

		/**
		 * Rotate a set of coordinates in 90 deg steps
		 * @param Array formation
		 * @param Number turns
		 * @return Array newFormation
		 */
		private static rotate(formation, turns: number = 1) {
			// Perform the operation a certain number of times
			for (var i = 0; i < turns; i++) {
				// Loop through the set of coordinates
				formation.forEach(c => {
					// Rotate 90 deg according to (x, y) -> (-y, x)
					var tempX: number = c[0];
					c[0] = -c[1];
					c[1] = tempX;

					// Replace -0 by 0 for clarity
					if (c[0] === -0) c[0] = 0;
					if (c[1] === -0) c[1] = 0;
				});
			}

			return formation;
		}
	}
}