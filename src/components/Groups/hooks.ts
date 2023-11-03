import { useState, useEffect } from "react";
import { AppError } from "@/common/error";
import { AppToast } from "@/common/ui/toast";
import { Group } from "@/domains/groups/entities";
import { GroupsApi } from "@/domains/groups/client-api";


export function useGroups() {

  const [ isLoading, setIsLoading ] = useState(false);
  const [ groups, setGroups ] = useState<Group[]>([]);

  useEffect(() => {

    const execute = async () => {

      setIsLoading(true);

      try {
        const api = new GroupsApi();

        const groupsResult = await api.getAll({
          offset: 0,
          limit: 999
        });

        setGroups(groupsResult.data);
      }
      catch(e) {

        const error = AppError.parse(e);
        AppToast.error(error.message);
      }
      finally {
        setIsLoading(false);
      }
    };

    execute();

  }, []);

  return {
    isLoading,
    groups
  };
}
