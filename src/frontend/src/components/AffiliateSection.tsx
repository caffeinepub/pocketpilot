import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export default function AffiliateSection() {
  return (
    <div className="flex justify-center">
      <a
        href="https://app.groww.in/v3cO/bts5lcxz"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full"
      >
        <Button
          data-ocid="affiliate.button"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl py-3 text-base transition-all"
        >
          Open Free Demat Account
          <ExternalLink className="ml-2 w-4 h-4" />
        </Button>
      </a>
    </div>
  );
}
