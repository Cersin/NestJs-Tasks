import { Injectable } from '@nestjs/common';
import { MessageFormatterService } from '../message-formatter/message-formatter.service';

@Injectable()
export class LoggerService {
  constructor(private readonly messageFormatter: MessageFormatterService) {}

  public log(message: string): string {
    return this.messageFormatter.format(message);
  }
}
