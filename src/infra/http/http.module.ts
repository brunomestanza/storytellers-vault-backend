import { Module } from '@nestjs/common'

import { AuthenticateDungeonMasterUseCase } from '@/domain/storytellers/application/use-cases/authenticate-dungeon-master'
import { CreateDungeonMasterAccountUseCase } from '@/domain/storytellers/application/use-cases/create-dungeon-master-account'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateDungeonMasterController } from './controllers/authenticate-dungeon-master'
import { CreateDungeonMasterAccountController } from './controllers/create–dungeon-master-account'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateDungeonMasterAccountController,
    AuthenticateDungeonMasterController,
  ],
  providers: [
    CreateDungeonMasterAccountUseCase,
    AuthenticateDungeonMasterUseCase,
  ],
})
export class HttpModule {}
