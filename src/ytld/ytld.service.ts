import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { OpenaiService } from 'src/openai/openai.service';
import * as ytdl from 'ytdl-core';

@Injectable()
export class YtldService {
  constructor(private readonly openaiService: OpenaiService) {}
  async downloadAudio(url: string, res: Response) {
    try {
      const videoUrl = url;
      const videoInfo = await ytdl.getInfo(videoUrl);
      const videoFileName = `${videoInfo.videoDetails.title}.mp3`;
      const length = +videoInfo.videoDetails.lengthSeconds; // Total video length in seconds.
      const chunksize = 600; // 10 minutes
      let start = 0;
      let end = chunksize;
      console.log('Video length', length);
      const chunks: Buffer[] = [];

      const handleChunkDownload = async () => {
        console.log('Downloading chunk', start, 'to', end);
        try {
          const videoReadableStream = ytdl(videoUrl, {
            range: { start, end },
            quality: 'highestaudio',
            filter: 'audioonly',
          });

          // const videoFileName = `${videoInfo.videoDetails.title}.mp3`;
          // res.setHeader('Content-Type', 'audio/mpeg');
          // res.setHeader(
          //   'Content-Disposition',
          //   `attachment; filename="${videoFileName}"`,
          // );
          videoReadableStream.on('data', (chunk) => {
            console.log('Writing chunk', start, 'to', end);
            chunks.push(chunk);
          });

          videoReadableStream.on('end', () => {
            console.log('Finished downloading chunk', start, 'to', end);

            try {
              const audioBuffer = chunks.shift();

              this.openaiService
                .transcribeAudio(audioBuffer)
                .then((transcription) => {
                  console.log('Transcription', transcription);
                  res.write(transcription);
                });
            } catch (error) {
              res
                .status(500)
                .send('An error occurred while transcribing the video.');
            }
          });

          if (end < length) {
            start = end;
            end = chunksize + end > length ? length : end + chunksize;
            console.log('Next chunk', start, 'to', end);
            handleChunkDownload();
          } else {
            res.end();
          }
        } catch (error) {
          res
            .status(500)
            .send('An error occurred while downloading the video.');
        }
      };
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${videoFileName}"`,
      );

      handleChunkDownload();
    } catch (error) {
      res.status(500).send('An error occurred while downloading the video.');
    }
  }
}
