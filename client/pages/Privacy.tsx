import PlaceholderPage from "./PlaceholderPage";
import { Shield } from "lucide-react";

export default function Privacy() {
  return (
    <PlaceholderPage
      title="Privacy Policy"
      description="Learn how we protect your data and privacy while using LanguageKonnect's language learning and contest platform."
      icon={<Shield className="w-8 h-8 text-primary" />}
    />
  );
}
