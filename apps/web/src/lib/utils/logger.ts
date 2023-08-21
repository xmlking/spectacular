/**
 * isomorphic logger (a small wrapper around console.log)
 */
export enum LogLevel {
	off = 0,
	Debug,
	Error,
	Warning,
	Info
}

export class Logger {
	static level = LogLevel.Debug;

	private source: string;

	/**
	 * Enables production mode.
	 * Sets logging level to LogLevel.Warning.
	 */
	static enableProductionMode() {
		Logger.level = LogLevel.Warning;
	}

	constructor(component: string) {
		this.source = component;
	}

	public debug(...data: unknown[]): void {
		this.log(console.info, LogLevel.Debug, data);
	}

	public info(...data: unknown[]): void {
		this.log(console.info, LogLevel.Info, data);
	}

	public warn(...data: unknown[]): void {
		this.log(console.warn, LogLevel.Warning, data);
	}

	public error(...data: unknown[]): void {
		this.log(console.error, LogLevel.Error, data);
	}

	private log = (fun: () => void, level: LogLevel, objects: unknown[]): void => {
		if (level >= Logger.level) {
			const log = this.source ? [`[${this.source}]`].concat(objects as string[]) : objects;
			fun.apply<Console, unknown[], void>(console, log);
		}
	};
}
