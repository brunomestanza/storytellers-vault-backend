import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { z } from 'zod'

import { CreateDungeonMasterAccountUseCase } from '@/domain/storytellers/application/use-cases/create-dungeon-master-account'
import { EmailAlreadyExists } from '@/domain/storytellers/application/use-cases/errors/email-already-exists'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/controllers/pipes/zod-validation-pipe'

export const bodySchema = z.object({
  name: z.string().min(6, 'Nome deve ter no mínimo 6 caracteres.'),
  email: z.string().email(),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres.'),
})

const bodyValidationPipe = new ZodValidationPipe(bodySchema)

type BodySchema = z.infer<typeof bodySchema>

@Controller('/dungeon-masters')
@Public()
export class CreateDungeonMasterAccountController {
  constructor(private useCase: CreateDungeonMasterAccountUseCase) {}
  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: BodySchema) {
    const { name, email, password } = body

    const result = await this.useCase.execute({ email, name, password })

    if (result.type === 'failure') {
      const error = result.value

      switch (error.constructor) {
        case EmailAlreadyExists:
          throw new ConflictException({
            field: 'email',
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
