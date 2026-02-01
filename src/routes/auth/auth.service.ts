import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { PrismaClientValidationError } from '@prisma/client/runtime/client'
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helper'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { TokenService } from 'src/shared/services/token.service'
import { LoginBodyDTO, LogoutBodyDTO, RefreshTokenBodyDTO, RegisterBodyDTO } from './auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
  ) {}

  async register(body: RegisterBodyDTO) {
    try {
      const hashPassword = await this.hashingService.hash(body.password)

      const user = await this.prismaService.user.create({
        data: {
          email: body.email,
          password: hashPassword,
          name: body.name,
        },
      })

      return user
    } catch (error) {
      console.log(error)
      if (error instanceof PrismaClientValidationError) {
        throw new ConflictException('The field not be empty')
      } else if (isUniqueConstraintPrismaError(error)) {
        throw new ConflictException('Email already exists')
      }

      throw new InternalServerErrorException('Register failed')
    }
  }

  async generateToken(payload: { userId: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload),
    ])

    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
    await this.prismaService.refreshToken.create({
      data: {
        userId: decodedRefreshToken.userId,
        token: refreshToken,
        expiresAt: new Date(decodedRefreshToken.exp * 1000),
      },
    })

    return { accessToken, refreshToken }
  }

  async login(body: LoginBodyDTO) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email: body.email,
        },
      })

      if (!user) {
        throw new UnauthorizedException('Account is not exist!')
      }

      const isPasswordMatch = await this.hashingService.verify(body.password, user.password)

      if (!user) {
        throw new UnprocessableEntityException({
          field: 'password',
          error: 'Password is incorrect',
        })
      }

      const { accessToken, refreshToken } = await this.generateToken({ userId: user.id })

      return { accessToken, refreshToken }
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new ConflictException('The field not be empty')
      } else if (isUniqueConstraintPrismaError(error)) {
        throw new ConflictException('Email already exists')
      }

      throw new InternalServerErrorException('Register failed')
    }
  }

  async refreshToken(body: RefreshTokenBodyDTO) {
    try {
      const { refreshToken } = body

      const { userId } = await this.tokenService.verifyRefreshToken(refreshToken)

      await this.prismaService.refreshToken.findUniqueOrThrow({
        where: {
          token: refreshToken,
        },
      })

      return await this.generateToken({ userId })
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new UnauthorizedException('Refresh token has been revoked!')
      }
      throw new UnauthorizedException()
    }
  }

  async logout(body: LogoutBodyDTO) {
    try {
      const { refreshToken } = body

      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      })

      return { message: 'Logout successfully' }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new UnauthorizedException('Refresh token has been revoked!')
      }
      throw new UnauthorizedException()
    }
  }
}
