var Core;
(function (Core) {
    var Input = (function () {
        function Input() {
        }
        Input.on = function (keyName, method) {
            var keyCode = InputKeys[keyName];

            if (!keyCode) {
                Core.Log.error('Core.InputKeys does not contain ' + keyName, 'Core/Input');
                return;
            }

            Core.Log.info('Added input listener for ' + keyName + ' (' + keyCode + ')', 'Core/Input');

            if (!Input.listeners[keyCode]) {
                Input.listeners[keyCode] = [];
            }

            Input.listeners[keyCode].push(method);
        };

        Input.onKeyDown = function (e) {
            if (!Input.listeners[e.keyCode])
                return;

            Core.Log.info('Triggered input listener for ' + e.keyCode + ' (' + Input.listeners[e.keyCode].length + ' listeners)', 'Core/Input');

            Input.listeners[e.keyCode].forEach(function (method) {
                method();
            });
        };
        Input.listeners = {};
        return Input;
    })();
    Core.Input = Input;

    window.onkeydown = Input.onKeyDown;

    var InputKeys;
    (function (InputKeys) {
        InputKeys[InputKeys["left"] = 37] = "left";
        InputKeys[InputKeys["up"] = 38] = "up";
        InputKeys[InputKeys["right"] = 39] = "right";
        InputKeys[InputKeys["down"] = 40] = "down";
    })(InputKeys || (InputKeys = {}));
    ;
})(Core || (Core = {}));
//# sourceMappingURL=input.js.map
