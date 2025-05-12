"use client";

import { useState, useEffect } from "react";
import { createInventory, deleteInventory } from "./actions";
import { createClient } from "@/app/utils/supabase/client";

type Inventory = {
  id: string;
  item: string;
  stock: number;
};

const supabase = createClient();

export default function AccountPage() {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [item, setItem] = useState("");
  const [stock, setStock] = useState<number>(0);

  const fetchInventories = async () => {
    const user = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("inventories")
      .select("*")
      .eq("user_id", user.data.user?.id)
      .order("created_at", { ascending: false });

    if (!error && data) setInventories(data);
  };

  useEffect(() => {
    fetchInventories();
  }, []);

  // Realtime サブスクリプション
  useEffect(() => {
    const channel = supabase
      .channel("realtime:inventories")
      .on(
        "postgres_changes",
        {
          event: "*", // INSERT, UPDATE, DELETE を全て監視
          schema: "public",
          table: "inventories",
        },
        (payload) => {
          console.log("データ変更:", payload);
          fetchInventories(); // ← 変更があったら再取得
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel); // クリーンアップ
    };
  }, []);

  return (
    <main>
      <h1>ストックリスト</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await createInventory(item, stock);
          setItem("");
          setStock(0);
        }}
      >
        <input
          type="text"
          placeholder="商品名"
          value={item}
          onChange={(e) => setItem(e.target.value)}
        />
        <input
          type="number"
          placeholder="在庫数"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
        />
        <button type="submit">追加</button>
      </form>

      <ul>
        {inventories.map((inv) => (
          <li key={inv.id}>
            {inv.item}（{inv.stock}個）
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await deleteInventory(inv.id);
              }}
            >
              <button type="submit">削除</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}

// "data": {
//     "user": {
//       "id": "ac1af994-a387-45b0-acf7-cade291a1492",
//       "aud": "authenticated",
//       "role": "authenticated",
//       "email": "g.k0321aaauuu@gmail.com",
//       "email_confirmed_at": "2025-05-11T06:09:47.808993Z",
//       "phone": "",
//       "confirmation_sent_at": "2025-05-11T06:09:17.216016Z",
//       "confirmed_at": "2025-05-11T06:09:47.808993Z",
//       "last_sign_in_at": "2025-05-11T07:48:36.402155Z",
//       "app_metadata": {
//         "provider": "email",
//         "providers": [
//           "email"
//         ]
//       },
