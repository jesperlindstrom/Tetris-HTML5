module Core {
	interface UpdateCall {
		(number): void;
	}

	export class Loop {
		public isRunning: boolean = true;
		public isKilled: boolean = false;
		public FPS: number = 0;
		public rate: number = 0.0;
		private updateCalls: Array<UpdateCall> = [];
		private lastUpdateCalls: Array<UpdateCall> = [];
		private lastFrame: number = 0.0;

		constructor() {
			Core.Log.info('Created loop', 'Core/Loop');

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
			Core.Log.info('Started loop', 'Core/Loop');
			this.isRunning = true;
			this.tick(0);
		}

		/**
		 * Pause the loop
		 */
		public stop() {
			Core.Log.info('Stopped loop', 'Core/Loop');
			this.isRunning = false;
			this.rate = 0;
			this.lastFrame = 0;
		}

		/** 
	  	 * Stop the loop forever
		 */
		public kill() {
			Core.Log.info('Killed loop', 'Core/Loop');
			this.isRunning = false;
			this.isKilled = true;
			this.rate = 0;
			this.lastFrame = 0;
		}

		/**
		 * Restart the loop
		 */
		public revive() {
			Core.Log.info('Revived loop', 'Core/Loop');
			this.isKilled = false;
			this.start();
		}

		/**
		 * Run the next tick of the loop
		 * @param Number time
		 */
		private tick(time: number) {
			if (this.isKilled) return;
			
			if (this.lastFrame && time) {
				var delta: number = time - this.lastFrame; // 60 FPS ≈ 16.6667

				this.rate = Math.round(delta / 16.67 * 100) / 100;
				this.FPS = Math.round(1 / delta * 1000);
			} else {
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

			// Run all last update calls
			if (this.lastUpdateCalls.length) {
				this.lastUpdateCalls.forEach(method => {
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
		 * Add game logic to be run on as last call for each frame
		 * @param Function method(number)
		 * @return Number
		 */
		public onUpdateLast(method: (number) => void): number {
			return this.lastUpdateCalls.push(method);
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