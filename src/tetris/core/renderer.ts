module Core {
	interface RenderCall {
		(CanvasRenderingContext2D): void;
	}

	export class Renderer {
		public name: string;
		public width: number;
		public height: number;
		public layerZ: number;
		public isCleared: boolean = true;
		private background: string;
		private canvas: HTMLCanvasElement;
		private context: CanvasRenderingContext2D;
		private renderQueue: Array<RenderCall> = [];

		/**
		 * Initialize a renderer object
		 * @param String name
		 * @param Number width
		 * @param Number height
		 * @param Number layerZ
		 */
		constructor(name: string, width: number, height: number, layerZ: number = 1, background?: string) {
			this.name = name;
			this.width = width;
			this.height = height;
			this.layerZ	= layerZ;
			this.background = background;

			Core.Log.info('Created renderer "' + this.name + '" (' + this.width + 'x' + this.height + ', layer: ' + this.layerZ + ')', 'Core/Renderer');

			this.createCanvas();
		}

		/**
		 * Create a canvas element
		 */
		private createCanvas() {
			// Create element
			this.canvas = document.createElement('canvas');

			// Set properties
			this.canvas.width = this.width;
			this.canvas.height = this.height;
			this.canvas.style.zIndex = this.layerZ.toString();
			this.canvas.style.position = 'absolute';

			if (this.background) {
				this.canvas.style.background = this.background;
			}

			// Store a reference to the 2D context 
			this.context = this.canvas.getContext('2d');

			// Display the element
			document.body.appendChild(this.canvas);
		}

		/**
		 * Clear the canvas
		 */
		public clear() {
			this.context.clearRect(0, 0, this.width, this.height);
			this.isCleared = true;
		}

		/**
		 * Draw some graphics to the canvas (adds to render queue)
		 * @param Function method(context)
		 */
		public draw(method: (CanvasRenderingContext2D) => void) {
			this.renderQueue.push(method);
		}

		/**
		 * Run all render queue methods
		 */
		public render() {
			// Only run if there's something new to draw
			if (!this.renderQueue.length) return;

			// Clear the canvas
			this.clear();

			// Run all the queued render methods
			this.renderQueue.forEach(renderMethod => {
				renderMethod(this.context);
			});

			// Reset render queue
			this.renderQueue = [];
			this.isCleared = false;
		}
	}
};