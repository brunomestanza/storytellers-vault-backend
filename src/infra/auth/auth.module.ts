import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { Env } from '@/env'

import { JwtStrategy } from './jwt.strategy'
import { JwtAuthGuard } from './jwt-auth.guard'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory(config: ConfigService<Env, true>) {
        const privateKey = config.get('JWT_PRIVATE_KEY', { infer: true })
        const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })

        return {
          signOptions: { algorithm: 'RS256' },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
        }
      },
    }),
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }, JwtStrategy],
})
export class AuthModule {}
