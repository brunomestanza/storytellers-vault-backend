import { Injectable } from '@nestjs/common'

import { Either, success } from '@/core/types/either'

import { Campaign } from '../../enterprise/entities/campaign'
import { CampaignsRepository } from '../repositories/campaigns'

interface GetAllDungeonMasterCampaignsUseCaseRequest {
  dungeonMasterId: string
}

type GetAllDungeonMasterCampaignsUseCaseResponse = Either<
  never,
  { campaigns: Campaign[] }
>

@Injectable()
export class GetAllDungeonMasterCampaignsUseCase {
  constructor(private campaignsRepository: CampaignsRepository) {}

  async execute({
    dungeonMasterId,
  }: GetAllDungeonMasterCampaignsUseCaseRequest): Promise<GetAllDungeonMasterCampaignsUseCaseResponse> {
    const campaigns =
      await this.campaignsRepository.findByDungeonMasterId(dungeonMasterId)

    return success({ campaigns })
  }
}
