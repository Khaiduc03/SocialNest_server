import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import { RegisterUserDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { HASH } from 'src/environment';
import { hashPassword } from 'src/utils/password';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    //register
    async register(registerDTO: RegisterUserDTO): Promise<any> {
        console.log(registerDTO);
        let user = await this.userRepository.findOne({
            where: { email: registerDTO.email },
        });
        if (user) {
            return {
                message: 'User already exists',
                data: null,
                status: HttpStatus.BAD_REQUEST,
            };
        }
        //hash password
       
        const password = await hashPassword(registerDTO.password);
   
        const newUser = new User({
            ...registerDTO,
            password,
        });
        const response = await this.userRepository.save(newUser);

        await this.cacheManager.set('key', response.email);

        const value = await this.cacheManager.get('key');
        console.log(value);

        return {
            message: 'email registered successfully',
            data: response,
            status: true,
        };
    }
}
