import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { JWTService } from 'src/configs';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JWTService) {}

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        return this.validateRequest(request, response);
    }

    //validate request
    private async validateRequest(
        request: Request,
        response: Response
    ): Promise<boolean> {
        try {
            const token = request.headers['authorization'].split(' ')[1];
            if (!token) {
                throw new UnauthorizedException('Unauthorized');
            }
            const user = await this.jwtService.verifyToken(token, 'access');
            if (!user) {
                throw new UnauthorizedException('Unauthorized');
            }

            request['user'] = user;
            return true;
        } catch (error) {
            response
                .status(HttpStatus.UNAUTHORIZED)
                .json(new UnauthorizedException('Unauthorized'));
        }
    }
}
