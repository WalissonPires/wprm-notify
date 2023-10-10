import { nanoid } from "nanoid/non-secure";

export class IdGenerator {

  public new() {

    return nanoid(26);
  }
}