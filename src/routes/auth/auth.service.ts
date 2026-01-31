import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaClientValidationError } from '@prisma/client/runtime/client'
import { Prisma } from 'src/generated/prisma/client'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
  ) {}

  async register(body: any) {
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
      } else if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email already exists')
      }
    }
  }
}
