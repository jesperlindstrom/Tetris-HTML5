var Core;
(function (Core) {
    var Renderer = (function () {
        function Renderer(name, width, height, layerZ, background) {
            if (typeof layerZ === "undefined") { layerZ = 1; }
            this.isCleared = true;
            this.renderQueue = [];
            this.name = name;
            this.width = width;
            this.height = height;
            this.layerZ = layerZ;
            this.background = background;

            Core.Log.info('Created renderer "' + this.name + '" (' + this.width + 'x' + this.height + ', layer: ' + this.layerZ + ')', 'Core/Renderer');

            this.createCanvas();
        }
        Renderer.prototype.createCanvas = function () {
            this.canvas = document.createElement('canvas');

            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.canvas.style.zIndex = this.layerZ.toString();
            this.canvas.style.position = 'absolute';

            if (this.background) {
                this.canvas.style.background = this.background;
            }

            this.context = this.canvas.getContext('2d');

            document.body.appendChild(this.canvas);
        };

        Renderer.prototype.clear = function () {
            this.context.clearRect(0, 0, this.width, this.height);
            this.isCleared = true;
        };

        Renderer.prototype.draw = function (method) {
            this.renderQueue.push(method);
        };

        Renderer.prototype.render = function () {
            var _this = this;
            if (!this.renderQueue.length)
                return;

            this.clear();

            this.renderQueue.forEach(function (renderMethod) {
                renderMethod(_this.context);
            });

            this.renderQueue = [];
            this.isCleared = false;
        };
        return Renderer;
    })();
    Core.Renderer = Renderer;
})(Core || (Core = {}));
;
//# sourceMappingURL=renderer.js.map
