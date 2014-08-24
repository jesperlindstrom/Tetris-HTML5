module Core {
	export class Renderer {
		public name: string;
		public width: number;
		public height: number;
		public layerZ: number;
		private canvas: HTMLCanvasElement;
		private context: CanvasRenderingContext2D;

		/**
		 * Initialized a renderer object
		 * @param String name
		 * @param Number width
		 * @param Number height
		 * @param Number layerZ
		 */
		constructor(name: string, width: number, height: number, layerZ: number = 1) {
			this.name = name;
			this.width = width;
			this.height = height;
			this.layerZ	= layerZ;

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

			// Store a reference to the 2D context 
			this.context = this.canvas.getContext('2d');

			// Display the element
			document.body.appendChild(this.canvas);
		}
	}
};