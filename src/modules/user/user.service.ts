import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

    //get profile

    // get user by id

    // get users

    // update profile

    // update avatar

    // delete avatar

    // update password

    // delete user

    // delete all users

}
