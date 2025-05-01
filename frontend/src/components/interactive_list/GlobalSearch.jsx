import { memo, useMemo } from "react";
import { useCallback, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { Cancel, Search, Reset } from "../../assets/svgIcons";
import { Input } from "antd";
import { debounce } from "lodash";
import { use } from "react";

const GLobalSearch = ({ data, setFilteredData, toggleFilterBox }) => {

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchGlobal, setSearchGlobal] = useState("");

    const handleGlobalSearch = useCallback(
        debounce((value) => {
            const filteredData = data.filter((record) => {
                return Object.keys(record).some((key) =>
                    record[key]?.toString().toLowerCase().includes(value)
                );
            });
            setFilteredData(filteredData);
        }, 300), // Adjust debounce delay as needed
        [data]
    );

    const handleGlobalReset = useCallback(() => {
        setSearchGlobal("");
        setIsSearchOpen(false);
        setFilteredData(data);
        toggleFilterBox();
    }, []);

    const onInputChange = useCallback((e) => {
        const value = e.target.value.toLowerCase();
        setSearchGlobal(value);
        handleGlobalSearch(value);
    }, []);

    const openSearch = useCallback(() => { setIsSearchOpen(true) }, []);
    const closeSearch = useCallback(() => {
        setIsSearchOpen(false);
        setSearchGlobal("");
        handleGlobalReset();
    }, []);

    const memoInput = useMemo(() => {
        return <Input
            prefix={<BiSearch />}
            defaultValue={searchGlobal}
            onChange={onInputChange}
            style={{ width: "200px" }}
            className="min-w-[150px] px-4 py-1 mx-2"
            placeholder="Search"
        />
    }, [])

    return (
        <>
            {isSearchOpen && (
                memoInput
            )}
            {
                isSearchOpen && (
                    <button onClick={closeSearch} className="bg-primary rounded-[4px] p-1 mr-2" title="Cancel">
                        <Cancel />
                    </button>
                )
            }
            {
                !isSearchOpen && (
                    <button onClick={openSearch} className="bg-primary rounded-[4px] p-1 mx-2" title="Search">
                        <Search />
                    </button>
                )
            }

            <button onClick={handleGlobalReset} className="bg-primary rounded-[4px] p-1" title="Reset">
                <Reset />
            </button>
        </>
    )
};

export default memo(GLobalSearch);