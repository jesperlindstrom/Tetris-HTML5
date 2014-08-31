module Game {
	interface PlayerScore {
		lines: number,
		score: number
	}

	export class UI {
		private static redraw: boolean = true;
		private static score: PlayerScore = {
			lines: 0,
			score: 0
		};

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
			Game.layers.background.draw(context => {
				// Only redraw when we need to
				if (!Game.layers.background.isCleared && !this.redraw) return;
			});
		}
	}
}