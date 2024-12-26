import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
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
    <Card className="bg-brand-gray-light">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-brand-gray-dark">
          <Search className="h-5 w-5 text-brand-teal" />
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