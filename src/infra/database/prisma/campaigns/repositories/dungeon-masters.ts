import { Injectable } from '@nestjs/common'

import { DungeonMastersRepository } from '@/domain/storytellers/application/repositories/dungeon-masters'
import { DungeonMaster } from '@/domain/storytellers/enterprise/entities/dungeon-master'

import { PrismaService } from '../../prisma.service'
import { PrismaDungeonMasterMapper } from '../mappers/dungeon-masters-mapper'

@Injectable()
export class PrismaDungeonMastersRepository
  implements DungeonMastersRepository
{
  constructor(private prisma: PrismaService) {}

  async create(dungeonMaster: DungeonMaster): Promise<void> {
    await this.prisma.dungeonMaster.create({
      data: PrismaDungeonMasterMapper.toPrisma(dungeonMaster),
    })
  }

  async findById(id: string): Promise<DungeonMaster | null> {
    const dungeonMaster = await this.prisma.dungeonMaster.findUnique({
      where: { id },
    })

    if (!dungeonMaster) {
      return null
    }

    return PrismaDungeonMasterMapper.toDomain(dungeonMaster)
  }

  async findByEmail(email: string): Promise<DungeonMaster | null> {
    const dungeonMaster = await this.prisma.dungeonMaster.findUnique({
      where: { email },
    })

    if (!dungeonMaster) {
      return null
    }

    return PrismaDungeonMasterMapper.toDomain(dungeonMaster)
  }
}
