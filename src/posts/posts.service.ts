import { Injectable } from '@nestjs/common'

@Injectable()
export class PostsService {
  getPosts() {
    return 'Posts'
  }

  createPosts(body: any) {
    return body
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
