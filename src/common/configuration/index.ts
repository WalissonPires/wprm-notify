import { AppError } from "../error";

export class AppConfig {

  public SendMessageApiUrl() {

    const url = process.env.NEXT_PUBLIC_SEND_MESSAGE_API_URL;
    if (!url)
      throw new AppError('NEXT_PUBLIC_SEND_MESSAGE_API_URL is empty');

    return url;
  }

  public SendMessageApiToken() {

    const token = process.env.NEXT_PUBLIC_SEND_MESSAGE_API_TOKEN;
    if (!token)
      throw new AppError('NEXT_PUBLIC_SEND_MESSAGE_API_TOKEN is empty');

    return token;
  }
}