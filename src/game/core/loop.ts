module Core {
	interface UpdateCall {
		(number): void;
	}

	export class Loop {
		public isRunning: boolean = true;
		private updateCalls: Array<UpdateCall> = [];
		private lastFrame: number = 0.0;
		private FPS: number = 0;

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
		}

		/**
		 * Run the next tick of the loop
		 * @param Number time
		 */
		private tick(time: number) {
			var delta: number = time - this.lastFrame; // 60 FPS ≈ 16.6667

			this.FPS = Math.round(1 / delta * 1000);
			this.lastFrame = time;

			if (this.updateCalls.length) {
				this.updateCalls.forEach(method => {
					method(time);
				});
			}

			if (this.isRunning) {
				window.requestAnimationFrame((time) => {
					this.tick.apply(this, [time]);
				});
			}
		}

		/**
		 * Add game logic to be run on each frame
		 * @param Function method(number)
		 */
		public onUpdate(method: (number) => void) {
			this.updateCalls.push(method);
		}
	}
}