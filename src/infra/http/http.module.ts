import { Module } from '@nestjs/common'

import { AuthenticateDungeonMasterUseCase } from '@/domain/storytellers/application/use-cases/authenticate-dungeon-master'
import { CreateCampaignUseCase } from '@/domain/storytellers/application/use-cases/create-campaign'
import { CreateDungeonMasterAccountUseCase } from '@/domain/storytellers/application/use-cases/create-dungeon-master-account'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateDungeonMasterController } from './controllers/authenticate-dungeon-master'
import { CreateDungeonMasterAccountController } from './controllers/create–dungeon-master-account'
import { CreateCampaignController } from './controllers/create-campaign'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateDungeonMasterAccountController,
    AuthenticateDungeonMasterController,
    CreateCampaignController,
  ],
  providers: [
    CreateDungeonMasterAccountUseCase,
    AuthenticateDungeonMasterUseCase,
    CreateCampaignUseCase,
  ],
})
export class HttpModule {}
