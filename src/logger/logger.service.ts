import { Injectable } from '@nestjs/common';
import { MessageFormatterService } from 'src/message-formatter/message-formatter.service';

@Injectable()
export class LoggerService {
  constructor(private readonly messageFormatter: MessageFormatterService) {}

  public log(message: string): string {
    const formattedMessage = this.messageFormatter.format(message);
    console.log(message);
    return formattedMessage;
  }
}
