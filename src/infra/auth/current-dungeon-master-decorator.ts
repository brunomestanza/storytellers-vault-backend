import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { DungeonMasterJwtPayload } from './jwt.strategy'

export const CurrentDungeonMaster = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const dungeonMaster = context.switchToHttp().getRequest().user

    return dungeonMaster as DungeonMasterJwtPayload
  },
)
