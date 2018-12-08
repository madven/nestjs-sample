import { ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, call$: Observable<any>): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const start = Date.now();

    if (req) {
      const method = req.method;
      const url = req.url;

      return call$.pipe(
        tap(() =>
          Logger.log(
            `${method} ${url} ${Date.now() - start}ms`,
            context.getClass().name,
          ),
        ),
      );
    } else {
      const ctx: any = GqlExecutionContext.create(context);
      const info = ctx.getInfo();
      return call$.pipe(
        tap(() =>
          Logger.log(
            `${info.parentType} ${info.fieldName} ${Date.now() - start}ms`,
            ctx.constructorRef.name,
          ),
        ),
      );
    }
  }
}