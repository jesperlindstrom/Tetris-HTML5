module Core {
	export class Debug {
		private static total: number = 0;
		private static count: number = 0;
		private static updateRate: number = 1000;
		private static loop: Core.Loop;
		private static FPSElement: HTMLElement;

		/** 
		 * Show the debug tools
		 * @param Core.Loop loop
		 */
		public static initialize(loop: Core.Loop) {
			this.loop = loop;

			// Create element
			this.createFPSElement();

			this.loop.onUpdate((rate) => {
				this.update();
			});

			setInterval(() => {
				this.render();
			}, this.updateRate);
		}

		/**
		 * Create and place DOM element for FPS
		 */
		private static createFPSElement() {
			this.FPSElement = document.createElement('div');
			this.FPSElement.id = 'FPS';
			document.body.appendChild(this.FPSElement);
		}

		/**
		 * Handle loop update
		 */
		private static update() {
			this.total += this.loop.FPS;
			this.count++;
		}

		/**
		 * Update FPS count visually
		 */
		private static render() {
			var average: number = 0;

			// Calculate average
			if (this.count != 0) {
				average = Math.round(this.total / this.count);
			}

			// Update text
			this.FPSElement.innerHTML = average + ' FPS';

			// Reset
			this.count = 0;
			this.total = 0;
		}
	}
}