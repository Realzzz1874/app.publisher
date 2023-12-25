import { ResponseStatus } from '../types';

class HttpError extends Error {
  public status: ResponseStatus;
  public message: string;

  constructor(status: ResponseStatus, message: string) {
    super(message);

    this.status = status;
    this.message = message;
  }
}

export default HttpError;
