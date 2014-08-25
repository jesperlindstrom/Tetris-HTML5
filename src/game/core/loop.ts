module Core {
	interface UpdateCall {
		(number): void;
	}

	export class Loop {
		public isRunning: boolean = true;
		private updateCalls: Array<UpdateCall> = [];

		public start() {
			this.isRunning = true;
			this.tick(0);
		}

		public stop() {
			this.isRunning = false;
		}

		private tick(time: number) {
			console.log(time);
			console.log(this);
			// todo: wrong scope!

			if (this.updateCalls.length) {
				this.updateCalls.forEach(method => {
					method(time);
				});
			}

			if (this.isRunning) {
				window.requestAnimationFrame(this.tick);
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