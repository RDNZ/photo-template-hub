import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  className?: string;
}

export const SectionHeader = ({ icon: Icon, title, className }: SectionHeaderProps) => {
  return (
    <div className={cn("flex items-center gap-2 text-lg font-semibold", className)}>
      <Icon className="h-5 w-5 text-brand-teal" />
      <h2 className="text-brand-gray-dark">{title}</h2>
    </div>
  );
};