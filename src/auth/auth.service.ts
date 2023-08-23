import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from 'src/entities';
import { Repository } from 'typeorm';
import { ImageService } from './../modules/image/image.service';
import {
    LoginUserDto,
    RefreshTokenDto,
    RegisterAdminDTO,
    RegisterUserDTO,
} from './dto';
import { ChangePasswordDTO, UpdatePasswordDTO } from './dto/index';

import { fakerVI } from '@faker-js/faker';
import { comparePassword, hashPassword } from 'src/utils/password';

import { OAuth2Client } from 'google-auth-library';
import {
    Http,
    createBadRequset,
    createBadRequsetNoMess,
    createSuccessResponse,
    createUnAuthorized,
} from 'src/common';
import { JWTService } from 'src/configs';
import { GOOGLE_CLIENT_ID } from 'src/environment';
import { GoogleLoginDTO } from './dto/GoogleLoginDTO';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly imageService: ImageService,
        private readonly jwtService: JWTService
    ) {}

    //register
    async register(registerDTO: RegisterUserDTO): Promise<Http> {
        let emailIsExist = await this.userRepository.findOne({
            where: { email: registerDTO.email },
        });
        if (emailIsExist)
            return createBadRequset('email already exists so register');

        const password = await hashPassword(registerDTO.password);

        if (!password) return createBadRequset('Password is not hash');
        //const avatar = await this.imageService.createImage();

        const newUser = new User({
            ...registerDTO,
            password,
            avatar: await this.imageService.createImage(),
        });

        const response = await this.userRepository.save(newUser);

        if (!response) return createBadRequset('Register is');

        const access_token = await this.jwtService.signToken(
            {
                ...response,
                device_token: response.device_token,
                uuid: response.uuid,
                roles: response.roles,
            },
            'access'
        );

        const refresh_token = await this.jwtService.signToken(
            {
                ...response,
                device_token: response.device_token,
                uuid: response.uuid,
                roles: response.roles,
            },
            'refresh'
        );

        return createSuccessResponse(
            { access_token, refresh_token, isUpdate: response.isUpdate },
            'Regist is'
        );
    }

    async registerAdmin(registerDTO: RegisterAdminDTO): Promise<Http> {
        let emailIsExist = await this.userRepository.findOne({
            where: { email: registerDTO.email },
        });
        if (emailIsExist)
            return createBadRequset('email already exists so register');

        const password = await hashPassword(registerDTO.password);

        if (!password) return createBadRequset('Password is not hash');

        const newUser = new User({
            ...registerDTO,
            password,
            roles: UserRole.Admin,
        });

        const response = await this.userRepository.save(newUser);

        if (!response) return createBadRequset('Register is');

        return createSuccessResponse(
            `Register successfull with email  ${response.email}`,
            'Register is'
        );
    }

    async login(loginUserDTO: LoginUserDto): Promise<Object> {
        const emailIsExist = await this.userRepository.findOne({
            where: { email: loginUserDTO.email },
        });

        if (!emailIsExist) return createBadRequsetNoMess('email is not exist');
        const isMatch = await comparePassword(
            loginUserDTO.password,
            emailIsExist.password
        );

        console.log(isMatch);
        if (!isMatch) return createBadRequsetNoMess('Password is wrong!!');

        const device_token = loginUserDTO.device_token;

        await this.userRepository.update(
            { email: loginUserDTO.email },
            { device_token: device_token, isUpdatePassword: true, status: true }
        );

        const access_token = await this.jwtService.signToken(
            {
                ...emailIsExist,
                device_token: device_token,
                uuid: emailIsExist.uuid,
                roles: emailIsExist.roles,
            },
            'access'
        );

        const refresh_token = await this.jwtService.signToken(
            {
                ...emailIsExist,
                device_token: device_token,
                uuid: emailIsExist.uuid,
                roles: emailIsExist.roles,
            },
            'refresh'
        );

        return createSuccessResponse(
            { access_token, refresh_token, isUpdate: emailIsExist.isUpdate },
            'Login is'
        );
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<Http> {
        try {
            const isValid = await this.jwtService.verifyToken(
                refreshTokenDto.refreshToken,
                'refresh'
            );

            if (!isValid) {
                return createUnAuthorized('Refresh token is not valid');
            }

            const user = await this.userRepository.findOne({
                where: {
                    uuid: isValid.uuid,
                },
            });

            if (!user) {
                return createBadRequset(
                    'User does not exist, so cannot refresh'
                );
            }

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
                    access_token: access_token,
                    refresh_token: refresh_token,
                },
                'Login successful'
            );
        } catch (error) {
            return createUnAuthorized(
                'An error occurred while refreshing token'
            );
        }
    }

    async crateDummyUser(): Promise<Http> {
        const users = [];
        for (let i = 0; i < 100; i++) {
            const user = new User({
                email: fakerVI.internet.email(),
                password: await hashPassword('123456'),
                avatar: await this.imageService.createDummyImage(),
                roles: UserRole.User,
                fullname: fakerVI.person.fullName(),
                phoneNumber: fakerVI.phone.number('+84#########'),
            });

            users.push(user);
        }
        const reponse = await this.userRepository.save(users);
        return createSuccessResponse(reponse.length, 'Create dummy user is');
    }

    async googleLogin(googleLoginDTO: GoogleLoginDTO): Promise<Object> {
        const { idToken, device_token } = googleLoginDTO;

        const client = new OAuth2Client(GOOGLE_CLIENT_ID);

        try {
            const ticket = await client.verifyIdToken({
                idToken: idToken,
                audience: GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            const email = payload.email;

            let user = await this.userRepository.findOne({ where: { email } });

            if (!user) {
                user = new User({
                    email: email,
                    avatar: await this.imageService.createImage(
                        payload.picture
                    ),
                });
                await this.userRepository.update(
                    { email: email },
                    { device_token: device_token, isUpdate: true, status: true }
                );
                await this.userRepository.save(user);
            }

            await this.userRepository.update(
                { email: email },
                { device_token: device_token }
            );

            const access_token = await this.jwtService.signToken(
                { ...user },
                'access'
            );

            const refresh_token = await this.jwtService.signToken(
                { ...user },
                'refresh'
            );

            return createSuccessResponse(
                {
                    access_token,
                    refresh_token,
                    isUpdatePassword: user.isUpdatePassword,
                },
                'Login is'
            );
        } catch (error) {
            throw new HttpException(
                'Google login failed',
                HttpStatus.UNAUTHORIZED
            );
        }
    }

    async updatePassword(
        updatePasswordDTO: UpdatePasswordDTO
    ): Promise<Http | undefined> {
        const { email, password } = updatePasswordDTO;
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) return undefined;

        const newPassword = await hashPassword(password);
        if (!newPassword) return undefined;

        const response = await this.userRepository.update(
            { email: email },
            { password: newPassword, isUpdatePassword: true }
        );
        if (!response) return undefined;

        return createSuccessResponse(response, 'Update password is');
    }

    async changePassword(ChangePasswordDTO: ChangePasswordDTO): Promise<Http> {
        const { email, oldPassword, newPassword } = ChangePasswordDTO;
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) return createBadRequsetNoMess('Not found email');
        const isMatch = await comparePassword(oldPassword, user.password);

        if (!isMatch) return createBadRequsetNoMess('Old password is wrong');

        const hashNewPassword = await hashPassword(newPassword);

        if (!hashNewPassword)
            return createBadRequsetNoMess('Password is not hash');

        const response = await this.userRepository.update(
            { email: email },
            { password: hashNewPassword, isUpdatePassword: true }
        );
        if (!response) return createBadRequsetNoMess('Something wrong!!');

        return createSuccessResponse(response, 'Change password is');
    }
}
