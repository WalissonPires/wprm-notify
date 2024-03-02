

export class Masks {
  public static phoneNine = '(99) 99999-9999';
  public static phone = '(99) 9999-99999';
  public static phoneContryNine = '+99 (99) 99999-9999';
  public static phoneContry = '+99 (99) 99999-9999';
}

export class MasksUtils {
  public static getPhoneMaskFromMasked(phoneMasked: string) {

    return phoneMasked.length > 14 ? Masks.phoneNine : Masks.phone;
  }

  public static getPhoneMaskFromPlan(phonePlan: string) {

    if (phonePlan.length == 13)
      return Masks.phoneContryNine;

    if (phonePlan.length == 12)
      return Masks.phoneContryNine;

    if (phonePlan.length == 11)
      return Masks.phoneNine;

    return Masks.phone;
  }
}