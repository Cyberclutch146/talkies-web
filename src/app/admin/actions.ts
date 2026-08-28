"use server";

export async function verifyPassword(password: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword) {
    return { success: false, error: "Server misconfigured (missing ADMIN_PASSWORD)" };
  }
  
  if (password === adminPassword) {
    return { success: true };
  }
  
  return { success: false, error: "Invalid credentials" };
}
