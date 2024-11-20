import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonProps } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

interface PaginationButtonProps extends ButtonProps {
  page: number | string;
  isActive?: boolean;
  onPageChange: (page: number) => void;
}

function PaginationButton({
  page,
  isActive,
  onPageChange,
  className,
  ...props
}: PaginationButtonProps) {
  const isNumber = typeof page === "number";

  return (
    <button
      {...props}
      className={cn(
        buttonVariants({ variant: isActive ? "default" : "outline" }),
        "h-9 w-9",
        isActive && "pointer-events-none",
        !isNumber && "pointer-events-none opacity-50",
        className
      )}
      onClick={() => isNumber && onPageChange(page)}
    >
      {page}
    </button>
  );
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const generatePages = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7;
    const ellipsis = "...";

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push(ellipsis);
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push(ellipsis);
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <button
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-9 w-9 p-0",
          currentPage === 1 && "pointer-events-none opacity-50"
        )}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div className="flex items-center space-x-2">
        {generatePages().map((page, i) => (
          <PaginationButton
            key={`${page}-${i}`}
            page={page}
            isActive={page === currentPage}
            onPageChange={onPageChange}
          />
        ))}
      </div>
      <button
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-9 w-9 p-0",
          currentPage === totalPages && "pointer-events-none opacity-50"
        )}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}