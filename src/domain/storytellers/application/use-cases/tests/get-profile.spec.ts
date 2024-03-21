import { makeDungeonMaster } from 'test/factories/make-dungeon-master'

import { InMemoryDungeonMastersRepository } from '../../repositories/tests/in-memory-dungeon-masters-repository'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import { GetDungeonMasterProfileUseCase } from '../get-dungeon-master-profile'

let inMemoryDungeonMastersRepository: InMemoryDungeonMastersRepository
let sut: GetDungeonMasterProfileUseCase

describe('Get dungeon master profile', () => {
  beforeEach(() => {
    inMemoryDungeonMastersRepository = new InMemoryDungeonMastersRepository()

    sut = new GetDungeonMasterProfileUseCase(inMemoryDungeonMastersRepository)
  })

  it('should be able to get dungeon master profile', async () => {
    const dungeonMaster = makeDungeonMaster()

    inMemoryDungeonMastersRepository.items.push(dungeonMaster)

    const result = await sut.execute({
      dungeonMasterId: dungeonMaster.id.toString(),
    })

    expect(result.type).toBe('success')
    expect(result.value).toEqual({
      dungeonMaster,
    })
  })

  it('should not be able to get dungeon master profile with invalid dungeonMasterId', async () => {
    const result = await sut.execute({
      dungeonMasterId: 'invalid-dungeon-master-id',
    })

    expect(result.type).toBe('failure')
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})
