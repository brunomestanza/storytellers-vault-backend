import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/types/either'

import { Campaign } from '../../enterprise/entities/campaign'
import { Character } from '../../enterprise/entities/character'
import { CampaignsRepository } from '../repositories/campaigns'
import { DungeonMastersRepository } from '../repositories/dungeon-masters'
import { NotFoundError } from './errors/not-found'

interface CreateCampaignUseCaseRequest {
  dungeonMasterId: string
  name: string
  description: string
  rpgSystem: string
  characters: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>[]
}

type CreateCampaignUseCaseResponse = Either<
  NotFoundError,
  { campaign: Campaign }
>

@Injectable()
export class CreateCampaignUseCase {
  constructor(
    private dungeonMastersRepository: DungeonMastersRepository,
    private campaignsRepository: CampaignsRepository,
  ) {}

  async execute({
    dungeonMasterId,
    name,
    description,
    rpgSystem,
    characters,
  }: CreateCampaignUseCaseRequest): Promise<CreateCampaignUseCaseResponse> {
    const dungeonMaster =
      await this.dungeonMastersRepository.findById(dungeonMasterId)

    if (!dungeonMaster) {
      return failure(new NotFoundError())
    }

    const entityCharacters = characters.map((character) => {
      return Character.create(character)
    })

    const campaign = Campaign.create({
      name,
      description,
      rpgSystem,
      dungeonMasterId,
      characters: entityCharacters,
    })

    await this.campaignsRepository.create(campaign)

    return success({ campaign })
  }
}
