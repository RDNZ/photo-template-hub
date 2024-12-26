import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CompletionRateCardProps {
  rate: number;
}

export const CompletionRateCard = ({ rate }: CompletionRateCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Completion Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <p className="text-4xl font-bold">{rate}</p>
          <span className="text-2xl">%</span>
        </div>
      </CardContent>
    </Card>
  );
};