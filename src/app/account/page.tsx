"use client";

import { useState, useEffect } from "react";
import { createInventory, updateInventory, deleteInventory } from "./actions";
import { createClient } from "@/app/utils/supabase/client";

const supabase = createClient();

type Inventory = {
  id: string;
  item: string;
  stock: number;
};

export default function AccountPage() {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [item, setItem] = useState("");
  const [stock, setStock] = useState<number>(0);
  const [editStocks, setEditStocks] = useState<Record<string, number>>({});

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

  useEffect(() => {
    const channel = supabase
      .channel("realtime:inventories")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "inventories",
        },
        () => fetchInventories()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-xl font-semibold mb-6 border-b pb-2">在庫管理</h1>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await createInventory(item, stock);
            setItem("");
            setStock(0);
          }}
          className="bg-white border rounded-md p-4 shadow-sm mb-8 space-y-3"
        >
          <input
            type="text"
            placeholder="商品名"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            className="w-full border px-3 py-2 rounded-md text-sm"
          />
          <input
            type="number"
            placeholder="在庫数"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded-md text-sm"
          />
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-md text-sm hover:bg-gray-700"
          >
            追加
          </button>
        </form>

        <ul className="space-y-3">
          {inventories.map((inv) => (
            <li
              key={inv.id}
              className="bg-white border rounded-md p-4 shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-medium">{inv.item}</p>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="number"
                    value={editStocks[inv.id] ?? inv.stock}
                    onChange={(e) =>
                      setEditStocks((prev) => ({
                        ...prev,
                        [inv.id]: Number(e.target.value),
                      }))
                    }
                    className="w-20 border px-2 py-1 rounded-md text-sm"
                  />
                  <span className="text-sm">個</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    const newStock = editStocks[inv.id] ?? inv.stock;
                    await updateInventory(inv.id, newStock);
                  }}
                  className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md"
                >
                  更新
                </button>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await deleteInventory(inv.id);
                  }}
                >
                  <button
                    type="submit"
                    className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md"
                  >
                    削除
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
