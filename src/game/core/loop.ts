module Core {
	interface UpdateCall {
		(number): void;
	}

	export class Loop {
		public isRunning: boolean = true;
		public FPS: number = 0;
		public rate: number = 0.0;
		private updateCalls: Array<UpdateCall> = [];
		private lastFrame: number = 0.0;

		constructor() {
			// Pause when the window is unfocused
			window.onblur = (e) => {
				this.stop();
			};

			// Start when the window is focused again
			window.onfocus = (e) => {
				if (!this.isRunning) {
					this.start();
				}
			};
		}

		/**
		 * Start the loop
		 */
		public start() {
			this.isRunning = true;
			this.tick(0);
		}

		/**
		 * Pause the loop
		 */
		public stop() {
			this.isRunning = false;
			this.rate = 0;
			this.lastFrame = 0;
		}

		/**
		 * Run the next tick of the loop
		 * @param Number time
		 */
		private tick(time: number) {
			if (this.lastFrame && time) {
				var delta: number = time - this.lastFrame; // 60 FPS ≈ 16.6667

				this.rate = Math.round(delta / 16.67 * 100) / 100;
				this.FPS = Math.round(1 / delta * 1000);
			} else {
				Core.Log.info('Skipped a frame', 'Core/Loop');
				this.rate = 0;
				this.FPS = 0;
			}

			this.lastFrame = time;

			// Run all update calls
			if (this.updateCalls.length) {
				this.updateCalls.forEach(method => {
					if (typeof method == 'function') {
						method(this.rate);
					}
				});
			}

			// Request the next frame
			if (this.isRunning) {
				window.requestAnimationFrame(time => {
					this.tick.apply(this, [time]);
				});
			}
		}

		/**
		 * Add game logic to be run on each frame
		 * @param Function method(number)
		 * @return Number
		 */
		public onUpdate(method: (number) => void): number {
			return this.updateCalls.push(method);
		}

		/**
		 * Remove update call by array index
		 * @param Number index
		 * @return Boolean
		 */
		public removeUpdateCall(index: number): boolean {
			index--;
			
			if (!this.updateCalls[index]) return false;

			this.updateCalls[index] = null;

			return true;
		}
	}
}