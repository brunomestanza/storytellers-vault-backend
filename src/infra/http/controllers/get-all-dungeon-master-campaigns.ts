import { Controller, Get, HttpCode } from '@nestjs/common'

import { GetAllDungeonMasterCampaignsUseCase } from '@/domain/storytellers/application/use-cases/get-all-dungeon-master-campaigns'
import { CurrentDungeonMaster } from '@/infra/auth/current-dungeon-master-decorator'
import { DungeonMasterJwtPayload } from '@/infra/auth/jwt.strategy'

import { CampaignPresenter } from '../presenters/campaign-presenter'

@Controller('/dungeon-masters/all/campaigns')
export class GetAllDungeonMasterCampaignsController {
  constructor(private useCase: GetAllDungeonMasterCampaignsUseCase) {}
  @Get()
  @HttpCode(200)
  async handle(@CurrentDungeonMaster() dungeonMaster: DungeonMasterJwtPayload) {
    const result = await this.useCase.execute({
      dungeonMasterId: dungeonMaster.sub,
    })

    return {
      campaigns: result.value.campaigns.map(CampaignPresenter.toHttp),
    }
  }
}
