import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthApi } from "@/domains/auth/client-api";
import { AppToast } from "@/common/ui/toast";
import { AppError } from "@/common/error";
import { AppRoutes } from "@/common/routes";
import { useLoading } from "../../Loading/hooks";

export function useMoreItem() {

  const [ visible, setVisible ] = useState(false);
  const { setLoading } = useLoading();
  const router = useRouter();

  const handleShow = () => setVisible(true);
  const handleHide = () => setVisible(false);


  const handleLogout = async () => {

    setVisible(false);
    setLoading(true);

    try {
      await new AuthApi().logout();
      router.push(AppRoutes.login());
    }
    catch(error) {
      AppToast.error(AppError.parse(error).message);
    }
    finally {
      setLoading(false);
    }
  }

  return {
    visible,
    handleShow,
    handleHide,
    handleLogout
  };
}