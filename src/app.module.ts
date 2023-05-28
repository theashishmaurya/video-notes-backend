import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { YtldModule } from './ytld/ytld.module';
import { OpenaiService } from './openai/openai.service';

@Module({
  imports: [YtldModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
