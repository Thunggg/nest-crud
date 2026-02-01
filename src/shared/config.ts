import { plainToInstance } from 'class-transformer'
import { IsString, validateSync } from 'class-validator'
import fs from 'fs'
import type { StringValue } from 'ms'
import path from 'path'

// kiểm ra xem có file env hay chưa
if (!fs.existsSync(path.resolve('.env'))) {
  console.log('Không thể tìm thấy file .env')
  process.exit(0)
}

class ConfigSchema {
  DATABASE_URL: string

  @IsString()
  SECRET_KEY: string

  @IsString()
  ACCESS_TOKEN_SECRET: string

  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: StringValue

  @IsString()
  REFRESH_TOKEN_SECRET: string

  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: StringValue

  @IsString()
  PORT: string
}

const configServer = plainToInstance(ConfigSchema, process.env)
const error = validateSync(configServer)
if (error.length > 0) {
  console.log('Cấu hình không hợp lệ', error)
  const errors = error.map((err) => {
    return {
      property: err.property,
      constraints: err.constraints,
      value: err.value,
    }
  })

  throw errors
}
const envConfig = configServer
export default envConfig
