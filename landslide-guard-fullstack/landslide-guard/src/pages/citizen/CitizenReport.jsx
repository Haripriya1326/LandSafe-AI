import SectionHeader from "../../components/common/SectionHeader";
import ReportForm from "../../components/common/ReportForm";

export default function CitizenReport() {
  return (
    <div className="space-y-6 max-w-2xl">
      <SectionHeader
        eyebrow="Community Reporting"
        title="Report Issue"
        description="Help your community by reporting landslides, cracks, blocked roads or slope movement."
      />
      <ReportForm successMessage="Thank you. Your report has been submitted." />
    </div>
  );
}
