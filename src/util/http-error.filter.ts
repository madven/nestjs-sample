import { Catch, ExceptionFilter, HttpException, ArgumentsHost, Logger, HttpStatus } from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    const errorResponse = {
      code: exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
      timeStamp: new Date().toLocaleString(),
      path: req.url,
      method: req.method,
      message: exception.message.error || exception.message || null,
    };

    res.status(404).json(errorResponse);

    Logger.error(`${req.method} ${req.url}`, JSON.stringify(errorResponse), 'HttpErrorFilter');
  }
}