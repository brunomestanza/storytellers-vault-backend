import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { z } from 'zod'

import { Env } from '@/env'

const jwtTokenSchema = z.object({
  sub: z.string().uuid(),
})

export type DungeonMasterJwtPayload = z.infer<typeof jwtTokenSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    })
  }

  // Validate the information saved on the token
  async validate(payload: DungeonMasterJwtPayload) {
    return jwtTokenSchema.parse(payload)
  }
}
