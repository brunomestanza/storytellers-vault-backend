import { faker } from '@faker-js/faker'
import { makeDungeonMaster } from 'test/factories/make-dungeon-master'

import { FakeEncrypter } from '../../cryptography/tests/fake-encypter'
import { FakeHasher } from '../../cryptography/tests/fake-hasher'
import { InMemoryDungeonMastersRepository } from '../../repositories/tests/in-memory-dungeon-masters-repository'
import { CreateDungeonMasterAccountUseCase } from '../create-dungeon-master-account'
import { EmailAlreadyExists } from '../errors/email-already-exists'

let inMemoryDungeonMastersRepository: InMemoryDungeonMastersRepository
let fakeHashGenerator: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: CreateDungeonMasterAccountUseCase

describe('Create dungeon master account', () => {
  beforeEach(() => {
    inMemoryDungeonMastersRepository = new InMemoryDungeonMastersRepository()
    fakeHashGenerator = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new CreateDungeonMasterAccountUseCase(
      inMemoryDungeonMastersRepository,
      fakeHashGenerator,
      fakeEncrypter,
    )
  })

  it('should be able to create an dungeon master account', async () => {
    const result = await sut.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    })

    expect(result.type).toBe('success')
    if (result.type === 'success') {
      expect(inMemoryDungeonMastersRepository.items[0]).toEqual(
        result.value?.dungeonMaster,
      )
      expect(result.value?.accessToken).toBeTruthy()
    }
  })

  it('should hash dungeon master password upon registration', async () => {
    const result = await sut.execute({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: '123456',
    })

    const hashedPassword = await fakeHashGenerator.hash('123456')

    expect(result.type).toBe('success')
    if (result.type === 'success') {
      expect(inMemoryDungeonMastersRepository.items[0].password).toEqual(
        hashedPassword,
      )
    }
  })

  it('should not be able to create an dungeon master with an email in use', async () => {
    const dungeonMaster = makeDungeonMaster()

    inMemoryDungeonMastersRepository.items.push(dungeonMaster)

    const result = await sut.execute({
      name: dungeonMaster.name,
      email: dungeonMaster.email,
      password: dungeonMaster.password,
    })

    expect(result.type).toBe('failure')
    expect(result.value).toBeInstanceOf(EmailAlreadyExists)
  })
})
