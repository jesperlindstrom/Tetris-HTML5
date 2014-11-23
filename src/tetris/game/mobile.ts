/// <reference path="../../lib/hammerjs.d.ts" />

module Game {
	export class Mobile {
		private static touchListener;

		public static initialize() {
			Core.Log.info('Initializing mobile interface', 'Game/Mobile');

			Mobile.touchListener = Hammer(document.body, {
				recognizers: [
					[ Hammer.Swipe ]
				]
			});

			// Map swipe touch events to keys
			Mobile.onTouch('swipeup', InputKeys.up);
			Mobile.onTouch('swipedown', InputKeys.down);
			Mobile.onTouch('swipeleft', InputKeys.left);
			Mobile.onTouch('swiperight', InputKeys.right);
		}

		/**
		 * Map touch events to key events
		 * @param String eventName
		 * @param Number keyCode
		 */
		private static onTouch(eventName: string, keyCode: number) {
			Core.Log.info('Mapped "' + eventName + '" as keycode ' + keyCode, 'Game/Mobile');

			Mobile.touchListener.on(eventName, function(e) {
				Core.Input.onKeyDown({
					keyCode: keyCode
				});
			});
		}
	}

	enum InputKeys {
		left = 37,
		up = 38,
		right = 39,
		down = 40
	};
}