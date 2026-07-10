export interface ApplyPayload {
  name: string;
  email: string;
  background: "engineer" | "designer" | "founder" | "analyst" | "other";
  message: string;
}

export async function submitApplication(
  payload: ApplyPayload
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const res = await fetch("/api/apply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = (await res.json()) as { error?: string };
    return { ok: false, error: data.error ?? "Submission failed" };
  }
  const data = (await res.json()) as { ok: boolean; id?: string };
  return { ok: true, id: data.id };
}
