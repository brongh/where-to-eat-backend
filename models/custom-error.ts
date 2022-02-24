export class CustomError {
  message!: string;
  status!: number;
  extras!: any;

  constructor(message: string, status: number = 500, extras: any = {}) {
    this.message = message;
    this.status = status;
    this.extras = extras;
  }
}
