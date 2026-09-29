export function hasSprintReflection(inputData: unknown): boolean {
  if (!inputData || typeof inputData !== "object" || Array.isArray(inputData)) return false;
  const reflection = (inputData as Record<string, unknown>).reflection;
  return typeof reflection === "string" && reflection.trim().length >= 5;
}
