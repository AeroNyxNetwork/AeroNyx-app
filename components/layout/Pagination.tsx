/*
 * @Description: 
 * @Date: 2025-03-21 10:03:31
 * @LastEditTime: 2025-03-25 10:54:19
 */
import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";


interface PaginationProps {
    totalPages: number;
    onPageChange: (e: number) => void;
    currentPage: number
}

const Pagination = ({ totalPages, currentPage, onPageChange }: PaginationProps) => {
    const renderPageNumbers = () => {
        let pages = [];
        const maxPagesToShow = 6;

        if (totalPages <= maxPagesToShow) {
            pages = Array.from({ length: totalPages }, (_, index) => index + 1);
        } else {
            if (currentPage <= 3) {
                pages = [1, 2, 3, 4, "dots", totalPages];
            } else if (currentPage > totalPages - 3) {
                pages = [1, "dots", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
            } else {
                pages = [1, "dots", currentPage - 1, currentPage, currentPage + 1, "dots", totalPages];
            }
        }

        return pages.map((page, index) => (
            <Button
                key={index}
                id={currentPage === page ? "" : "allStakingButton"}
                size="sm"
                className={`w-8 h-8 mx-1 rounded-lg ${currentPage === page ? "bg-white text-black" : ""}`}
                onClick={() => typeof page === "number" && onPageChange(page)}
                disabled={page === "dots"}
            >
                {page === "dots" ? <MoreHorizontal className="w-4 h-4" /> : page}
            </Button>
        ));
    };

    return (
        <div className="flex items-center justify-center mt-4">
            <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex mx-2">
                {renderPageNumbers()}
            </div>
            <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                <ChevronRight className="w-5 h-5" />
            </Button>
        </div>
    );
};

export default Pagination;