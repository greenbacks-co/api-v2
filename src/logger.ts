export interface Logger {
  error: (message: unknown) => void;
  info: (message: unknown) => void;
}

export class ConsoleLogger implements Logger {
  error(message: unknown) {
    console.error(message);
  }

  info(message: unknown) {
    console.log(message);
  }
}

export class SilentLogger implements Logger {
  error() {}

  info() {}
}
