import { cn } from "@/lib/utils";

interface HeaderBackgroundProps {
  className?: string;
  children: React.ReactNode;
}

export const HeaderBackground = ({ className, children }: HeaderBackgroundProps) => {
  return (
    <div className={cn(
      "bg-gradient-to-r from-brand-teal/10 to-transparent",
      "p-6 rounded-xl",
      className
    )}>
      {children}
    </div>
  );
};