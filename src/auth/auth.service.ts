import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/entities';
import { Repository } from 'typeorm';
import { LoginUserDto, RegisterUserDTO } from './dto';

import { comparePassword, hashPassword } from 'src/utils/password';

import { JWTService } from 'src/configs';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly jwtService: JWTService
    ) {}

    //register
    async register(registerDTO: RegisterUserDTO): Promise<any> {
        try {
            let emailIsExist = await this.userRepository.findOne({
                where: { email: registerDTO.email },
            });
            if (emailIsExist) {
                return {
                    message: 'email already exists',
                    data: null,
                    status: HttpStatus.BAD_REQUEST,
                };
            }

            let userNameIsExitst = await this.userRepository.findOne({
                where: { username: registerDTO.username },
            });
            if (userNameIsExitst) {
                return {
                    message: 'Username already exists',
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

            return {
                message: 'email registered successfully',
                data: response,
                status: true,
            };
        } catch (error) {
            console.log('register error: ', error);
        }
    }

    async login(loginUserDTO: LoginUserDto): Promise<any> {


        const user = await this.userRepository.findOne({
            where: { email: loginUserDTO.email },
        });
   
        if (!user) {
            return {
                message: 'User not found',
                data: null,
                status: HttpStatus.BAD_REQUEST,
            };
        }
        const isMatch = await comparePassword(
            loginUserDTO.password,
            user.password
        );
        if (!isMatch) {
            return {
                message: 'Incorrect password',
                data: null,
                status: HttpStatus.BAD_REQUEST,
            };
        }

        const device_token = loginUserDTO.device_token;

            await this.userRepository.update(
            { email: loginUserDTO.email },
            { device_token: device_token }
        );

       

        const access_token = await this.jwtService.signToken(
            {
                ...user,
                device_token: device_token,
                uuid: user.uuid,
                roles: user.roles
               
            },
            'access'
        );

        const refresh_token = await this.jwtService.signToken(
            {
                ...user,
                device_token: device_token,
                uuid: user.uuid,
                roles: user.roles             
            },
            'refresh'
        );

        return {
            message: 'Login successfully',

            status: HttpStatus.OK,
            data: {
                access_token: access_token,
                refresh_token: refresh_token,
          
            },
        };
    }
}
