import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as ytdl from 'ytdl-core';

@Injectable()
export class YtldService {
  async downloadAudio(url: string, res: Response) {
    try {
      const videoUrl = url;
      const videoInfo = await ytdl.getInfo(videoUrl);
      const videoReadableStream = ytdl(videoUrl, {
        quality: 'highestaudio',
        filter: 'audioonly',
      });
      const videoFileName = `${videoInfo.videoDetails.title}.mp3`;
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${videoFileName}"`,
      );
      videoReadableStream.pipe(res);
    } catch (error) {
      res.status(500).send('An error occurred while downloading the video.');
    }
  }
}
