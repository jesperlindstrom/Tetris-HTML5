module Core {
	export class Utils {
		/**
		 * Translate a block coordinate to the grid coordinate
		 * @param Number x
		 * @return Number
		 */
		public static translate(x: number): number {
			return x * Game.config.grid.size + 20;
		}

		/**
		 * Get a random number between two numbers
		 * @param Number min
		 * @param Number max
		 * @return Number
		 */
		public static random(min: number, max: number): number {
			return Math.floor(Math.random() * (max - min + 1) + min);
		}

		/**
		 * Get a random item from an array
		 * @param Array stack
		 * @return Any
		 */
		public static randomItem(stack: any[]) {
			var max: number = stack.length - 1;
			var index: number = Utils.random(0, max);

			return stack[index];
		}
	}
}