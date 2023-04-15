import { Controller, Get, Query, Res } from '@nestjs/common';
import * as ytdl from 'ytdl-core';
import { Response } from 'express';

@Controller('ytdl')
export class YtldController {
  @Get('/mp3')
  async downloadAudio(@Query('url') url: string, @Res() res: Response) {
    console.log(typeof url, url);

    if (!url) {
      res.status(400).send('URL is not a string');
    }

    try {
      const video = ytdl(url, {
        filter: 'audioonly',
        quality: 'highestaudio',
      });

      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Disposition', 'attachment; filename=audio.mp3');

      video.pipe(res);
    } catch (error) {
      console.log(error);
      res.status(400).send('Failed to get audio from url');
    }
  }
}
