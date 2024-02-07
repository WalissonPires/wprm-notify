

export class Masks {
  public static phoneNine = '(99) 99999-9999';
  public static phone = '(99) 9999-99999';
}

export class MasksUtils {
  public static getPhoneMaskFromMasked(phoneMasked: string) {

    return phoneMasked.length > 14 ? Masks.phoneNine : Masks.phone;
  }

  public static getPhoneMaskFromPlan(phonePlan: string) {

    return phonePlan.length > 10 ? Masks.phoneNine : Masks.phone;
  }
}