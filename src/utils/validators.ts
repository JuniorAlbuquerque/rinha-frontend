export const isJSONFile = (value: string) => {
  return value.includes(".json");
};

export function isNumeric(str: string) {
  if (typeof str != "string") return false;
  return !isNaN(Number(str)) && !isNaN(parseFloat(str));
}

export function isString<T>(str: T) {
  return typeof str === "string";
}

export function isClosedBlock(str: string) {
  return ["]", "}"].includes(str);
}
