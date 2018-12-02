import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserDTO } from './user.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userService: UserService) { }

  @Get('api/users')
  showAllUsers(@Query('page') page: number) {
    return this.userService.showAll(page);
  }

  @Post('login')
  login(@Body() data: UserDTO) {
    return this.userService.login(data);
  }

  @Post('register')
  register(@Body() data: UserDTO) {
    return this.userService.register(data);
  }
}
