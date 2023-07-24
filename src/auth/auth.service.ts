import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/entities';
import { Repository } from 'typeorm';
import { LoginUserDto, RegisterAdminDTO, RegisterUserDTO } from './dto';

import { comparePassword, hashPassword } from 'src/utils/password';

import { JWTService } from 'src/configs';
import {
    Http,
    createBadRequset,
    createSuccessResponse,
    createUnAuthorized,
} from 'src/common';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly jwtService: JWTService
    ) {}

    //register
    async register(registerDTO: RegisterUserDTO): Promise<Http> {
        let userNameIsExist = await this.userRepository.findOne({
            where: { username: registerDTO.username },
        });
        if (userNameIsExist)
            return createBadRequset('Username already exists so register');

        const password = await hashPassword(registerDTO.password);

        if (!password) return createBadRequset('Password is not hash');

        const newUser = new User({
            ...registerDTO,
            password,
        });

        const response = await this.userRepository.save(newUser);

        if (!response) return createBadRequset('Register is');

        return createSuccessResponse(response, 'Register is');
    }

   

    async registerAdmin(registerDTO: RegisterAdminDTO): Promise<Http> {
        let userNameIsExist = await this.userRepository.findOne({
            where: { username: registerDTO.username },
        });
        if (userNameIsExist)
            return createBadRequset('Username already exists so register');

        const password = await hashPassword(registerDTO.password);

        if (!password) return createBadRequset('Password is not hash');

        const newUser = new User({
            ...registerDTO,
            password,
        });

        const response = await this.userRepository.save(newUser);

        if (!response) return createBadRequset('Register is');

        return createSuccessResponse(response, 'Register is');
    }

    async login(loginUserDTO: LoginUserDto): Promise<Http> {
        const userNameIsExist = await this.userRepository.findOne({
            where: { username: loginUserDTO.username },
        });

        if (!userNameIsExist) return createBadRequset('Username is not exist');
        const isMatch = await comparePassword(
            loginUserDTO.password,
            userNameIsExist.password
        );
        if (!isMatch) return createBadRequset('Password is not match');

        const device_token = loginUserDTO.device_token;

        await this.userRepository.update(
            { username: loginUserDTO.username },
            { device_token: device_token }
        );

        const access_token = await this.jwtService.signToken(
            {
                ...userNameIsExist,
                device_token: device_token,
                uuid: userNameIsExist.uuid,
                roles: userNameIsExist.roles,
            },
            'access'
        );

        const refresh_token = await this.jwtService.signToken(
            {
                ...userNameIsExist,
                device_token: device_token,
                uuid: userNameIsExist.uuid,
                roles: userNameIsExist.roles,
            },
            'refresh'
        );

        return createSuccessResponse(
            {
                data: {
                    access_token: access_token,
                    refresh_token: refresh_token,
                },
            },
            'Login is'
        );
    }

    async refreshToken(refreshToken: string): Promise<Http> {
        const isValid = await this.jwtService.verifyToken(
            refreshToken,
            'refresh'
        );

        if (!isValid) return createUnAuthorized('Refresh token is not valid');
        const user = await this.userRepository.findOne({
            where: {
                uuid: isValid.uuid,
            },
        });

        if (!user) return createBadRequset('User is not exist so refresh');

        const access_token = await this.jwtService.signToken(
            {
                ...user,
                uuid: user.uuid,
                role: [1],
            },
            'access'
        );

        const refresh_token = await this.jwtService.signToken(
            {
                ...user,
                uuid: user.uuid,
                role: [1],
            },
            'refresh'
        );

        return createSuccessResponse(
            {
                data: {
                    access_token: access_token,
                    refresh_token: refresh_token,
                },
            },
            'Login is'
        );
    }


    



}
