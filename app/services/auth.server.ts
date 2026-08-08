import type { Prisma } from "@prisma/client";
import { redirect } from "react-router";
import { prisma } from "~/db.server";
import type { model } from "~/models";
import { commitSession, destroySession, getSession } from "~/services/session.server";

export interface UserSession {
  id?: string;
}

export interface UserData
  extends NonNullable<
    Prisma.PromiseReturnType<typeof model.user.query.getForSession>
  > {}

// Same storage key and shape remix-auth v3 used, so existing session cookies stay valid
const USER_KEY = "user";

async function readUserSession(
  request: Request
): Promise<UserSession | undefined> {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get(USER_KEY) as UserSession | undefined;
  return user?.id ? user : undefined;
}

export const authenticator = {
  async isAuthenticated(
    request: Request,
    options: { successRedirect?: string; failureRedirect?: string } = {}
  ): Promise<UserSession | undefined> {
    const user = await readUserSession(request);
    if (user && options.successRedirect) throw redirect(options.successRedirect);
    if (!user && options.failureRedirect) throw redirect(options.failureRedirect);
    return user;
  },

  async authenticate(
    _strategy: string,
    request: Request,
    options: { successRedirect?: string; failureRedirect?: string } = {}
  ): Promise<UserSession> {
    const user = await readUserSession(request);
    if (user) {
      if (options.successRedirect) throw redirect(options.successRedirect);
      return user;
    }

    // Mirrors the old FormStrategy: read the submitted username, look up the
    // user, and store { id } in the session. Password verification already
    // happened in the route action (model.user.mutation.login) before this is
    // ever called.
    const formData = await request.formData();
    const username = String(formData.get("username") ?? "");

    const dbUser = await prisma.user.findUnique({
      where: { username },
    });
    if (!dbUser?.id) {
      if (options.failureRedirect) throw redirect(options.failureRedirect);
      throw new Error("User is not found");
    }

    const session = await getSession(request.headers.get("Cookie"));
    session.set(USER_KEY, { id: dbUser.id });
    const setCookie = await commitSession(session);

    if (options.successRedirect) {
      throw redirect(options.successRedirect, {
        headers: { "Set-Cookie": setCookie },
      });
    }
    return { id: dbUser.id };
  },

  async logout(
    request: Request,
    options: { redirectTo?: string } = {}
  ): Promise<never> {
    const session = await getSession(request.headers.get("Cookie"));
    session.unset(USER_KEY);
    throw redirect(options.redirectTo || "/", {
      headers: { "Set-Cookie": await destroySession(session) },
    });
  },
};
