import { cn } from '@/utils/cn.util';
import Link from 'next/link';
import { memo, useMemo } from 'react';
import type { FC, ReactNode } from 'react';

export const Pagination: FC<PaginationProps> = ({ activePage, hrefGenerator, pageCount, className, position = 'center' }) => {
    const listOfRenderedItems = useMemo(() => paginationRange(activePage, pageCount), [activePage, pageCount]);

    if (pageCount === 1) {
        return (
            <div hidden={true} className={'hidden'} />
        );
    }

    return (
        <div
            className={cn(
                'flex flex-wrap items-center w-fit rounded-lg group',
                {
                    'mx-auto': position === 'center',
                    'ml-auto': position === 'right',
                    'mr-auto': position === 'left',
                },
                className
            )}
        >
            {
                listOfRenderedItems.map(({ page, renderedElement }, index) => {
                    return (
                        <PaginationItem
                            element={renderedElement}
                            isCurrentPage={activePage === +page}
                            href={renderedElement === 'link' ? hrefGenerator(page) : ''}
                            key={index}
                        >
                            {page}
                        </PaginationItem>
                    );
                })
            }
        </div>
    );
};

interface PaginationProps {
    activePage: number;
    pageCount: number;
    position?: PaginationPosition;
    className?: string;
    hrefGenerator: (page: number) => string;
}

type PaginationPosition = 'right' | 'left' | 'center';


const PaginationItem = memo(({ element, isCurrentPage, children, href }: PaginationItemProps) => {
    const styles = {
        base: 'duration-100 cursor-pointer inline-block px-5 py-2 text-lg text-stone-900 border-solid bg-white border border-gray-200',
        first: 'first:rounded-tl-lg first:rounded-bl-lg first:px-5',
        last: 'last:rounded-tr-lg last:rounded-br-lg last:px-5',
        inactive: 'cursor-default px-4',
        activePage: 'bg-orange-500 border-transparent text-white px-5',
        hover: 'hover:bg-orange-300 hover:text-white hover:border-orange-300 hover:border-solid'
    };

    if (element === 'span' || href === undefined) {
        return (
            <span className={cn(
                styles.base,
                styles.first,
                styles.last,
                styles.inactive,
                {
                    [styles.activePage]: isCurrentPage
                }
            )}>
                {children}
            </span>
        );
    }

    return (
        (<Link
            href={href}
            className={cn(
                styles.base,
                styles.first,
                styles.last,
                styles.hover,
                {
                    [styles.activePage]: isCurrentPage
                }
            )}
        >
            {children}
        </Link>)
    );
});

PaginationItem.displayName = 'PaginationItem';

interface PaginationItemProps {
    element: 'span' | 'link';
    children: ReactNode;
    isCurrentPage: boolean;
    href: undefined | string;
}

function paginationRange(currentPage: number, totalPages: number): PaginationObject[] {
    const visiblePagesRange = 2;
    const firstPage = 1;
    const lastPage = totalPages;

    const listOfPickedPages: PaginationObject[] = [];
    /* ==== If amount of pages is more than {visiblePagesRange} ==== */
    if (totalPages >= visiblePagesRange) {
        const visiblePagesArray = Array.from({ length: visiblePagesRange });

        /* ==== Collecting Last {visiblePagesRange} pages ==== */
        const listOfLastPages: PaginationObject[] = visiblePagesArray.reduce<PaginationObject[]>((acc, _, index) => {
            const lastRangePages = currentPage - visiblePagesRange;
            const pageNumber = index + lastRangePages;
            const isPositiveNumber = pageNumber > 0;

            if (isPositiveNumber) {
                return [...acc, { page: pageNumber, renderedElement: 'link' }];
            }

            return [...acc];
        }, []);

        /* ==== Collecting Next {visiblePagesRange} pages ==== */
        const listOfNextPages: PaginationObject[] = visiblePagesArray.reduce<PaginationObject[]>((acc, _, index) => {
            const pageNumber = currentPage + index + 1;
            const isInPagesRange = pageNumber < totalPages;

            if (isInPagesRange) {
                return [...acc, { page: pageNumber, renderedElement: 'link' }];
            }

            return [...acc];
        }, []);

        /* ==== Adding dots if needed & Adding first element ==== */
        const isFirstPageIncluded = !!listOfLastPages.find(item => item.page === firstPage);
        if (!isFirstPageIncluded) {
            listOfPickedPages.push({ page: '1', renderedElement: 'span' });

            if (listOfLastPages.at(0)) {
                if (listOfLastPages.at(0)?.page !== 2) {
                    listOfPickedPages.push({ page: '...', renderedElement: 'span' });
                }
            }
        }
        /* ==== Adding last {4} pages ==== */
        listOfPickedPages.push(...listOfLastPages);

        // Adding current page
        if (currentPage !== firstPage) {
            listOfPickedPages.push({ page: `${currentPage}`, renderedElement: 'span' });
        }

        // Adding last pages
        listOfPickedPages.push(...listOfNextPages);

        // Adding dots if needed & last page
        if (listOfNextPages.find((item) => item.page === lastPage) === undefined) {
            if (lastPage !== currentPage && lastPage - currentPage > visiblePagesRange + 1) {
                listOfPickedPages.push({ page: '...', renderedElement: 'span' });
            }

            if (lastPage !== currentPage) {
                listOfPickedPages.push({ page: lastPage, renderedElement: 'link' });
            }
        }
    } else if (totalPages < visiblePagesRange) {
        const arrayOfPages: PaginationObject[] = Array.from({ length: totalPages }).map<PaginationObject>((_, index) => {
            const page = index + 1;

            if (page === currentPage) {
                return {
                    renderedElement: 'span',
                    page: `${page}`,
                };
            }

            return {
                page: page,
                renderedElement: 'link'
            };
        });
        listOfPickedPages.push(...arrayOfPages);
    }

    return listOfPickedPages;
}

type PaginationObject = {
    page: number;
    renderedElement: 'link';
} | {
    page: string;
    renderedElement: 'span';
};