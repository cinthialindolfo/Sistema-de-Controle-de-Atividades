"use client"

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
}

export function PaginationControls({ currentPage, totalPages }: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="hidden sm:block text-sm text-muted-foreground">
        Página <span className="font-medium text-foreground">{currentPage}</span> de <span className="font-medium text-foreground">{totalPages}</span>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
        <Button
          variant="outline"
          size="sm"
          className="gap-1 h-9 rounded-xl border-border hover:bg-muted"
          disabled={currentPage <= 1}
          onClick={() => router.push(createPageUrl(currentPage - 1))}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Anterior</span>
        </Button>
        <span className="sm:hidden text-xs font-medium text-muted-foreground">
          {currentPage} / {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 h-9 rounded-xl border-border hover:bg-muted"
          disabled={currentPage >= totalPages}
          onClick={() => router.push(createPageUrl(currentPage + 1))}
        >
          <span>Próxima</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
