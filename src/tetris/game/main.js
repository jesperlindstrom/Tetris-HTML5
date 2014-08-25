var Game;
(function (Game) {
    Game.config = {
        logLevel: 0 /* Info */
    };

    Game.layers = {};
    Game.loop;

    function start() {
        Core.Log.info('Initialized game', 'Game/Main');

        Game.layers.background = new Core.Renderer('background', 800, 480, 1, '#000');
        Game.layers.game = new Core.Renderer('game', 800, 480, 2);

        Game.loop = new Core.Loop();

        Game.UI.initialize();
        Game.Blocks.initialize();
        Game.Player.initialize();

        Core.Assets.onPreload(Game.loop.start);
    }
    Game.start = start;

    window.onload = Game.start;
})(Game || (Game = {}));
//# sourceMappingURL=main.js.map
