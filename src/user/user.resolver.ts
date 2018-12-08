import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  constructor(private userService: UserService) { }

  @Query()
  users(@Args('page') page: number) {
    return this.userService.showAll(page);
  }
}