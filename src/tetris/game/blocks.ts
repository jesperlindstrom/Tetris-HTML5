    module Game {
	export class Blocks {
		private static assets: any = {};
		private static grid = [];
		private static redraw: boolean = true;
		private static lastFrameTime: number = 0;
		private static currentBlock = {
			color: '',
			coordinates: []
		};
		private static nextBlock = {
			color: '',
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

			// Generate initial block
			this.queueNextBlock();

			// Input: move left
			Core.Input.on('left', () => {
				this.moveSide(-1);
			});

			// Input: move right
			Core.Input.on('right', () => {
				this.moveSide(1);
			});

			// Delegate loop update
			Game.loop.onUpdate((rate) => {
				this.update(rate);
				this.render();
			});
		}

		/**
		 * Move the current block to the side
		 * @param Number deltaX
		 */
		private static moveSide(deltaX: number) {
			// Move to the side if requested and it's possible
			if (this.canMoveSide(deltaX)) {
				this.currentBlock.coordinates.forEach((point) => {
					point[0] += deltaX;
				});
			}

			this.redraw = true;
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
			
			// Update last frame time
			this.lastFrameTime = new Date().getTime();

			// Spawn new blocks if none are falling
			if (!this.currentBlock.coordinates.length) {
				this.spawnBlocks();
				return;
			}

			// Move down if we can
			if (this.canMoveDown()) {
				this.currentBlock.coordinates.forEach((point) => {
					point[1]++;
				});
			} else {
				// Place the current block on the grid
				this.placeCurrentBlock();
			}

			this.redraw = true;
		}

		/**
		 * Check if the current blocks can fall down by one block
		 * @return Boolean
		 */
		private static canMoveDown(): boolean {
			var x: number, y: number;

			for (var point in this.currentBlock.coordinates) {
				x = this.currentBlock.coordinates[point][0];
				y = this.currentBlock.coordinates[point][1];

				if (Core.Collision.test(this.grid, { x: x, y: y + 1 }) || Core.Collision.testBounds({x: x, y: y + 1 })) {
					Core.Log.info('Collided at (' + x + '; ' + (y + 1) + ')', 'Game/Blocks');
					return false;
				}
			}

			return true;
		}

		/**
		 * Check if the current blocks can move to the requested side
		 * @param Number deltaX
		 * @return Boolean
		 */
		private static canMoveSide(deltaX: number): boolean {
			var x: number, y: number;

			for (var point in this.currentBlock.coordinates) {
				x = this.currentBlock.coordinates[point][0];
				y = this.currentBlock.coordinates[point][1];

				if (Core.Collision.test(this.grid, { x: x + deltaX, y: y }) || Core.Collision.testBounds({x: x + deltaX, y: y })) {
					Core.Log.info('Failed to move to side (' + (x + deltaX) + '; ' + y + ')', 'Game/Blocks');
					return false;
				}
			}

			return true;
		}

		/**
		 * Place the current block
		 */
		private static placeCurrentBlock() {
			// Copy the blocks to the grid
			this.currentBlock.coordinates.forEach((point) => {
				this.grid[point[0]][point[1]] = this.currentBlock.color;
			});
		
			// Trigger a new block to spawn
			this.currentBlock.color = '';
			this.currentBlock.coordinates = [];
		}

		/**
		 * Spawn a new set of user controllable blocks
		 */
		private static spawnBlocks() {
			Core.Log.info('Spawning new blocks (' + this.nextBlock.color + ')', 'Game/Blocks');

			this.currentBlock.color = Core.Utils.copy(this.nextBlock.color);
			var formation = Core.Utils.copy(this.nextBlock.coordinates);
			this.currentBlock.coordinates = Core.Utils.centerHorizontally(formation);

			// Check for collisions
			var x: number, y: number;

			for (var point in this.currentBlock.coordinates) {
				x = this.currentBlock.coordinates[point][0];
				y = this.currentBlock.coordinates[point][1];

				if (Core.Collision.test(this.grid, { x: x, y: y })) {
					Core.Log.info('Spawn-collided at (' + x + '; ' + (y + 1) + ')', 'Game/Blocks');
					Game.UI.lose();
					return;
				}
			}

			this.redraw = true;
			this.queueNextBlock();
		}

		/**
		 * Queue a new block
		 */
		private static queueNextBlock() {
			this.nextBlock.color = Core.Utils.randomItem(Game.config.blockColors);
			this.nextBlock.coordinates = Core.Utils.copy(Game.config.blockFormations[this.nextBlock.color]);

			// Update UI
			Game.UI.setNextBlock(this.nextBlock.color, this.nextBlock.coordinates);
		}

		/**
		 * Draw the game based on the game state
		 */
		private static render() {
			if (!Game.layers.game.isCleared && !this.redraw) return;

			// Draw grid
			for (var x in this.grid) {
				for (var y in this.grid[x]) {
					if (this.grid[x][y] && this.assets[this.grid[x][y]]) {
						this.drawBlock(this.grid[x][y], x, y);
					}
				}
			}

			// Draw user blocks
			this.currentBlock.coordinates.forEach((block) => {
				if (!this.assets[this.currentBlock.color]) return;

				this.drawBlock(this.currentBlock.color, block[0], block[1]);
			});

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