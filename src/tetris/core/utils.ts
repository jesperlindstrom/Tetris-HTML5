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
	}
}