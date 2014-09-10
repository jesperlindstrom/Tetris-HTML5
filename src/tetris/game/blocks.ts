module Game {
	export class Blocks {
		private static assets: any = {};
		private static grid = [];
		private static redraw: boolean = true;
		private static lastFrameTime: number = 0;
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
			// Skip frame if less than a specific time has passed
			if (new Date().getTime() - this.lastFrameTime < Game.config.rate) return;

			// Spawn new blocks if none are falling
			if (!this.currentBlock.coordinates.length) {
				this.spawnBlocks();
				return;
			}

			// How to draw blocks:
			// change this.grid values
			// this.redraw = true;

			this.lastFrameTime = new Date().getTime();
		}

		/**
		 * Spawn a new set of user controllable blocks
		 */
		private static spawnBlocks() {
			//var color: string = Game.config.blockColors[]
		}

		/**
		 * Draw the game based on the game state
		 */
		private static render() {
			if (!Game.layers.game.isCleared && !this.redraw) return;

			for (var x in this.grid) {
				for (var y in this.grid[x]) {
					if (this.grid[x][y] && this.assets[this.grid[x][y]]) {
						this.drawBlock(this.grid[x][y], x, y);
					}
				}
			}

			this.redraw = false;
		}

		/**
		 * Queue a draw call of the block
		 * @param String color
		 * @param Number x
		 * @param Number y
		 */
		private static drawBlock(color: string, x: number, y: number) {
			var size: number = Game.config.grid.size;
			x = Core.Utils.translate(x);
			y = Core.Utils.translate(y);

			Game.layers.game.draw(context => {
				context.drawImage(this.assets[color], x, y, size, size);
			});
		}

		/**,
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