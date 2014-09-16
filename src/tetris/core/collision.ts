module Core {
	export class Collision {
		/**
		 * Test if a spot in the grid is free
		 * @param Array grid
		 * @param Array coordinates
		 */
		public static test(grid, coordinates) {
			return grid[coordinates.x] && grid[coordinates.y];
		}
	}
}