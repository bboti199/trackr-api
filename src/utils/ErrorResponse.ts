class BaseError {
  constructor() {
    Error.apply(this, arguments as any);
  }
}
export class ErrorResponse extends BaseError {
  constructor(public status: number, public message: string) {
    super();
  }
}
