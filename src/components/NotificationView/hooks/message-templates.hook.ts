import { useState, useEffect } from "react";
import { AppError } from "@/common/error";
import { AppToast } from "@/common/ui/toast";
import { MessageTemplatesApi } from "@/domains/message-templates/client-api";
import { MessageTemplate1 } from "@/domains/message-templates/entities";


export function useMessageTemplates() {

  const [ isLoading, setIsLoading ] = useState(false);
  const [ messageTemplates, setMessageTemplates ] = useState<MessageTemplate1[]>([]);

  useEffect(() => {

    const execute = async () => {

      setIsLoading(true);

      try {
        const api = new MessageTemplatesApi();

        const messageTemplatesResult = await api.getAll({
          offset: 0,
          limit: 999
        });

        setMessageTemplates(messageTemplatesResult.data);
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
    messageTemplates
  };
}
