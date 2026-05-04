import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "@db/schema";
import { env } from "./lib/env";
import { authenticateRequest } from "./kimi/auth";
import { previewUser } from "./previewData";

export type TrpcContext = {
  req: Request;
  resHeaders: Headers;
  user?: User;
  previewMode: boolean;
};

export async function createContext(
  opts: FetchCreateContextFnOptions,
): Promise<TrpcContext> {
  const ctx: TrpcContext = {
    req: opts.req,
    resHeaders: opts.resHeaders,
    previewMode: env.previewMode,
  };

  if (env.previewMode) {
    ctx.user = previewUser as User;
    return ctx;
  }

  try {
    ctx.user = await authenticateRequest(opts.req.headers);
  } catch {
    // Authentication is optional here
  }
  return ctx;
}
