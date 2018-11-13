import { Controller, Post, Get, Body, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { CustomValidationPipe } from 'util/validation.pipe';

@Controller()
export class UserController {
  constructor(private userService: UserService) { }

  @Get('api/users')
  showAllUsers() {
    return this.userService.showAll();
  }

  @Post('login')
  @UsePipes(new CustomValidationPipe())
  login(@Body() data: UserDTO) {
    return this.userService.login(data);
  }

  @Post('register')
  @UsePipes(new CustomValidationPipe())
  register(@Body() data: UserDTO) {
    return this.userService.register(data);
  }
}
