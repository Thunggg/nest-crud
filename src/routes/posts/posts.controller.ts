import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { GetPostItemDTO } from './post.dto'
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
  createPost(@Body() body: any, @ActiveUser('userId') userId: number) {
    return this.postsService.createPosts(body, userId)
  }

  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postsService.getPost(id)
  }

  @Put('id')
  updatePost(@Param('id') id: string, @Body() body: any) {
    return this.postsService.updatePost(id, body)
  }

  @Delete('id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id)
  }
}
