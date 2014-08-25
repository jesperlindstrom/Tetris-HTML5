module Core {
	export class Assets {
		private static cache: any = {};

		/**
		 * Load and cache an asset file
		 * @param String name
		 * @param String filename
		 * @param Function callback(any)
		 */
		public static load(name: string, filename: string, callback?: (any) => void) {
			var asset: HTMLImageElement = new Image();

			// Handle success
			asset.onload = () => {
				Core.Log.info('Loaded asset "' + filename + '" as "' + name + '"', 'Core/Assets');

				this.cache[name] = asset;

				if (typeof callback == 'function') {
					callback(this.cache[name]);
				}
			};

			// Handle error
			asset.onerror = () => {
				Core.Log.error('Asset "' + filename + '" could not be loaded', 'Core/Assets');

				if (typeof callback == 'function') {
					callback(false);
				}
			};

			asset.src = filename;
		}

		/**
		 * Get a cached asset
		 * @param String name
		 * @return HTMLImageElement / Boolean
		 */
		public static get(name: string) {
			if (!this.cache[name]) return false;

			return this.cache[name];
		}
	}
}