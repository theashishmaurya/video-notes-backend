import { Module } from '@nestjs/common';
import { YtldController } from './ytld.controller';
import { YtldService } from './ytld.service';
import { OpenaiService } from 'src/openai/openai.service';

@Module({
  controllers: [YtldController],
  providers: [YtldService, OpenaiService],
})
export class YtldModule {}
