module Game {
	interface PlayerScore {
		lines: number;
		score: number;
	}

	export class UI {
		private static backgroundImage: HTMLImageElement;
		private static scoreValue;
		private static linesValue;
		private static nextBlockCanvas: Core.Renderer;
		private static redraw: boolean = true;
		private static score: PlayerScore = {
			lines: 0,
			score: 0
		};
		private static nextBlock = {
			color: '',
			coordinates: []
		}

		/**
		 * Preload UI assets
		 */
		public static preload() {
			Core.Assets.queue('background', 'background.png');
		}
		
		/** 
		 * Initialize the game UI
		 */
		public static initialize() {
			this.backgroundImage = Core.Assets.get('background');
			this.scoreValue = document.getElementById('score-value');
			this.linesValue = document.getElementById('lines-value');

			var nextBlockCanvas = document.getElementById('next-canvas');
			this.nextBlockCanvas = new Core.Renderer('NextBlock', 80, 40, 0, '', nextBlockCanvas);

			Game.loop.onUpdate((rate) => {
				// Only redraw when we need to
				if (!Game.layers.background.isCleared && !this.redraw) return;
				
				Core.Log.info('Updating UI', 'Game/UI');

				this.render();
			});
		}

		/**
		 * Render the game UI
		 */
		private static render() {
			// Draw score
			if (this.score.score != this.scoreValue.innerHTML) {
				this.scoreValue.innerHTML = this.score.score;
			}

			// Draw lines
			if (this.score.lines != this.linesValue.innerHTML) {
				this.linesValue.innerHTML = this.score.lines;
			}

			this.nextBlockCanvas.draw(context => {
				// Draw next blocks if the asset exists
				var nextBlockColor = Core.Assets.get('block_' + this.nextBlock.color);

				if (nextBlockColor) {
					var maxX = this.nextBlock.coordinates[this.nextBlock.coordinates.length - 1][0];

					// y= -0.5x + 1.5
					var deltaX = -0.5*maxX + 1.5;

					this.nextBlock.coordinates.forEach((block) => {
						var x = block[0] * 20 + deltaX * 20;
						var y = block[1] * 20;

						context.drawImage(nextBlockColor, x, y, 20, 20);
					});
				}
			});

			this.nextBlockCanvas.render();

			Game.layers.background.draw(context => {
				// Draw background UI
				context.drawImage(this.backgroundImage, 0, 0, 590, 600);
			});

			this.redraw = false;
		}

		/**
		 * Update the stats (score/lines)
		 * @param String key
		 * @param Number amount
		 */
		public static updateStats(key: string, amount: number = 1) {
			if (typeof this.score[key] == 'undefined') return;

			this.score[key] += amount;
			this.redraw = true;
		}

		/**
		 * Make the player lose
		 */
		public static lose() {
			Core.Log.info('Player lost', 'Game/UI');
			Game.loop.kill();

			var loseMessage = document.createElement('div');
			loseMessage.innerHTML = 'You lost! Click to restart';
			loseMessage.id = 'lost-message';

			loseMessage.onclick = () => {
				// Reset game
				this.score.lines = 0;
				this.score.score = 0;
				this.nextBlock.color = '';
				this.nextBlock.coordinates = [];
				Game.Blocks.reset();
				Game.loop.revive();

				document.body.removeChild(loseMessage);
			};

			document.body.appendChild(loseMessage);
		}

		/**
		 * Update the next block viewer
		 * @param String color
		 * @param Array formation
		 */
		public static setNextBlock(color, formation) {
			this.nextBlock.color = color;
			this.nextBlock.coordinates = formation;

			this.redraw = true;
		}
	}
}