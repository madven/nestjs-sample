import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { HttpErrorFilter } from './util/http-error.filter';
import { LoggingInterceptor } from './util/logging.interceptor';
import { UserModule } from './user/user.module';
import { CustomValidationPipe } from './util/validation.pipe';

@Module({
  imports: [TypeOrmModule.forRoot(), TodoModule, UserModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: CustomValidationPipe,
    },
  ],
})
export class AppModule { }
