import { Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { OpenAIApi, Configuration } from 'openai';
import { resolve } from 'path';

@Injectable()
export class OpenaiService {
  private openai: OpenAIApi;

  constructor() {
    const config = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(config);
  }

  async transcribeAudio(audio: Buffer) {
    //Convert audio to file  and send to openai

    const file = new Blob([audio], { type: 'audio/mp3' });
    const audioFile = new File([file], 'audio.mp3', { type: 'audio/mp3' });

    try {
      const transcribe = await this.openai.createTranscription(
        audioFile,
        'whisper-1',
      );
      console.log('Transcribe', transcribe);
      return transcribe.data[0].text;
    } catch (error) {
      throw new Error(error);
    }
  }
}
