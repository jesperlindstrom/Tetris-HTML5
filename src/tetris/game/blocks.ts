module Game {
	export class Blocks {
		public static preload() {
			Core.Assets.queue('block_purple', 'assets/block_purple.png');
		}

		public static initialize() {
			var block = Core.Assets.get('block_purple');

			Game.loop.onUpdate((rate) => {
				
			});
		}
	}
}