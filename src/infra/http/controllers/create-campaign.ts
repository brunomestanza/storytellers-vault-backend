import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
} from '@nestjs/common'
import { NotFoundError } from 'rxjs'
import { z } from 'zod'

import { CreateCampaignUseCase } from '@/domain/storytellers/application/use-cases/create-campaign'
import { CurrentDungeonMaster } from '@/infra/auth/current-dungeon-master-decorator'
import { DungeonMasterJwtPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/controllers/pipes/zod-validation-pipe'

const characterSchema = z.object({
  name: z.string(),
  initiativeRollBonus: z.number(),
  actualLifePoints: z.number(),
  maxLifePoints: z.number(),
})

export const bodySchema = z.object({
  name: z.string(),
  description: z.string(),
  rpgSystem: z.string(),
  characters: z.array(characterSchema),
})

const bodyValidationPipe = new ZodValidationPipe(bodySchema)

type BodySchema = z.infer<typeof bodySchema>

@Controller('/campaigns')
export class CreateCampaignController {
  constructor(private useCase: CreateCampaignUseCase) {}
  @Post()
  @HttpCode(201)
  async handle(
    @CurrentDungeonMaster() dungeonMaster: DungeonMasterJwtPayload,
    @Body(bodyValidationPipe) body: BodySchema,
  ) {
    const { name, description, rpgSystem, characters } = body

    const result = await this.useCase.execute({
      dungeonMasterId: dungeonMaster.sub,
      name,
      description,
      rpgSystem,
      characters,
    })

    if (result.type === 'failure') {
      const error = result.value

      switch (error.constructor) {
        case NotFoundError:
          throw new NotFoundException({
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
  }
}
