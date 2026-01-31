import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import envConfig from '../config'
import { TokenPayload } from '../types/jwt.type'

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async signAccessToken(payload: { userId: number }): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
      expiresIn: envConfig.ACCESS_TOKEN_EXPIRES_IN,
    })
  }

  async signRefreshToken(payload: { userId: number }): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
      expiresIn: envConfig.REFRESH_TOKEN_EXPIRES_IN,
    })
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    return await this.jwtService.verifyAsync(token, {
      secret: envConfig.ACCESS_TOKEN_SECRET,
    })
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    return await this.jwtService.verifyAsync(token, {
      secret: envConfig.REFRESH_TOKEN_SECRET,
    })
  }
}
