import { Controller, Get, Query, Res } from '@nestjs/common';
import { YtldService } from './ytld.service';
import { Response } from 'express';

@Controller('ytdl')
export class YtldController {
  constructor(private readonly ytldService: YtldService) {}
  @Get('/mp3')
  async downloadAudio(@Query('url') url: string, @Res() res: Response) {
    return await this.ytldService.downloadAudio(url, res);
  }
}
