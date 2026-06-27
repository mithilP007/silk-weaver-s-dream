export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function safeFetchJson(response: Response): Promise<any> {
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(
      `Server responded with non-JSON format (status ${response.status}): ${text.substring(0, 100)}`
    );
  }
  return response.json();
}
