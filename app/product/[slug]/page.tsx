import { Product } from "@/components/pages/Product";
import { ProductSpecificationTable } from "@/components/sections/ProductSpecificationTable";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <>
      <Product slug={slug} />
      <ProductSpecificationTable slug={slug} />
    </>
  );
}
