import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { AuthType, ConditionGuard } from './shared/constants/auth.constant'
import { Auth } from './shared/decorators/auth.decorator'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: ConditionGuard.And })
  getHello() {
    return this.appService.getHello()
  }
}
