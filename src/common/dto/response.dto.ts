export class SuccessResponseDto<T = any> {
  success: boolean;
  message: string;
  data: T;

  constructor(message: string, data: T) {
    this.success = true;
    this.message = message;
    this.data = data;
  }
}

export class ErrorResponseDto {
  success: boolean;
  message: string;
  errors?: any;

  constructor(message: string, errors?: any) {
    this.success = false;
    this.message = message;
    this.errors = errors;
  }
}
