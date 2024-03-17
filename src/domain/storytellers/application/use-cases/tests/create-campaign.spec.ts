import { makeDungeonMaster } from 'test/factories/make-dungeon-master'

import { InMemoryCampaignsRepository } from '../../repositories/tests/in-memory-campaigns-repository'
import { InMemoryDungeonMastersRepository } from '../../repositories/tests/in-memory-dungeon-masters-repository'
import { CreateCampaignUseCase } from '../create-campaign'
import { NotFoundError } from '../errors/not-found'

let inMemoryDungeonMastersRepository: InMemoryDungeonMastersRepository
let inMemoryCampaignsRepository: InMemoryCampaignsRepository
let sut: CreateCampaignUseCase

describe('Create campaign', () => {
  beforeEach(() => {
    inMemoryDungeonMastersRepository = new InMemoryDungeonMastersRepository()
    inMemoryCampaignsRepository = new InMemoryCampaignsRepository()

    sut = new CreateCampaignUseCase(
      inMemoryDungeonMastersRepository,
      inMemoryCampaignsRepository,
    )
  })

  it('should be able to create an campaign', async () => {
    const dungeonMaster = makeDungeonMaster()

    inMemoryDungeonMastersRepository.items.push(dungeonMaster)

    const result = await sut.execute({
      name: 'Vecna appears!',
      description: 'Vecna show all the evil he has in this campaign.',
      dungeonMasterId: dungeonMaster.id.toString(),
      rpgSystem: 'Dungeons and Dragons 5e',
      characters: [
        {
          name: 'Oromis, the Wizard',
          initiativeRollBonus: 2,
          actualLifePoints: 10,
          maxLifePoints: 20,
        },
      ],
    })

    expect(result.type).toBe('success')

    if (result.type === 'success') {
      expect(result.value).toEqual({
        campaign: expect.objectContaining({ name: 'Vecna appears!' }),
      })
    }
  })

  it('should not be able to create an campaign with invalid dungeonMasterId', async () => {
    const result = await sut.execute({
      name: 'Vecna appears!',
      description: 'Vecna show all the evil he has in this campaign.',
      dungeonMasterId: 'fake-dungeon-master-id',
      rpgSystem: 'Dungeons and Dragons 5e',
      characters: [],
    })

    expect(result.type).toBe('failure')
    expect(result.value).toBeInstanceOf(NotFoundError)
  })
})
