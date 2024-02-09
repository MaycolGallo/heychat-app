export function extractString(inputString: string, targetString: string) {
  const result = inputString.replace(targetString, "");
  return result.replace("--", "");
}
