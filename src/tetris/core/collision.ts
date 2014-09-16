module Core {
	export class Collision {
		/**
		 * Test if a spot in the grid is free
		 * @param Array grid
		 * @param Object point{x,y}
		 * @return Boolean
		 */
		public static test(grid, point): boolean {
			return grid[point.x] && grid[point.x][point.y];
		}

		/**
		 * Test if a point is out of the grid
		 * @param Object point{x,y}
		 * @return Boolean
		 */
		public static testBounds(point): boolean {
			// Outside of the grid on x-axis
			if (point.x < 0 || point.x > Game.config.grid.width-1) {
				return true;
			}

			// Outside of the grid on y-axis
			if (point.y < 0 || point.y > Game.config.grid.height-1) {
				return true;
			}

			return false;
		}
	}
}