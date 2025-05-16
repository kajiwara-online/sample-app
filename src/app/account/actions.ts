"use server";

import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";

// 商品追加のサーバーアクション
export async function createInventory(
  item: string,
  stock: number = 0,
  threshold: number = 0
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("ログインが必要です");

  const { error } = await supabase.from("inventories").insert({
    user_id: user.id,
    item,
    stock,
    threshold,
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

  // 対象レコードから item名 と threshold を取得
  const { data: record, error: fetchError } = await supabase
    .from("inventories")
    .select("item, threshold")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;

  // 在庫を更新
  const { error } = await supabase
    .from("inventories")
    .update({ stock })
    .eq("id", id);

  if (error) throw error;

  // threshold 以下なら通知を送信
  if (record?.threshold !== null && stock <= record.threshold) {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/notify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: user.email,
        item: record.item,
        stock,
      }),
    });
  }

  revalidatePath("/account");
}

// 商品削除のサーバーアクション
export async function deleteInventory(id: string) {
  const supabase = await createClient();
  await supabase.from("inventories").delete().eq("id", id);
  revalidatePath("/account");
}
