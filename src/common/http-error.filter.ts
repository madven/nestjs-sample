import { Catch, ExceptionFilter, HttpException, ArgumentsHost, Logger, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();
    const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = {
      code: status,
      timeStamp: new Date().toLocaleString(),
      path: req.url,
      method: req.method,
      message: status !== HttpStatus.INTERNAL_SERVER_ERROR
        ? exception.message.error || exception.message || null
        : 'Internal server error',
    };
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.error(`${req.method} ${req.url}`, exception.stack, 'ExceptionFilter');
    } else {
      Logger.error(`${req.method} ${req.url}`, JSON.stringify(errorResponse), 'ExceptionFilter');
    }

    res.status(status).json(errorResponse);
  }
}