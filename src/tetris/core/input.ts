module Core {
	export class Input {
		private static listeners: any = {};

		/**
		 * Listen for a certain keypress
		 * @param String[] keys
		 * @param Function method()
		 */
		public static on(keys: string[], method: () => void) {
			keys.forEach((keyName) => {
				var keyCode: number = InputKeys[keyName];

				// Make sure the key is defined
				if (!keyCode) {
					Core.Log.error('Core.InputKeys does not contain ' + keyName, 'Core/Input');
					return;
				}

				Core.Log.info('Added input listener for ' + keyName + ' (' + keyCode + ')', 'Core/Input');

				if (!Input.listeners[keyCode]) {
					Input.listeners[keyCode] = [];
				}

				// Add event listener
				Input.listeners[keyCode].push(method);
			});
		}

		/**
		 * Delegate keypress events
		 * @param Event e
		 */
		public static onKeyDown(e) {
			if (!Input.listeners[e.keyCode]) return;
		
			// Call all listeners
			Input.listeners[e.keyCode].forEach(method => {
				method();
			});
		}
	}

	window.onkeydown = Input.onKeyDown;

	enum InputKeys {
		left = 37,
		up = 38,
		right = 39,
		down = 40,
		w = 87,
		a = 65,
		s = 83,
		d = 68
	};
}