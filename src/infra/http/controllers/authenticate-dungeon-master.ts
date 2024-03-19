import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { AuthenticateDungeonMasterUseCase } from '@/domain/storytellers/application/use-cases/authenticate-dungeon-master'
import { InvalidCredentialsError } from '@/domain/storytellers/application/use-cases/errors/invalid-credentials-error'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/controllers/pipes/zod-validation-pipe'

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password has to have 6 characters'),
})

const bodyValidationPipe = new ZodValidationPipe(bodySchema)

type BodySchema = z.infer<typeof bodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateDungeonMasterController {
  constructor(private useCase: AuthenticateDungeonMasterUseCase) {}

  @Post()
  @HttpCode(200)
  async handle(@Body(bodyValidationPipe) body: BodySchema) {
    const { email, password } = body

    const result = await this.useCase.execute({ email, password })

    if (result.type === 'failure') {
      const error = result.value

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new BadRequestException({
            field: null,
            message: error.message,
          })

        default:
          throw new BadRequestException({
            field: null,
            message: error.message,
          })
      }
    }

    return { accessToken: result.value.accessToken }
  }
}
