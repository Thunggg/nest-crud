import { BadRequestException, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ValidationError } from 'class-validator'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // https://stackoverflow.com/questions/75581669/customize-error-message-in-nest-js-using-class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // bỏ những field không có decorator
      forbidNonWhitelisted: true, // nếu ko có decorator thì sẽ báo lỗi

      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          validationErrors.map((error) => ({
            field: error.property,
            error: Object.values(error.constraints ?? {}).join(', '),
          })),
        )
      },
    }),
  )

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
