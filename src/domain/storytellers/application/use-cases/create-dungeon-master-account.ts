import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/types/either'

import { DungeonMaster } from '../../enterprise/entities/dungeon-master'
import { Encrypter } from '../cryptography/encrypter'
import { HashGenerator } from '../cryptography/hash-generator'
import { DungeonMastersRepository } from '../repositories/dungeon-masters'
import { EmailAlreadyExists } from './errors/email-already-exists'

interface CreateDungeonMasterAccountUseCaseRequest {
  name: string
  email: string
  password: string
}

type CreateDungeonMasterAccountUseCaseResponse = Either<
  EmailAlreadyExists,
  { dungeonMaster: DungeonMaster; accessToken: string }
>

@Injectable()
export class CreateDungeonMasterAccountUseCase {
  constructor(
    private dungeonMastersRepository: DungeonMastersRepository,
    private hashGenerator: HashGenerator,
    private encrypter: Encrypter,
  ) {}

  async execute({
    name,
    email,
    password,
  }: CreateDungeonMasterAccountUseCaseRequest): Promise<CreateDungeonMasterAccountUseCaseResponse> {
    const dungeonMasterWithEmail =
      await this.dungeonMastersRepository.findByEmail(email)

    if (dungeonMasterWithEmail) {
      return failure(new EmailAlreadyExists())
    }

    const dungeonMaster = DungeonMaster.create({
      name,
      email,
      password: await this.hashGenerator.hash(password),
    })

    await this.dungeonMastersRepository.create(dungeonMaster)

    const accessToken = await this.encrypter.encrypt({
      sub: dungeonMaster.id.toString(),
    })

    return success({ dungeonMaster, accessToken })
  }
}
