import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const BackToSiteButton = () => (
  <Button
    variant="ghost"
    onClick={() => window.location.href = 'https://rdnz.design'}
    className="mb-8 text-muted-foreground hover:text-foreground"
  >
    <ArrowLeft className="mr-2 h-4 w-4" />
    Back to rdnz.design
  </Button>
);