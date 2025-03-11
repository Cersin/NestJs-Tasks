export class MessageFormatterService {
  public format(message: string): string {
    const timeStamp = new Date().toISOString();

    return `[${timeStamp}] ${message}`;
  }
}
