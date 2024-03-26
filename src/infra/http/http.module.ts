import { Module } from '@nestjs/common'

import { AuthenticateDungeonMasterUseCase } from '@/domain/storytellers/application/use-cases/authenticate-dungeon-master'
import { CreateCampaignUseCase } from '@/domain/storytellers/application/use-cases/create-campaign'
import { CreateDungeonMasterAccountUseCase } from '@/domain/storytellers/application/use-cases/create-dungeon-master-account'
import { GetAllDungeonMasterCampaignsUseCase } from '@/domain/storytellers/application/use-cases/get-all-dungeon-master-campaigns'
import { GetDungeonMasterProfileUseCase } from '@/domain/storytellers/application/use-cases/get-dungeon-master-profile'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateDungeonMasterController } from './controllers/authenticate-dungeon-master'
import { CreateDungeonMasterAccountController } from './controllers/create–dungeon-master-account'
import { CreateCampaignController } from './controllers/create-campaign'
import { GetAllDungeonMasterCampaignsController } from './controllers/get-all-dungeon-master-campaigns'
import { GetDungeonMasterProfileController } from './controllers/get-dungeon-master-profile'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateDungeonMasterAccountController,
    AuthenticateDungeonMasterController,
    CreateCampaignController,
    GetDungeonMasterProfileController,
    GetAllDungeonMasterCampaignsController,
  ],
  providers: [
    CreateDungeonMasterAccountUseCase,
    AuthenticateDungeonMasterUseCase,
    CreateCampaignUseCase,
    GetDungeonMasterProfileUseCase,
    GetAllDungeonMasterCampaignsUseCase,
  ],
})
export class HttpModule {}
