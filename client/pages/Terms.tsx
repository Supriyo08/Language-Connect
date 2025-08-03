import PlaceholderPage from "./PlaceholderPage";
import { FileText } from "lucide-react";

export default function Terms() {
  return (
    <PlaceholderPage
      title="Terms of Service"
      description="Read our terms of service and user agreement for using the LanguageKonnect platform and participating in contests."
      icon={<FileText className="w-8 h-8 text-primary" />}
    />
  );
}
