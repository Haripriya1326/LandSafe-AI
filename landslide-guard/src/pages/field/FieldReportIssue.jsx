import SectionHeader from "../../components/common/SectionHeader";
import ReportForm from "../../components/common/ReportForm";

export default function FieldReportIssue() {
  return (
    <div className="space-y-6 max-w-2xl">
      <SectionHeader
        eyebrow="Ground Reporting"
        title="Report Issue"
        description="Log a ground condition observation for review by the regional command team."
      />
      <ReportForm successMessage="Report submitted successfully." />
    </div>
  );
}
