import { Module } from '@nestjs/common';
import { YtldController } from './ytld.controller';
import { YtldService } from './ytld.service';

@Module({
  controllers: [YtldController],
  providers: [YtldService],
})
export class YtldModule {}
