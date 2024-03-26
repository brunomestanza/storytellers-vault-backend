import { makeCampaignWithCharacters } from 'test/factories/make-campaign-with-characters'
import { makeDungeonMaster } from 'test/factories/make-dungeon-master'

import { InMemoryCampaignsRepository } from '../../repositories/tests/in-memory-campaigns-repository'
import { InMemoryDungeonMastersRepository } from '../../repositories/tests/in-memory-dungeon-masters-repository'
import { GetAllDungeonMasterCampaignsUseCase } from '../get-all-dungeon-master-campaigns'

let inMemoryCampaignsRepository: InMemoryCampaignsRepository
let inMemoryDungeonMastersRepository: InMemoryDungeonMastersRepository
let sut: GetAllDungeonMasterCampaignsUseCase

describe('Get all dungeon master campaigns', () => {
  beforeEach(() => {
    inMemoryCampaignsRepository = new InMemoryCampaignsRepository()
    inMemoryDungeonMastersRepository = new InMemoryDungeonMastersRepository()

    sut = new GetAllDungeonMasterCampaignsUseCase(inMemoryCampaignsRepository)
  })

  it('should be able to get all dungeon master campaigns', async () => {
    const dungeonMaster = makeDungeonMaster()
    const campaign = makeCampaignWithCharacters({
      dungeonMasterId: dungeonMaster.id,
    })

    inMemoryDungeonMastersRepository.items.push(dungeonMaster)
    inMemoryCampaignsRepository.items.push(campaign)

    const result = await sut.execute({
      dungeonMasterId: dungeonMaster.id.toString(),
    })

    expect(result.type).toBe('success')
    expect(result.value?.campaigns[0]).toBe(campaign)
  })

  it('should return an empty array if the dungeon master dont have any campaigns', async () => {
    const result = await sut.execute({
      dungeonMasterId: 'an-dungeon-master-without-campaigns',
    })

    expect(result.type).toBe('success')
    expect(result.value?.campaigns).toHaveLength(0)
  })
})
