import { Injectable } from '@nestjs/common'
import envConfig from 'src/shared/config'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  getPosts() {
    console.log(envConfig.ACCESS_TOKEN_EXPIRES_IN)
    return this.prismaService.post.findMany()
  }

  createPosts(body: any, userId: number) {
    return this.prismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
    })
  }

  getPost(id: string) {
    return id
  }

  updatePost(id: string, body: any) {
    return `${id} ${body}`
  }

  deletePost(id: string) {
    return id
  }
}
