export const DEFAULT_MEERA_MODEL = "claude-sonnet-4-6";

const PLACEHOLDER_SECRETS = new Set([
  "make-a-long-random-secret",
  "change-me",
  "changeme",
  "secret",
  "your-secret-here",
]);

export class EnvValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnvValidationError";
  }
}

export function validateMeeraEnv(env: NodeJS.ProcessEnv = process.env): void {
  const errors: string[] = [];

  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    errors.push("ANTHROPIC_API_KEY is missing. Set it in .env.local (format: sk-ant-api03-...).");
  } else if (apiKey.length < 50) {
    errors.push(
      `ANTHROPIC_API_KEY is too short (${apiKey.length} chars, expected ~100). ` +
        `Real keys start with "sk-ant-api03-". Did you paste a truncated value?`,
    );
  } else if (!apiKey.startsWith("sk-ant-")) {
    errors.push(
      'ANTHROPIC_API_KEY does not start with "sk-ant-". Verify the value at https://console.anthropic.com/settings/keys.',
    );
  }

  const jwt = env.JWT_SECRET;
  if (!jwt) {
    errors.push("JWT_SECRET is missing. Generate one with: openssl rand -base64 48");
  } else if (jwt.length < 32) {
    errors.push(`JWT_SECRET is too short (${jwt.length} chars, min 32).`);
  } else if (PLACEHOLDER_SECRETS.has(jwt.toLowerCase())) {
    console.warn(
      `[env-check] JWT_SECRET looks like a placeholder ("${jwt}"). ` +
        `This is unsafe outside local dev — replace before deploying.`,
    );
  }

  const model = env.MEERA_MODEL;
  if (model !== undefined && model.trim() === "") {
    errors.push(
      `MEERA_MODEL is set but empty. Either unset it (default "${DEFAULT_MEERA_MODEL}" will be used) or set a model id.`,
    );
  }

  if (errors.length > 0) {
    throw new EnvValidationError(
      "Meera env validation failed:\n  - " + errors.join("\n  - "),
    );
  }
}

export function getMeeraModel(env: NodeJS.ProcessEnv = process.env): string {
  return env.MEERA_MODEL?.trim() || DEFAULT_MEERA_MODEL;
}

if (require.main === module) {
  try {
    validateMeeraEnv();
    console.log("[env-check] OK — Meera env vars look valid.");
    console.log(`[env-check] MEERA_MODEL = ${getMeeraModel()}`);
    process.exit(0);
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }
}
