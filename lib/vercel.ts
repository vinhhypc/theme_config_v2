import { missingKey, HttpError } from "./api-error";

const PLACEHOLDER = "your_vercel_token_here";

export function resolveVercelToken(): string | null {
  const candidate = (process.env.VERCEL_API_TOKEN || "").trim();
  if (!candidate || candidate === PLACEHOLDER) return null;
  return candidate;
}

export interface DeployFile {
  path: string;
  content: string;
}

export interface DeployResult {
  deploymentId: string;
  url: string;
  status: string;
}

/**
 * Create a Vercel deployment from inline files via the REST API.
 * Throws a friendly HttpError when the token is missing.
 */
export async function createDeployment(projectName: string, files: DeployFile[]): Promise<DeployResult> {
  const token = resolveVercelToken();
  if (!token) throw missingKey("Vercel");

  const teamId = (process.env.VERCEL_TEAM_ID || "").trim();
  const query = teamId ? `?teamId=${encodeURIComponent(teamId)}` : "";

  const body = {
    name: projectName,
    files: files.map((f) => ({ file: f.path, data: f.content })),
    projectSettings: { framework: null },
    target: "preview" as const,
  };

  const res = await fetch(`https://api.vercel.com/v13/deployments${query}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    const message =
      (json?.error as { message?: string } | undefined)?.message ?? `Vercel API returned ${res.status}`;
    throw new HttpError(res.status, "vercel_error", message);
  }

  const id = String(json.id ?? "");
  const url = json.url ? `https://${json.url}` : "";
  const status = String(json.readyState ?? json.status ?? "queued").toLowerCase();
  return { deploymentId: id, url, status };
}

/** Poll a deployment's status. */
export async function getDeploymentStatus(deploymentId: string): Promise<DeployResult> {
  const token = resolveVercelToken();
  if (!token) throw missingKey("Vercel");
  const teamId = (process.env.VERCEL_TEAM_ID || "").trim();
  const query = teamId ? `?teamId=${encodeURIComponent(teamId)}` : "";

  const res = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    const message = (json?.error as { message?: string } | undefined)?.message ?? `Vercel API returned ${res.status}`;
    throw new HttpError(res.status, "vercel_error", message);
  }
  return {
    deploymentId,
    url: json.url ? `https://${json.url}` : "",
    status: String(json.readyState ?? json.status ?? "queued").toLowerCase(),
  };
}
