import { AureliaExperience } from "@/components/AureliaExperience";
import { ProductSpecificationTable } from "@/components/ExpansionPanels";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <>
      <AureliaExperience page="product" slug={slug} />
      <ProductSpecificationTable slug={slug} />
    </>
  );
}
