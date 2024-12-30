import React, { useState, useCallback, memo } from 'react';
import { FaSort } from 'react-icons/fa';

const Sort = ({filteredData, setFilteredData, columnKey}) => {

    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const handleSort = useCallback((columnKey) => {
        const newSortOrder =
            sortColumn === columnKey ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc';

        setSortColumn(columnKey);
        setSortOrder(newSortOrder);

        // Perform sorting
        const sorted = [...filteredData].sort((a, b) => {
            if (typeof a[columnKey] === 'number' && typeof b[columnKey] === 'number') {
                return newSortOrder === 'asc'
                    ? a[columnKey] - b[columnKey]
                    : b[columnKey] - a[columnKey];
            } else {
                return newSortOrder === 'asc'
                    ? a[columnKey]?.toString().localeCompare(b[columnKey]?.toString())
                    : b[columnKey]?.toString().localeCompare(a[columnKey]?.toString());
            }
        });

        setFilteredData(sorted);
    }, [filteredData, sortColumn, sortOrder]);
    return (
        <button onClick={() => handleSort(columnKey)}>
            <FaSort />
        </button>
    )
}

export default memo(Sort);