import { toast } from 'react-toastify';

export class AppToast {

  public static info(message: string) {

    AppToast.toast(message);
  }

  public static success(message: string) {

    AppToast.toast(message);
  }

  public static warning(message: string) {

    AppToast.toast(message);
  }

  public static error(message: string) {

    AppToast.toast(message);
  }

  private static toast(message: string) {

    toast(message, {

    });
  }
}