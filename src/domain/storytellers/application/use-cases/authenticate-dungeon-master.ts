import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/types/either'

import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { DungeonMastersRepository } from '../repositories/dungeon-masters'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

interface AuthenticateDungeonMasterUseCaseRequest {
  email: string
  password: string
}

type AuthenticateDungeonMasterUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateDungeonMasterUseCase {
  constructor(
    private dungeonMastersRepository: DungeonMastersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateDungeonMasterUseCaseRequest): Promise<AuthenticateDungeonMasterUseCaseResponse> {
    const dungeonmaster = await this.dungeonMastersRepository.findByEmail(email)

    if (!dungeonmaster) {
      return failure(new InvalidCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      dungeonmaster.password,
    )

    if (!isPasswordValid) {
      return failure(new InvalidCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: dungeonmaster.id.toString(),
    })

    return success({
      accessToken,
    })
  }
}
