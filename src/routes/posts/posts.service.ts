import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { isNotFoundPrismaError } from 'src/shared/helper'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreatePostBodyDTO, UpdatePostBodyDTO } from './post.dto'

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  getPosts(userId: number) {
    return this.prismaService.post.findMany({
      where: {
        authorId: userId,
      },
      include: {
        author: true,
      },
    })
  }

  createPosts(body: CreatePostBodyDTO, userId: number) {
    return this.prismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
      include: {
        author: true,
      },
    })
  }

  getPost(postId: number) {
    try {
      const post = this.prismaService.post.findUniqueOrThrow({
        where: {
          id: postId,
        },
        include: {
          author: true,
        },
      })

      return post
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('Post not found')
      }
      throw new InternalServerErrorException('Update failed')
    }
  }

  async updatePost(postId: number, body: UpdatePostBodyDTO, userId: number) {
    try {
      const post = await this.prismaService.post.update({
        where: {
          id: postId,
          authorId: userId,
        },
        data: {
          title: body.title,
          content: body.content,
        },
        include: {
          author: true,
        },
      })

      return post
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('Post not found')
      }
      throw new InternalServerErrorException('Update failed')
    }
  }

  async deletePost(postId: number, userId: number) {
    try {
      await this.prismaService.post.delete({
        where: {
          id: postId,
          authorId: userId,
        },
      })

      return true
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('Post not found')
      }
      throw new InternalServerErrorException('Update failed')
    }
  }
}
