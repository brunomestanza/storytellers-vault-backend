import { Module } from '@nestjs/common'

import { DungeonMastersRepository } from '@/domain/storytellers/application/repositories/dungeon-masters'

import { PrismaDungeonMastersRepository } from './prisma/campaigns/repositories/dungeon-masters'
import { PrismaService } from './prisma/prisma.service'

@Module({
  providers: [
    PrismaService,
    {
      provide: DungeonMastersRepository,
      useClass: PrismaDungeonMastersRepository,
    },
  ],
  exports: [PrismaService, DungeonMastersRepository],
})
export class DatabaseModule {}
