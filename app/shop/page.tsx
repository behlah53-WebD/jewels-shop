import { Suspense } from "react";
import { Shop } from "@/components/pages/Shop";

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="page cream py-20 text-center text-amber-900 font-serif">Loading collection...</div>}>
      <Shop />
    </Suspense>
  );
}
