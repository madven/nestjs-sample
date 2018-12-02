import { HttpException, HttpStatus, Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDTO, UserRO } from './user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) { }

  async showAll(@Query('page') page: number): Promise<UserRO[]> {
    if (page < 1)
      throw new HttpException('Page should be a positive number', HttpStatus.BAD_REQUEST);
    const users = await this.userRepository.find({
      relations: ['ideas', 'bookmarks'],
      skip: 10 * (page - 1),
      take: 10,
    });
    return users.map(user => user.toResponseObject());
  }

  async login(data: UserDTO): Promise<UserRO> {
    const { username, password } = data;
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException('Invalid username/password', HttpStatus.BAD_REQUEST);
    }
    return user.toResponseObject(true);
  }

  async register(data: UserDTO): Promise<UserRO> {
    const { username } = data;
    let user = await this.userRepository.findOne({ username });
    if (user)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    user = await this.userRepository.create(data);
    await this.userRepository.save(user);
    return user.toResponseObject(true);
  }
}
