import { Controller, Post, Get, Body, UsePipes, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';
import { CustomValidationPipe } from 'util/validation.pipe';
import { CustomAuthGuard } from 'util/auth.guard';
import { User } from './user.decorator';

@Controller()
export class UserController {
  constructor(private userService: UserService) { }

  @Get('api/users')
  @UseGuards(new CustomAuthGuard())
  showAllUsers(@User('username') username) {
    console.log(username);
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
