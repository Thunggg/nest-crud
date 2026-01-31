import { Body, Controller, Post } from '@nestjs/common'
import { RegisterBodyDTO } from './auth.dto'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterBodyDTO) {
    console.log(body)
    // return this.authService.register(body)
  }
}
