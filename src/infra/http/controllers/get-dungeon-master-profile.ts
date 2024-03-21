import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common'

import { InvalidCredentialsError } from '@/domain/storytellers/application/use-cases/errors/invalid-credentials-error'
import { GetDungeonMasterProfileUseCase } from '@/domain/storytellers/application/use-cases/get-dungeon-master-profile'
import { CurrentDungeonMaster } from '@/infra/auth/current-dungeon-master-decorator'
import { DungeonMasterJwtPayload } from '@/infra/auth/jwt.strategy'

import { DungeonMasterPresenter } from '../presenters/dungeon-master-presenter'

@Controller('/me')
export class GetDungeonMasterProfileController {
  constructor(private useCase: GetDungeonMasterProfileUseCase) {}
  @Get()
  @HttpCode(200)
  async handle(@CurrentDungeonMaster() dungeonMaster: DungeonMasterJwtPayload) {
    const result = await this.useCase.execute({
      dungeonMasterId: dungeonMaster.sub,
    })

    if (result.type === 'failure') {
      const error = result.value

      switch (error.constructor) {
        case InvalidCredentialsError:
          throw new UnauthorizedException({
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

    return {
      profile: DungeonMasterPresenter.toHttp(result.value.dungeonMaster),
    }
  }
}
