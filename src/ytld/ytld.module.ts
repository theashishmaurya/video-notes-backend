import { Module } from '@nestjs/common';
import { YtldController } from './ytld.controller';

@Module({
  controllers: [YtldController],
  providers: [],
})
export class YtldModule {}
