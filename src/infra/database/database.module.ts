import { Module } from '@nestjs/common'

import { CampaignsRepository } from '@/domain/storytellers/application/repositories/campaigns'
import { DungeonMastersRepository } from '@/domain/storytellers/application/repositories/dungeon-masters'

import { PrismaCampaignsRepository } from './prisma/campaigns/repositories/campaigns'
import { PrismaDungeonMastersRepository } from './prisma/campaigns/repositories/dungeon-masters'
import { PrismaService } from './prisma/prisma.service'

@Module({
  providers: [
    PrismaService,
    {
      provide: DungeonMastersRepository,
      useClass: PrismaDungeonMastersRepository,
    },
    {
      provide: CampaignsRepository,
      useClass: PrismaCampaignsRepository,
    },
  ],
  exports: [PrismaService, DungeonMastersRepository, CampaignsRepository],
})
export class DatabaseModule {}
