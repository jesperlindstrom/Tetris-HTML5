module Core {
	interface PreloadCall {
		(next): void;
	}

	export class Assets {
		private static cache: any = {};
		private static preloadMethods: PreloadCall[] = [];
		private static screenDensity = '1x';

		/**
		 * Queue an asset to be preloaded and cached
		 * @param String name
		 * @param String filename
		 */
		public static queue(name: string, filename: string) {
			this.preloadMethods.push((next) => {
				var asset: HTMLImageElement = new Image();

				// Handle success
				asset.onload = () => {
					Core.Log.info('Loaded asset "' + filename + '" (@' + this.screenDensity + ') as "' + name + '"', 'Core/Assets');
					this.cache[name] = asset;
					next();
				};

				// Handle error
				asset.onerror = () => {
					Core.Log.error('Asset "' + filename + '" (@' + this.screenDensity + ') could not be loaded', 'Core/Assets');
					next();
				};

				asset.src = Game.config.assetsPath + this.screenDensity + '/' + filename;
			});
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

		/**
		 * Preload all queued assets
		 * @param Function callback()
		 */
		public static preload(callback: () => void) {
			var assetCount = this.preloadMethods.length;

			// Retina support
			if (window.devicePixelRatio == 2) {
				this.screenDensity = '2x';
			}

			// No assets to load, proceed
			if (!assetCount) {
				callback();
				return;
			}

			var loadedCount: number = 0;

			// Run all asset preload methods
			this.preloadMethods.forEach(preloadMethod => {
				preloadMethod(() => {
					loadedCount++;

					// Are all assets loaded?
					if (loadedCount == assetCount) callback();
				});
			});
		}
	}
}