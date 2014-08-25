var Core;
(function (Core) {
    var Log = (function () {
        function Log() {
        }
        Log.info = function (message, namespace) {
            if (Game.config.logLevel >= 0 /* Info */ && console && console.log) {
                if (namespace)
                    namespace = '[' + namespace + '] ';

                console.log(namespace + message);
            }
        };

        Log.warning = function (message, namespace) {
            if (Game.config.logLevel >= 1 /* Warning */ && console && console.warn) {
                if (namespace)
                    namespace = '[' + namespace + '] ';

                console.warn(namespace + message);
            }
        };

        Log.error = function (message, namespace) {
            if (Game.config.logLevel >= 2 /* Error */ && console && console.error) {
                if (namespace)
                    namespace = '[' + namespace + '] ';

                console.error(namespace + message);
            }
        };
        return Log;
    })();
    Core.Log = Log;

    (function (LogLevel) {
        LogLevel[LogLevel["Info"] = 0] = "Info";
        LogLevel[LogLevel["Warning"] = 1] = "Warning";
        LogLevel[LogLevel["Error"] = 2] = "Error";
    })(Core.LogLevel || (Core.LogLevel = {}));
    var LogLevel = Core.LogLevel;
})(Core || (Core = {}));
//# sourceMappingURL=log.js.map
