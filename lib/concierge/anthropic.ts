import { validateMeeraEnv, getMeeraModel } from "@/lib/env-check";

validateMeeraEnv();

export const MEERA_MODEL = getMeeraModel();
export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY as string;
