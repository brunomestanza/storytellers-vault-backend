import { makeDungeonMaster } from 'test/factories/make-dungeon-master'

import { FakeEncrypter } from '../../cryptography/tests/fake-encypter'
import { FakeHasher } from '../../cryptography/tests/fake-hasher'
import { InMemoryDungeonMastersRepository } from '../../repositories/tests/in-memory-dungeon-masters-repository'
import { AuthenticateDungeonMasterUseCase } from '../authenticate-dungeon-master'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

let inMemoryDungeonMastersRepository: InMemoryDungeonMastersRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter
let sut: AuthenticateDungeonMasterUseCase

describe('Authenticate dungeon master', () => {
  beforeEach(() => {
    inMemoryDungeonMastersRepository = new InMemoryDungeonMastersRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    sut = new AuthenticateDungeonMasterUseCase(
      inMemoryDungeonMastersRepository,
      fakeHasher,
      encrypter,
    )
  })

  it('should be able to authenticate an dungeon master and get an access_token', async () => {
    const dungeonMaster = makeDungeonMaster({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryDungeonMastersRepository.items.push(dungeonMaster)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.type).toBe('success')
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate an dungeon master with invalid email', async () => {
    const dungeonMaster = makeDungeonMaster({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryDungeonMastersRepository.items.push(dungeonMaster)

    const result = await sut.execute({
      email: 'invalid-email',
      password: '123456',
    })

    expect(result.type).toBe('failure')
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate an dungeon master with invalid password', async () => {
    const dungeonMaster = makeDungeonMaster({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryDungeonMastersRepository.items.push(dungeonMaster)

    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: 'invalid password',
    })

    expect(result.type).toBe('failure')
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})
