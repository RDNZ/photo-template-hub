import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";
import { OrderSearch } from "./OrderSearch";

interface SearchCardProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterChange: (value: string) => void;
}

export const SearchCard = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
}: SearchCardProps) => {
  return (
    <Card className="section-card bg-gradient-to-br from-brand-teal/5 to-transparent">
      <CardHeader>
        <CardTitle className="section-header">
          <Search className="h-6 w-6 text-brand-teal" />
          Search & Filter Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Manage and track all orders here. You can filter by status or search by event name.
        </p>
        <OrderSearch
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          filterStatus={filterStatus}
          onFilterChange={onFilterChange}
        />
      </CardContent>
    </Card>
  );
};