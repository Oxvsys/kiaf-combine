import { OnInit, Output } from '@angular/core';
import { SimpleChanges } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Input } from '@angular/core';
import { Component, OnChanges } from '@angular/core';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {
    @Input() totalPages = 5;
    @Input() items: Array<any> = [];
    @Output() changePage = new EventEmitter<any>(true);
    @Input() initialPage = 1;
    @Input() pageSize = 5;
    @Input() maxPages = 3;

    pager: any = {};

    constructor() { }

    ngOnInit() {
        
        if (this.items && this.items.length) {
            this.setPage(this.initialPage);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        // reset page if items array has changed 
        this.items = new Array(this.totalPages).fill(0);
        this.setPage(this.initialPage);
        // set page if items array isn't empty
        // if (changes.items?.currentValue !== changes.items?.previousValue) {
        //     this.setPage(this.initialPage);
        // }
    }

    setPage(page: number) {
        if (page > 0) {

            // get new pager object for specified page
            this.pager = this.paginate(this.items.length, page, this.pageSize, this.maxPages);

            // get new page of items from items array
            var pageOfItems = this.items.slice(this.pager.startIndex, this.pager.endIndex + 1);

            // call change page function in parent component
            //   this.changePage.emit(pageOfItems);
            this.changePage.emit(page);
        }
    }
    paginate(
        totalItems: number,
        currentPage: number = 1,
        pageSize: number = 10,
        maxPages: number = 5
    ) {
        // calculate total pages
        let totalPages = Math.ceil(totalItems / pageSize);

        // ensure current page isn't out of range
        if (currentPage < 1) {
            currentPage = 1;
        } else if (currentPage > totalPages) {
            currentPage = totalPages;
        }

        let startPage: number, endPage: number;
        if (totalPages <= maxPages) {
            // total pages less than max so show all pages
            startPage = 1;
            endPage = totalPages;
        } else {
            // total pages more than max so calculate start and end pages
            let maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
            let maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
            if (currentPage <= maxPagesBeforeCurrentPage) {
                // current page near the start
                startPage = 1;
                endPage = maxPages;
            } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
                // current page near the end
                startPage = totalPages - maxPages + 1;
                endPage = totalPages;
            } else {
                // current page somewhere in the middle
                startPage = currentPage - maxPagesBeforeCurrentPage;
                endPage = currentPage + maxPagesAfterCurrentPage;
            }
        }

        // calculate start and end item indexes
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
        // return pages;
    }

}
