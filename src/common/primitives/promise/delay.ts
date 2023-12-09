

export function delay(durationMilesconds: number) {

  return new Promise(resolver => {
    setTimeout(resolver, durationMilesconds)
  });
}