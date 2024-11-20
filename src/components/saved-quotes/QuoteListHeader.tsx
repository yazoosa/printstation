import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, RefreshCw } from 'lucide-react';

interface QuoteListHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  pageSize: number;
  onPageSizeChange: (value: string) => void;
  onRefresh: () => void;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

export function QuoteListHeader({
  searchQuery,
  onSearchChange,
  pageSize,
  onPageSizeChange,
  onRefresh,
}: QuoteListHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-72">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search quotes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select
        value={pageSize.toString()}
        onValueChange={onPageSizeChange}
      >
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PAGE_SIZE_OPTIONS.map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size} rows
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" size="icon" onClick={onRefresh}>
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
}