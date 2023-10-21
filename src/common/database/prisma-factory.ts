
import { PrismaClient } from "@prisma/client";

export class PrismaClientFactory {

  private static _prismaClient: PrismaClient;

  public static create() {

    if (this._prismaClient)
      return this._prismaClient;

    this._prismaClient = new PrismaClient({
      log: [
        { level: "query", emit: "event" },
        { level: 'info', emit: 'event' },
        { level: 'warn', emit: 'event' },
        { level: 'error', emit: 'event' },
      ]
    });

    // this._prismaClient.$on("query", (event: any) => {
    //     logger.debug("Query: " + event.query);
    //     logger.debug("Duracao: " + event.duration + ' ms');
    // });

    // this._prismaClient.$on('info', (event: any) => {
    //     logger.info(event.message);
    // });

    // this._prismaClient.$on('warn', (event: any) => {
    //     logger.warning(event.message);
    // });

    // this._prismaClient.$on('error', (event: any) => {
    //     logger.error(event.message);
    // });

    return this._prismaClient;
  }
}