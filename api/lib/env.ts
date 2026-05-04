import "dotenv/config";

const fallbackUrl = "https://example.com";

export const env = {
  appId: process.env.APP_ID ?? "preview-app",
  appSecret: process.env.APP_SECRET ?? "preview-secret",
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: process.env.DATABASE_URL ?? "",
  kimiAuthUrl: process.env.KIMI_AUTH_URL ?? fallbackUrl,
  kimiOpenUrl: process.env.KIMI_OPEN_URL ?? fallbackUrl,
  ownerUnionId: process.env.OWNER_UNION_ID ?? "",
  previewMode:
    process.env.PREVIEW_MODE === "true" ||
    !process.env.DATABASE_URL ||
    !process.env.APP_ID ||
    !process.env.APP_SECRET ||
    !process.env.KIMI_AUTH_URL ||
    !process.env.KIMI_OPEN_URL,
};
