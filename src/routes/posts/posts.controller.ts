import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { CreatePostBodyDTO, GetPostItemDTO, UpdatePostBodyDTO } from './post.dto'
import { PostsService } from './posts.service'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @Auth([AuthType.Bearer], { condition: ConditionGuard.And })
  getPosts(@ActiveUser('userId') userId: number) {
    return this.postsService.getPosts(userId).then((posts) => posts.map((post) => new GetPostItemDTO(post)))
  }

  @Post()
  @Auth([AuthType.Bearer], { condition: ConditionGuard.And })
  async createPost(@Body() body: CreatePostBodyDTO, @ActiveUser('userId') userId: number) {
    return new GetPostItemDTO(await this.postsService.createPosts(body, userId))
  }

  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postsService.getPost(Number(id))
  }

  @Put(':id')
  @Auth([AuthType.Bearer], { condition: ConditionGuard.And })
  async updatePost(@Param('id') id: string, @Body() body: UpdatePostBodyDTO, @ActiveUser('userId') userId: number) {
    return new GetPostItemDTO(await this.postsService.updatePost(Number(id), body, userId))
  }

  @Delete(':id')
  @Auth([AuthType.Bearer], { condition: ConditionGuard.And })
  deletePost(@Param('id') id: string, @ActiveUser('userId') userId: number) {
    return this.postsService.deletePost(Number(id), userId)
  }
}
