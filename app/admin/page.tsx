import { AureliaExperience } from "@/components/AureliaExperience";
import { AdminWorkflowViews } from "@/components/ExpansionPanels";
export default function Page() {
  return (
    <>
      <AureliaExperience page="admin" />
      <AdminWorkflowViews />
    </>
  );
}
