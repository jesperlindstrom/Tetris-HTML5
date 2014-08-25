var Core;
(function (Core) {
    var Loop = (function () {
        function Loop() {
            var _this = this;
            this.isRunning = true;
            this.FPS = 0;
            this.rate = 0.0;
            this.updateCalls = [];
            this.lastFrame = 0.0;
            Core.Log.info('Created loop', 'Core/Loop');

            window.onblur = function (e) {
                _this.stop();
            };

            window.onfocus = function (e) {
                if (!_this.isRunning) {
                    _this.start();
                }
            };
        }
        Loop.prototype.start = function () {
            Core.Log.info('Started loop', 'Core/Loop');
            this.isRunning = true;
            this.tick(0);
        };

        Loop.prototype.stop = function () {
            Core.Log.info('Stopped loop', 'Core/Loop');
            this.isRunning = false;
            this.rate = 0;
            this.lastFrame = 0;
        };

        Loop.prototype.tick = function (time) {
            var _this = this;
            if (this.lastFrame && time) {
                var delta = time - this.lastFrame;

                this.rate = Math.round(delta / 16.67 * 100) / 100;
                this.FPS = Math.round(1 / delta * 1000);
            } else {
                this.rate = 0;
                this.FPS = 0;
            }

            this.lastFrame = time;

            if (this.updateCalls.length) {
                this.updateCalls.forEach(function (method) {
                    if (typeof method == 'function') {
                        method(_this.rate);
                    }
                });
            }

            if (this.isRunning) {
                window.requestAnimationFrame(function (time) {
                    _this.tick.apply(_this, [time]);
                });
            }
        };

        Loop.prototype.onUpdate = function (method) {
            return this.updateCalls.push(method);
        };

        Loop.prototype.removeUpdateCall = function (index) {
            index--;

            if (!this.updateCalls[index])
                return false;

            this.updateCalls[index] = null;

            return true;
        };
        return Loop;
    })();
    Core.Loop = Loop;
})(Core || (Core = {}));
//# sourceMappingURL=loop.js.map
