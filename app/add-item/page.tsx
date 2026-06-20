"use client";

import { useRouter } from "next/navigation";
import { ItemForm } from "@/components/item-form";
import { useInventory } from "@/components/inventory-provider";
import { PageHeading } from "@/components/page-heading";
import type { ItemInput } from "@/lib/types";

export default function AddItemPage() {
  const router = useRouter();
  const { addItem } = useInventory();

  async function save(input: ItemInput) {
    await addItem(input);
    router.push("/inventory");
  }

  return (
    <div>
      <PageHeading title="Add Item" eyebrow="New find">
        Capture the details you need before the item disappears into a bin.
      </PageHeading>
      <ItemForm onSubmit={save} />
    </div>
  );
}
