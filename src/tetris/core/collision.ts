module Core {
	export class Collision {
		/**
		 * Test if a spot in the grid is free
		 * @param Array grid
		 * @param Array coordinates
		 */
		public static test(grid, coordinates) {
			if (grid[coordinates.x] && grid[coordinates.y]) {
				return true;
			}

			return false;
		}
	}
}