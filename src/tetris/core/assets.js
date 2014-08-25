var Core;
(function (Core) {
    var Assets = (function () {
        function Assets() {
        }
        Assets.preload = function (name, filename, callback) {
            var _this = this;
            var asset = new Image();

            asset.onload = function () {
                Core.Log.info('Loaded asset "' + filename + '" as "' + name + '"', 'Core/Assets');

                _this.cache[name] = asset;

                if (typeof callback == 'function') {
                    callback(_this.cache[name]);
                }
            };

            asset.onerror = function () {
                Core.Log.error('Asset "' + filename + '" could not be loaded', 'Core/Assets');

                if (typeof callback == 'function') {
                    callback(false);
                }
            };

            asset.src = filename;
        };

        Assets.get = function (name) {
            if (!this.cache[name])
                return false;

            return this.cache[name];
        };

        Assets.onPreload = function (callback) {
        };
        Assets.cache = {};
        return Assets;
    })();
    Core.Assets = Assets;
})(Core || (Core = {}));
//# sourceMappingURL=assets.js.map
