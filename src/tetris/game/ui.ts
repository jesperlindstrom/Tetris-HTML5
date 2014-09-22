module Game {
	interface PlayerScore {
		lines: number;
		score: number;
	}

	export class UI {
		private static backgroundImage: HTMLImageElement;
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
			Game.layers.background.draw(context => {
				// Draw background UI
				context.drawImage(this.backgroundImage, 0, 0, 590, 600);

				// Set text style
				context.font = 'bold 40px sans-serif';
				context.fillStyle = '#111111';
				context.textAlign = 'center';

				// Draw score
				context.fillText(this.score.score, 515, 210);

				// Draw lines
				context.fillText(this.score.lines, 515, 335);

				// Draw next blocks if the asset exists
				var nextBlockColor = Core.Assets.get('block_' + this.nextBlock.color);

				if (nextBlockColor) {
					this.nextBlock.coordinates.forEach((block) => {
						var x = block[0] * 20 + 480;
						var y = block[1] * 20 + 60;

						context.drawImage(nextBlockColor, x, y, 20, 20);
					});
				}
				
				this.redraw = false;
			});
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
			Core.Log.info('Player lost');
			Game.loop.kill();
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