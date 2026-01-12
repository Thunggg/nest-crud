import { Injectable } from '@nestjs/common'
import { PrismaService } from './shared/services/prisma.service'

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}
  getHello() {
    return this.prismaService.user.findMany()
  }
}
