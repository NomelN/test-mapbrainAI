"use server";

import { revalidatePath } from "next/cache";

export async function refreshPosts() {
  // Force la revalidation de la page /posts
  revalidatePath("/posts");
  return { success: true, timestamp: Date.now() };
}
