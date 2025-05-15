"use server";

import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";

// 商品追加のサーバーアクション
export async function createInventory(item: string, stock: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("ログインが必要です");

  const { error } = await supabase.from("inventories").insert({
    user_id: user.id,
    item,
    stock,
  });

  if (error) throw error;

  revalidatePath("/account");
}

// ストック数更新のサーバーアクション
export async function updateInventory(id: string, stock: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("ログインが必要です");

  const { error } = await supabase
    .from("inventories")
    .update({ stock })
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/account");
}

// 商品削除のサーバーアクション
export async function deleteInventory(id: string) {
  const supabase = await createClient();
  await supabase.from("inventories").delete().eq("id", id);
  revalidatePath("/account");
}
