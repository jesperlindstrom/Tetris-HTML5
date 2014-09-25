module Game {
	export class Blocks {
		private static assets: any = {};
		private static grid = [];
		private static redraw: boolean = true;
		private static lastFrameTime: number = 0;
		private static currentBlock = {
			color: '',
			coordinates: [],
			rotation: 0
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

			// Input: move down
			Core.Input.on('down', () => {
				this.fallUntilCollision();

				// Hard drop: 2 x number of blocks
				Game.UI.updateStats('score', 2 * this.currentBlock.coordinates.length);

				this.placeCurrentBlock();
				this.detectFullLines();
			});

			// Input: rotate
			Core.Input.on('up', () => {
				this.currentBlock.rotation++;

				var baseCoordinates = Core.Utils.copy(Game.config.blockFormations[this.currentBlock.color]);
				baseCoordinates = this.rotate(baseCoordinates, this.currentBlock.rotation);

				var deltaX: number = this.currentBlock.coordinates[0][0];
				var deltaY: number = this.currentBlock.coordinates[0][1];

				var canRotate: boolean = true;

				baseCoordinates.forEach(point => {
					point[0] += deltaX;
					point[1] += deltaY;

					if (Core.Collision.test(this.grid, { x: point[0], y: point[1] }) || Core.Collision.testBounds({ x: point[0], y: point[1] })) {
						Core.Log.info('Failed to rotate ' + (this.currentBlock.rotation * 90) + 'deg (' + (point[0]) + '; ' + point[1] + ')', 'Game/Blocks');
						canRotate = false;
					}
				});

				if (!canRotate) {
					this.currentBlock.rotation--;
					return;
				}

				this.currentBlock.coordinates = baseCoordinates;
				this.redraw = true;
			});

			// Delegate loop update
			Game.loop.onUpdate((rate) => {
				this.update(rate);
				this.render();
			});
		}

		/**
		 * Restart game
		 */
		public static reset() {
			// Set up grid
			this.prepareGrid(Game.config.grid.width, Game.config.grid.height);

			// Generate initial block
			this.queueNextBlock();
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
				// Soft drop: 1 x number of blocks
				Game.UI.updateStats('score', this.currentBlock.coordinates.length);

				// Place the current block on the grid
				this.placeCurrentBlock();

				// Are any of the rows full?
				this.detectFullLines();
			}

			this.redraw = true;
		}

		/**
		 * Detect full lines and clear them for score
		 */
		private static detectFullLines() {
			console.log('Checking for full lines');

			var row = Game.config.grid.height - 1;

			// Loop rows
			while (row >= 0) {
				var cleared: boolean = true;

				// Loop through every block in the row
				for (var x = 0; x < Game.config.grid.width; x++) {
					if (!this.grid[x][row]) {
						cleared = false;
					}
				}

				if (cleared) {
					this.clearLine(row);
					break;
				}

				row--;
			}
		}

		/**
		 * Clear a line
		 * @param Number y
		 */
		private static clearLine(y: number) {
			// Clear line
			for (var x in this.grid) {
				this.grid[x][y] = null;
			}

			// Update score
			Game.UI.updateStats('lines');
			Game.UI.updateStats('score', 100); // TODO: special score for multi-line etc?

			while (y--) {
				for (var x in this.grid) {
					if (this.grid[x][y]) {
						console.log('Moving (' + x + '; ' + y + ') to (' + x + '; ' + (y + 1) + ')');
						this.grid[x][y + 1] = this.grid[x][y];
						this.grid[x][y] = null;
					}
				}
			}

			// Detect new full lines after applying gravity
			this.detectFullLines();
		}

		/**
		 * Make the current block fall until it collides
		 */
		private static fallUntilCollision() {
			while (this.canMoveDown()) {
				this.currentBlock.coordinates.forEach((point) => {
					point[1]++;
				});
			}
		}

		/**
		 * Check if the current blocks can fall down by one block
		 * @param Object blocks
		 * @return Boolean
		 */
		private static canMoveDown(blocks: any = []): boolean {
			var x: number, y: number;

			if (!blocks.length) {
				blocks = this.currentBlock.coordinates;
			}

			for (var point in blocks) {
				x = blocks[point][0];
				y = blocks[point][1];

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
			this.currentBlock.rotation = 0;

			this.redraw = true;
		}

		/**
		 * Spawn a new set of user controllable blocks
		 */
		private static spawnBlocks() {
			Core.Log.info('Spawning new blocks (' + this.nextBlock.color + ')', 'Game/Blocks');

			this.currentBlock.color = Core.Utils.copy(this.nextBlock.color);
			var formation = Core.Utils.copy(this.nextBlock.coordinates);
			this.currentBlock.coordinates = Core.Utils.centerHorizontally(formation);
			this.currentBlock.rotation = 0;

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
			var formationCopy = Core.Utils.copy(formation);

			// Perform the operation a certain number of times
			for (var i = 0; i < turns; i++) {
				// Loop through the set of coordinates
				formationCopy.forEach(c => {
					// Rotate 90 deg according to (x, y) -> (-y, x)
					var tempX: number = c[0];
					c[0] = -c[1];
					c[1] = tempX;

					// Replace -0 by 0 for clarity
					if (c[0] === -0) c[0] = 0;
					if (c[1] === -0) c[1] = 0;
				});
			}

			return formationCopy;
		}
	}
}