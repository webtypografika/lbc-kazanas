import bcrypt from "bcryptjs";
import { getSession } from "./session";
import { redirect } from "next/navigation";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    redirect("/admin/login");
  }
  return session;
}
