import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/types/either'

import { DungeonMaster } from '../../enterprise/entities/dungeon-master'
import { DungeonMastersRepository } from '../repositories/dungeon-masters'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

interface GetDungeonMasterProfileUseCaseRequest {
  dungeonMasterId: string
}

type GetDungeonMasterProfileUseCaseResponse = Either<
  InvalidCredentialsError,
  { dungeonMaster: DungeonMaster }
>

@Injectable()
export class GetDungeonMasterProfileUseCase {
  constructor(private dungeonMastersRepository: DungeonMastersRepository) {}

  async execute({
    dungeonMasterId,
  }: GetDungeonMasterProfileUseCaseRequest): Promise<GetDungeonMasterProfileUseCaseResponse> {
    const dungeonMaster =
      await this.dungeonMastersRepository.findById(dungeonMasterId)

    if (!dungeonMaster) {
      return failure(new InvalidCredentialsError())
    }

    return success({ dungeonMaster })
  }
}
