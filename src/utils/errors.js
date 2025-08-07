// taken from "make-error"
function BaseError(message) {
  if (message !== undefined) {
    Object.defineProperty(this, "message", {
      configurable: true,
      value: message,
      writable: true,
    });
  }

  var cname = this.constructor.name;
  if (cname !== undefined && cname !== this.name) {
    Object.defineProperty(this, "name", {
      configurable: true,
      value: cname,
      writable: true,
    });
  }

  Error.captureStackTrace(this, this.constructor);
}

BaseError.prototype = Object.create(Error.prototype, {
  // See: https://github.com/JsCommunity/make-error/issues/4
  constructor: {
    configurable: true,
    value: BaseError,
    writable: true,
  },
});

export class LoadError extends BaseError {
  constructor(message) {
    super(message);
  }
}

export class ParsingError extends BaseError {
  constructor(message) {
    super(message);
  }
}