import { Exclude } from 'class-transformer'
import { IsString, Length } from 'class-validator'
import { Match } from 'src/shared/decorators/custom-validator.decorator'

export class LoginBodyDTO {
  @IsString()
  email: string

  @IsString()
  @Length(6, 20, { message: 'password length must be greater than 6 and lower than 20' })
  password: string
}

export class LoginResDTO {
  accessToken: string
  refreshToken: string

  constructor(partial: Partial<LoginResDTO>) {
    Object.assign(this, partial)
  }
}

export class RegisterBodyDTO extends LoginBodyDTO {
  @IsString()
  name: string

  @IsString()
  @Match('password')
  confirmPassword: string
}

export class RegisterResDTO {
  id: number
  email: string
  @Exclude() password: string
  name: string
  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<RegisterResDTO>) {
    Object.assign(this, partial)
  }
}

export class RefreshTokenBodyDTO {
  @IsString()
  refreshToken: string
}

export class RefreshTokenResDTO {
  refreshToken: string

  constructor(partial: Partial<RefreshTokenResDTO>) {
    Object.assign(this, partial)
  }
}

export class LogoutBodyDTO extends RefreshTokenBodyDTO {}

export class LogoutResDTO {
  message: string

  constructor(partial: Partial<LogoutResDTO>) {
    Object.assign(this, partial)
  }
}
