import { Group as GroupDb } from "@prisma/client";
import { Group } from "./entities";

export class GroupMapper {

  public mapFromDb(groupDb: GroupDb): Group {

    const group: Group = {
      id: groupDb.id,
      name: groupDb.name,
      color: groupDb.color
    };

    return group;
  }
}