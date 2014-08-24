module Core {
	export class Log {
		/**
		 * Post a log message with info level
		 * @param String message
		 * @param String namespace
		 */
		static info(message: string, namespace?: string) {
			if (Game.config.logLevel >= LogLevel.Info && console && console.log) {
				if (namespace) namespace = '[' + namespace + '] ';

				console.log(namespace + message);
			}
		}

		/**
		 * Post a log message with warning level
		 * @param String message
		 * @param String namespace
		 */
		static warning(message: string, namespace?: string) {
			if (Game.config.logLevel >= LogLevel.Warning && console && console.warn) {
				if (namespace) namespace = '[' + namespace + '] ';

				console.warn(namespace + message);
			}
		}

		/**
		 * Post a log message with error level
		 * @param String message
		 * @param String namespace
		 */
		static error(message: string, namespace?: string) {
			if (Game.config.logLevel >= LogLevel.Error && console && console.error) {
				if (namespace) namespace = '[' + namespace + '] ';

				console.error(namespace + message);
			}
		}
	}

	export enum LogLevel {
		Info, Warning, Error
	}
}