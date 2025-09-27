// import React, { useState } from "react";
// import { LuFilter } from "react-icons/lu";
// import { MdDelete, MdOutlineDriveFolderUpload, MdRefresh } from "react-icons/md";
// import { BiSolidHide } from "react-icons/bi";
// import { IoSearchOutline } from "react-icons/io5";
// import { IoMdAdd } from "react-icons/io";
// import { notifyError } from "../../utils/notify";
// import { FiEye } from "react-icons/fi";
// import Slider from 'rc-slider';
// import 'rc-slider/assets/index.css';
// import { CiCalendarDate } from 'react-icons/ci';
// import { Bs123 } from 'react-icons/bs';
// import { Cancel } from '../../assets/svgIcons';
// import { Input } from 'antd';
// import { SearchOutlined } from "@ant-design/icons";

// const PreviewBtn = ({ data = [], setFilteredData }) => {
//     const handleAlert = (e) => {
//         e.preventDefault();
//         notifyError("Not available in preview!");
//     };

//     // Local state for reusable controls
//     const [isFilterOpen, setIsFilterOpen] = useState(false);
//     const [isSearchOpen, setIsSearchOpen] = useState(false);
//     const [isNumberDropdownOpen, setIsNumberDropdownOpen] = useState(false);
//     const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
//     const [selectedNumbers, setSelectedNumbers] = useState([]); // [{column, range:[min,max]}]
//     const [selectedDates, setSelectedDates] = useState([]); // [{column, range:[minISO,maxISO]}]

//     // Helpers
//     const isNumber = (value) => !isNaN(parseFloat(value)) && isFinite(value);
//     const isDate = (value) => {
//         if (!value || typeof value !== 'string') return false;
//         const patterns = [
//             /^\d{4}-\d{2}-\d{2}$/,
//             /^\d{2}\/\d{2}\/\d{4}$/,
//             /^\d{2}-\d{2}-\d{4}$/,
//             /^\d{4}\/\d{2}\/\d{2}$/,
//             /^\d{1,2}\/\d{1,2}\/\d{4}$/,
//             /^\d{4}-\d{1,2}-\d{1,2}$/,
//         ];
//         if (patterns.some((p) => p.test(value.trim()))) {
//             const d = new Date(value);
//             return !isNaN(d.getTime());
//         }
//         return false;
//     };

//     const getHeadersWithDateAndNumbers = (rows) => {
//         if (!Array.isArray(rows) || rows.length === 0) return { dateColumns: [], numberColumns: [] };
//         const keys = Object.keys(rows[0]);
//         const result = { dateColumns: [], numberColumns: [] };
//         keys.forEach((k) => {
//             const values = rows.map((r) => r[k]);
//             if (values.some((v) => isDate(v))) result.dateColumns.push(k);
//             if (k !== 'key_id' && values.some((v) => isNumber(v))) result.numberColumns.push(k);
//         });
//         return result;
//     };

//     const calculate_number_min_max = (rows, key) => {
//         if (!rows || rows.length === 0) return { min: 0, max: 0 };
//         let min = null, max = null;
//         rows.forEach((item) => {
//             const val = parseFloat(item[key]);
//             if (!isNaN(val)) {
//                 if (min === null || val < min) min = val;
//                 if (max === null || val > max) max = val;
//             }
//         });
//         return { min: min ?? 0, max: max ?? 0 };
//     };

//     const calculate_min_max = (rows, key) => {
//         if (!rows || rows.length === 0) return { min: null, max: null };
//         let min = null, max = null;
//         rows.forEach((item) => {
//             const val = item[key];
//             if (val && isDate(val)) {
//                 const ts = new Date(val).getTime();
//                 if (!isNaN(ts)) {
//                     if (min === null || ts < min) min = ts;
//                     if (max === null || ts > max) max = ts;
//                 }
//             }
//         });
//         return { min: min || new Date('2000-01-01').getTime(), max: max || new Date().getTime() };
//     };

//     const applyAllFilters = (base) => {
//         let out = base;
//         selectedNumbers.forEach((nf) => {
//             const [mn, mx] = nf.range || [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY];
//             out = out.filter((row) => {
//                 const v = parseFloat(row[nf.column]);
//                 return !isNaN(v) && v >= mn && v <= mx;
//             });
//         });
//         selectedDates.forEach((df) => {
//             const [startISO, endISO] = df.range || [];
//             const start = startISO ? new Date(startISO).getTime() : Number.NEGATIVE_INFINITY;
//             const end = endISO ? new Date(endISO).getTime() : Number.POSITIVE_INFINITY;
//             out = out.filter((row) => {
//                 const val = row[df.column];
//                 if (!val || !isDate(val)) return false;
//                 const ts = new Date(val).getTime();
//                 return ts >= start && ts <= end;
//             });
//         });
//         return out;
//     };

//     const { numberColumns, dateColumns } = getHeadersWithDateAndNumbers(data);

//     const handleRefresh = () => {
//         setIsSearchOpen(false);
//         setIsFilterOpen(false);
//         setIsNumberDropdownOpen(false);
//         setIsDateDropdownOpen(false);
//         setSelectedNumbers([]);
//         setSelectedDates([]);
//         setFilteredData && setFilteredData(data);
//     };

//     const handleGlobalSearch = (val) => {
//         const query = (val || '').toLowerCase();
//         if (!query) {
//             setFilteredData && setFilteredData(applyAllFilters(data));
//             return;
//         }
//         const filtered = applyAllFilters(data).filter((record) =>
//             Object.keys(record).some((k) => (record[k] ?? '').toString().toLowerCase().includes(query))
//         );
//         setFilteredData && setFilteredData(filtered);
//     };

//     return (
//         <div className="flex items-center justify-end gap-2 relative">
//             {isSearchOpen && (
//                 <div className="mr-2">

//                     {/* <Input placeholder="Search all columns" allowClear onChange={(e) => handleGlobalSearch(e.target.value)} style={{ minwidth: 600 }} /> */}
//                     <Input
//                         placeholder="Search..."
//                         allowClear
//                         prefix={<SearchOutlined />}
//                         onChange={(e) => handleGlobalSearch(e.target.value)}
//                         style={{ width: 200 }} // ✅ Wider input (you can adjust: 300, 400, 600, etc.)
//                     />
//                 </div>
//             )}
//             {/* <button onClick={(e) => { e.preventDefault(); setIsFilterOpen((p) => !p); }} className="bg-primary rounded-[4px] p-[5px]" title="Filter" >
//                 <LuFilter className="text-white" size={18} />
//             </button> */}
//             {!isFilterOpen ? (
//                 <button
//                     onClick={(e) => { e.preventDefault(); setIsFilterOpen(true); }}
//                     className="bg-primary rounded-[4px] p-[5px]"
//                     title="Filter"
//                 >
//                     <LuFilter className="text-white" size={18} />
//                 </button>
//             ) : (
//                 <div className="w-[115px] h-[41px] flex-shrink-0 rounded-[5.145px] bg-[#598931] border border-gray-300 shadow-lg flex items-center space-x-1 px-2 relative">
//                     <button
//                         className="p-1 bg-[#F2FFE8] rounded-md"
//                         onClick={() => { setIsNumberDropdownOpen(!isNumberDropdownOpen); setIsDateDropdownOpen(false); }}
//                         title="Number Filter"
//                     >
//                         <Bs123 className="text-green-900" size={20} />
//                     </button>
//                     <button
//                         className="p-1 bg-[#F2FFE8] rounded-md"
//                         onClick={() => { setIsDateDropdownOpen(!isDateDropdownOpen); setIsNumberDropdownOpen(false); }}
//                         title="Date Filter"
//                     >
//                         <CiCalendarDate className="text-green-900" size={20} />
//                     </button>
//                     <button
//                         className="p-1 bg-[#598931] rounded-md absolute right-2"
//                         onClick={() => setIsFilterOpen(false)}
//                         title="Close"
//                     >
//                         <Cancel className="text-green-900" size={20} />
//                     </button>
//                 </div>
//             )}

//             <button onClick={(e) => { e.preventDefault(); setIsSearchOpen((p) => !p); }} className="bg-primary rounded-[4px] p-[5px]" title="Search">
//                 <IoSearchOutline color="white" size={18} />
//             </button>
//             <button onClick={(e) => { e.preventDefault(); handleRefresh(); }} className="bg-primary rounded-[4px] p-[5px]" title="Refresh">
//                 <MdRefresh color="white" size={18} />
//             </button>
//             <button onClick={(e) => handleAlert(e)} className="bg-primary rounded-[4px] p-[5px]" title="Add Row">
//                 <IoMdAdd color="white" size={18} />
//             </button>
//             <button onClick={(e) => handleAlert(e)} className="bg-primary rounded-[4px] p-[5px]" title="Import Data">
//                 <MdOutlineDriveFolderUpload color="white" size={18} />
//             </button>
//             <button onClick={(e) => handleAlert(e)} className="bg-primary rounded-[4px] p-[5px]" title="Delete">
//                 <MdDelete color="white" size={18} />
//             </button>
//             <button onClick={(e) => handleAlert(e)} className="bg-primary rounded-[4px] p-[5px]" title="Hide Columns">
//                 <BiSolidHide color="white" size={18} />
//             </button>



//             {isNumberDropdownOpen && (
//                 <div className="absolute top-full left-[-50px] mt-1 max-w-[260px] bg-white border border-gray-300 shadow-lg rounded-md p-2 z-50 overflow-auto">
//                     <div className="text-sm font-medium mb-2">Number Options</div>
//                     {numberColumns.length ? numberColumns.map((col) => {
//                         const isChecked = selectedNumbers.some((s) => s.column === col);
//                         const { min, max } = calculate_number_min_max(data, col);
//                         return (
//                             <label key={col} className="flex items-start gap-2 p-1 hover:bg-gray-100 rounded cursor-pointer">
//                                 <input
//                                     type="checkbox"
//                                     checked={isChecked}
//                                     onChange={(e) => {
//                                         if (e.target.checked)
//                                             setSelectedNumbers((prev) => [...prev, { column: col, range: [min, max] }]);
//                                         else
//                                             setSelectedNumbers((prev) => prev.filter((s) => s.column !== col));
//                                         setFilteredData && setFilteredData(applyAllFilters(data));
//                                     }}
//                                 />
//                                 <div className="flex-1">
//                                     <div className="text-gray-800" title={col}>{col}</div>
//                                 </div>
//                             </label>
//                         );
//                     }) : <div className="text-gray-500">No options</div>}
//                 </div>
//             )}

//             {isDateDropdownOpen && (
//                 <div className="absolute top-full left-[80px] mt-1 max-w-[260px] bg-white border border-gray-300 shadow-lg rounded-md p-2 z-50 overflow-auto">
//                     <div className="text-sm font-medium mb-2">Date Options</div>
//                     {dateColumns.length ? dateColumns.map((col) => {
//                         const isChecked = selectedDates.some((s) => s.column === col);
//                         const { min, max } = calculate_min_max(data, col);
//                         return (
//                             <label key={col} className="flex items-start gap-2 p-1 hover:bg-gray-100 rounded cursor-pointer">
//                                 <input
//                                     type="checkbox"
//                                     checked={isChecked}
//                                     onChange={(e) => {
//                                         if (e.target.checked)
//                                             setSelectedDates((prev) => [...prev, { column: col, range: [new Date(min).toISOString(), new Date(max).toISOString()] }]);
//                                         else
//                                             setSelectedDates((prev) => prev.filter((s) => s.column !== col));
//                                         setFilteredData && setFilteredData(applyAllFilters(data));
//                                     }}
//                                 />
//                                 <div className="flex-1">
//                                     <div className="text-gray-800" title={col}>{col}</div>
//                                 </div>
//                             </label>
//                         );
//                     }) : <div className="text-gray-500">No options</div>}
//                 </div>
//             )}


//             {(selectedNumbers.length > 0 || selectedDates.length > 0) && (
//                 <div className="fixed left-1/2 -translate-x-1/2 top-[100px] z-40 px-4 w-full max-w-[1200px]">
//                     <div className="flex flex-wrap gap-4 justify-center">
//                         {selectedNumbers.map((slider, index) => {
//                             const { min, max } = calculate_number_min_max(data, slider.column);
//                             return (
//                                 <div key={`num-${slider.column}-${index}`} className="flex flex-col items-center w-[240px]">
//                                     <span className="font-medium text-gray-700 mb-2 text-center text-[14px]">
//                                         {slider.column.split('_').join(' ').toUpperCase()}
//                                     </span>
//                                     <div className="flex flex-col items-center w-full relative">
//                                         <Slider
//                                             range
//                                             value={slider.range || [min, max]}
//                                             onChange={(val) => {
//                                                 setSelectedNumbers((prev) => prev.map((s) => (s.column === slider.column ? { ...s, range: val } : s)));
//                                                 setFilteredData && setFilteredData(applyAllFilters(data));
//                                             }}
//                                             min={min}
//                                             max={max}
//                                             style={{ width: '100%' }}
//                                             trackStyle={{ height: '4px' }}
//                                             handleStyle={{ height: '14px', width: '14px', border: '2px solid #598931' }}
//                                         />
//                                         <div className="flex justify-between w-full text-sm text-gray-700 mt-1 ">
//                                             <span className="text-[14px]">{slider.range ? slider.range[0] : min}</span>
//                                             <span className="text-[14px]">{slider.range ? slider.range[1] : max}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                         {selectedDates.map((slider, index) => {
//                             const { min, max } = calculate_min_max(data, slider.column);
//                             const minDate = min || new Date('2000-01-01').getTime();
//                             const maxDate = max || new Date().getTime();
//                             return (
//                                 <div key={`date-${slider.column}-${index}`} className="flex flex-col items-center w-[240px]">
//                                     <span className="font-medium text-gray-700 mb-2 text-center text-[14px]">
//                                         {slider.column.split('_').join(' ').toUpperCase()}
//                                     </span>
//                                     <div className="flex flex-col items-center w-full relative">
//                                         <Slider
//                                             range
//                                             value={slider.range && slider.range.length === 2 ? slider.range.map((d) => new Date(d).getTime()) : [minDate, maxDate]}
//                                             onChange={(val) => {
//                                                 const isoRange = val.map((ts) => new Date(ts).toISOString());
//                                                 setSelectedDates((prev) => prev.map((s) => (s.column === slider.column ? { ...s, range: isoRange } : s)));
//                                                 setFilteredData && setFilteredData(applyAllFilters(data));
//                                             }}
//                                             min={minDate}
//                                             max={maxDate}
//                                             step={24 * 60 * 60 * 1000}
//                                             style={{ width: '100%' }}
//                                             trackStyle={{ height: '4px' }}
//                                             handleStyle={{ height: '14px', width: '14px', border: '2px solid #598931' }}
//                                         />
//                                         <div className="flex justify-between w-full text-sm text-gray-700 mt-1">
//                                             <span className="text-[14px]">{slider.range && slider.range.length === 2 ? new Date(slider.range[0]).toLocaleDateString('en-GB') : new Date(minDate).toLocaleDateString('en-GB')}</span>
//                                             <span className="text-[14px]">{slider.range && slider.range.length === 2 ? new Date(slider.range[1]).toLocaleDateString('en-GB') : new Date(maxDate).toLocaleDateString('en-GB')}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default PreviewBtn;

import React, { useState } from "react";
import { LuFilter } from "react-icons/lu";
import { MdDelete, MdOutlineDriveFolderUpload, MdRefresh } from "react-icons/md";
import { BiSolidHide } from "react-icons/bi";
import { IoSearchOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { notifyError } from "../../utils/notify";
import { FiEye } from "react-icons/fi";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { CiCalendarDate } from 'react-icons/ci';
import { Bs123 } from 'react-icons/bs';
import { Cancel } from '../../assets/svgIcons';
import { Input } from 'antd';
import { SearchOutlined } from "@ant-design/icons";
import { ImCancelCircle } from "react-icons/im";

const PreviewBtn = ({ data = [], setFilteredData }) => {
    const handleAlert = (e) => {
        e.preventDefault();
        notifyError("Not available in preview!");
    };

    // Local state for reusable controls
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isNumberDropdownOpen, setIsNumberDropdownOpen] = useState(false);
    const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
    const [selectedNumbers, setSelectedNumbers] = useState([]); // [{column, range:[min,max]}]
    const [selectedDates, setSelectedDates] = useState([]); // [{column, range:[minISO,maxISO]}]

    // Helpers
    const isNumber = (value) => !isNaN(parseFloat(value)) && isFinite(value);
    const isDate = (value) => {
        if (!value || typeof value !== 'string') return false;
        const patterns = [
            /^\d{4}-\d{2}-\d{2}$/,
            /^\d{2}\/\d{2}\/\d{4}$/,
            /^\d{2}-\d{2}-\d{4}$/,
            /^\d{4}\/\d{2}\/\d{2}$/,
            /^\d{1,2}\/\d{1,2}\/\d{4}$/,
            /^\d{4}-\d{1,2}-\d{1,2}$/,
        ];
        if (patterns.some((p) => p.test(value.trim()))) {
            const d = new Date(value);
            return !isNaN(d.getTime());
        }
        return false;
    };

    const getHeadersWithDateAndNumbers = (rows) => {
        if (!Array.isArray(rows) || rows.length === 0) return { dateColumns: [], numberColumns: [] };
        const keys = Object.keys(rows[0]);
        const result = { dateColumns: [], numberColumns: [] };
        keys.forEach((k) => {
            const values = rows.map((r) => r[k]);
            if (values.some((v) => isDate(v))) result.dateColumns.push(k);
            if (k !== 'key_id' && values.some((v) => isNumber(v))) result.numberColumns.push(k);
        });
        return result;
    };

    const calculate_number_min_max = (rows, key) => {
        if (!rows || rows.length === 0) return { min: 0, max: 0 };
        let min = null, max = null;
        rows.forEach((item) => {
            const val = parseFloat(item[key]);
            if (!isNaN(val)) {
                if (min === null || val < min) min = val;
                if (max === null || val > max) max = val;
            }
        });
        return { min: min ?? 0, max: max ?? 0 };
    };

    const calculate_min_max = (rows, key) => {
        if (!rows || rows.length === 0) return { min: null, max: null };
        let min = null, max = null;
        rows.forEach((item) => {
            const val = item[key];
            if (val && isDate(val)) {
                const ts = new Date(val).getTime();
                if (!isNaN(ts)) {
                    if (min === null || ts < min) min = ts;
                    if (max === null || ts > max) max = ts;
                }
            }
        });
        return { min: min || new Date('2000-01-01').getTime(), max: max || new Date().getTime() };
    };

    const applyAllFilters = (base) => {
        let out = base;
        selectedNumbers.forEach((nf) => {
            const [mn, mx] = nf.range || [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY];
            out = out.filter((row) => {
                const v = parseFloat(row[nf.column]);
                return !isNaN(v) && v >= mn && v <= mx;
            });
        });
        selectedDates.forEach((df) => {
            const [startISO, endISO] = df.range || [];
            const start = startISO ? new Date(startISO).getTime() : Number.NEGATIVE_INFINITY;
            const end = endISO ? new Date(endISO).getTime() : Number.POSITIVE_INFINITY;
            out = out.filter((row) => {
                const val = row[df.column];
                if (!val || !isDate(val)) return false;
                const ts = new Date(val).getTime();
                return ts >= start && ts <= end;
            });
        });
        return out;
    };

    const { numberColumns, dateColumns } = getHeadersWithDateAndNumbers(data);

    const handleRefresh = () => {
        setIsSearchOpen(false);
        setIsFilterOpen(false);
        setIsNumberDropdownOpen(false);
        setIsDateDropdownOpen(false);
        setSelectedNumbers([]);
        setSelectedDates([]);
        setFilteredData && setFilteredData(data);
    };

    const handleGlobalSearch = (val) => {
        const query = (val || '').toLowerCase();
        if (!query) {
            setFilteredData && setFilteredData(applyAllFilters(data));
            return;
        }
        const filtered = applyAllFilters(data).filter((record) =>
            Object.keys(record).some((k) => (record[k] ?? '').toString().toLowerCase().includes(query))
        );
        setFilteredData && setFilteredData(filtered);
    };

    const toggleNumberDropdown = () => {
        setIsNumberDropdownOpen(!isNumberDropdownOpen);
        setIsDateDropdownOpen(false);
    };

    const toggleDateDropdown = () => {
        setIsDateDropdownOpen(!isDateDropdownOpen);
        setIsNumberDropdownOpen(false);
    };

    const toggleSearch = () => {
        if (isSearchOpen) {
            // Close search and reset
            setIsSearchOpen(false);
            handleGlobalSearch(''); // Reset search
        } else {
            // Open search
            setIsSearchOpen(true);
        }
    };

    return (
        <div className="flex items-center justify-end gap-2 relative">
            {!isFilterOpen ? (
                <button
                    onClick={(e) => { e.preventDefault(); setIsFilterOpen(true); }}
                    className="bg-primary rounded-[4px] p-[5px]"
                    title="Filter"
                >
                    <LuFilter className="text-white" size={18} />
                </button>
            ) : (
                <div className="w-[115px] h-[41px] flex-shrink-0 rounded-[5.145px] bg-[#598931] border border-gray-300 shadow-lg flex items-center space-x-1 px-2 relative">
                    <button
                        className="p-1 bg-[#F2FFE8] rounded-md"
                        onClick={toggleNumberDropdown}
                        title="Number Filter"
                    >
                        <Bs123 className="text-green-900" size={20} />
                    </button>
                    <button
                        className="p-1 bg-[#F2FFE8] rounded-md"
                        onClick={toggleDateDropdown}
                        title="Date Filter"
                    >
                        <CiCalendarDate className="text-green-900" size={20} />
                    </button>
                    <button
                        className="p-1 bg-[#598931] rounded-md absolute right-2"
                        onClick={() => {
                            setIsFilterOpen(false);
                            setIsNumberDropdownOpen(false);
                            setIsDateDropdownOpen(false);
                        }}
                        title="Close"
                    >
                        <Cancel className="text-green-900" size={20} />
                    </button>
                </div>
            )}

            {/* Search input positioned between filter and search button */}
            {isSearchOpen && (
                <div className="mr-2">
                    <Input
                        placeholder="Search..."
                        allowClear
                        prefix={<SearchOutlined />}
                        onChange={(e) => handleGlobalSearch(e.target.value)}
                        style={{ width: 200 }}
                    />
                </div>
            )}

            <button
                onClick={(e) => { e.preventDefault(); toggleSearch(); }}
                className="bg-primary rounded-[4px] p-[5px]"
                title={isSearchOpen ? "Close Search" : "Search"}
            >
                {isSearchOpen ? (
                    <Cancel className="text-white" size={18} />
                ) : (
                    <IoSearchOutline color="white" size={18} />
                )}
            </button>

            <button onClick={(e) => { e.preventDefault(); handleRefresh(); }} className="bg-primary rounded-[4px] p-[5px]" title="Refresh">
                <MdRefresh color="white" size={18} />
            </button>
            <button onClick={(e) => handleAlert(e)} className="bg-primary rounded-[4px] p-[5px]" title="Add Row">
                <IoMdAdd color="white" size={18} />
            </button>
            <button onClick={(e) => handleAlert(e)} className="bg-primary rounded-[4px] p-[5px]" title="Import Data">
                <MdOutlineDriveFolderUpload color="white" size={18} />
            </button>
            <button onClick={(e) => handleAlert(e)} className="bg-primary rounded-[4px] p-[5px]" title="Delete">
                <MdDelete color="white" size={18} />
            </button>
            <button onClick={(e) => handleAlert(e)} className="bg-primary rounded-[4px] p-[5px]" title="Hide Columns">
                <BiSolidHide color="white" size={18} />
            </button>

            {isNumberDropdownOpen && (
                <div className="absolute top-full left-[-50px] mt-1 max-w-[260px] bg-white border border-gray-300 shadow-lg rounded-md p-2 z-50 overflow-auto">
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="text-sm font-medium">Number Options</div>
                        <button
                            onClick={() => setIsNumberDropdownOpen(false)}
                            className="text-gray-500 hover:text-gray-800 focus:outline-none"
                            title="Close"
                        >
                            <ImCancelCircle />
                        </button>
                    </div>
                    {numberColumns.length ? numberColumns.map((col) => {
                        const isChecked = selectedNumbers.some((s) => s.column === col);
                        const { min, max } = calculate_number_min_max(data, col);
                        return (
                            <label key={col} className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                        if (e.target.checked)
                                            setSelectedNumbers((prev) => [...prev, { column: col, range: [min, max] }]);
                                        else
                                            setSelectedNumbers((prev) => prev.filter((s) => s.column !== col));
                                        setFilteredData && setFilteredData(applyAllFilters(data));
                                    }}
                                    className="w-4 h-4 flex-shrink-0"
                                />
                                <div className="flex-1">
                                    <div className="text-gray-800" title={col}>{col}</div>
                                </div>
                            </label>
                        );
                    }) : <div className="text-gray-500">No options</div>}
                </div>
            )}

            {isDateDropdownOpen && (
                <div className="absolute top-full left-[80px] mt-1 max-w-[260px] bg-white border border-gray-300 shadow-lg rounded-md p-2 z-50 overflow-auto">
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="text-sm font-medium">Date Options</div>
                        <button
                            onClick={() => setIsDateDropdownOpen(false)}
                            className="text-gray-500 hover:text-gray-800 focus:outline-none"
                            title="Close"
                        >
                            <ImCancelCircle />
                        </button>
                    </div>
                    {dateColumns.length ? dateColumns.map((col) => {
                        const isChecked = selectedDates.some((s) => s.column === col);
                        const { min, max } = calculate_min_max(data, col);
                        return (
                            <label key={col} className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                        if (e.target.checked)
                                            setSelectedDates((prev) => [...prev, { column: col, range: [new Date(min).toISOString(), new Date(max).toISOString()] }]);
                                        else
                                            setSelectedDates((prev) => prev.filter((s) => s.column !== col));
                                        setFilteredData && setFilteredData(applyAllFilters(data));
                                    }}
                                    className="w-4 h-4 flex-shrink-0"
                                />
                                <div className="flex-1">
                                    <div className="text-gray-800" title={col}>{col}</div>
                                </div>
                            </label>
                        );
                    }) : <div className="text-gray-500">No options</div>}
                </div>
            )}

            {(selectedNumbers.length > 0 || selectedDates.length > 0) && (
                <div className="fixed left-1/2 -translate-x-1/2 z-40 px-4 w-full max-w-[1200px]" style={{ top: '80px' }}>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {selectedNumbers.map((slider, index) => {
                            const { min, max } = calculate_number_min_max(data, slider.column);
                            return (
                                <div key={`num-${slider.column}-${index}`} className="flex flex-col items-center w-[240px]">
                                    <span className="font-medium text-gray-700 mb-2 text-center text-[14px]">
                                        {slider.column.split('_').join(' ').toUpperCase()}
                                    </span>
                                    <div className="flex flex-col items-center w-full relative">
                                        <Slider
                                            range
                                            value={slider.range || [min, max]}
                                            onChange={(val) => {
                                                setSelectedNumbers((prev) => prev.map((s) => (s.column === slider.column ? { ...s, range: val } : s)));
                                                setFilteredData && setFilteredData(applyAllFilters(data));
                                            }}
                                            min={min}
                                            max={max}
                                            style={{ width: '100%' }}
                                            trackStyle={{ height: '4px' }}
                                            handleStyle={{ height: '14px', width: '14px', border: '2px solid #598931' }}
                                        />
                                        <div className="flex justify-between w-full text-sm text-gray-700 mt-1 ">
                                            <span className="text-[14px]">{slider.range ? slider.range[0] : min}</span>
                                            <span className="text-[14px]">{slider.range ? slider.range[1] : max}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {selectedDates.map((slider, index) => {
                            const { min, max } = calculate_min_max(data, slider.column);
                            const minDate = min || new Date('2000-01-01').getTime();
                            const maxDate = max || new Date().getTime();
                            return (
                                <div key={`date-${slider.column}-${index}`} className="flex flex-col items-center w-[240px]">
                                    <span className="font-medium text-gray-700 mb-2 text-center text-[14px]">
                                        {slider.column.split('_').join(' ').toUpperCase()}
                                    </span>
                                    <div className="flex flex-col items-center w-full relative">
                                        <Slider
                                            range
                                            value={slider.range && slider.range.length === 2 ? slider.range.map((d) => new Date(d).getTime()) : [minDate, maxDate]}
                                            onChange={(val) => {
                                                const isoRange = val.map((ts) => new Date(ts).toISOString());
                                                setSelectedDates((prev) => prev.map((s) => (s.column === slider.column ? { ...s, range: isoRange } : s)));
                                                setFilteredData && setFilteredData(applyAllFilters(data));
                                            }}
                                            min={minDate}
                                            max={maxDate}
                                            step={24 * 60 * 60 * 1000}
                                            style={{ width: '100%' }}
                                            trackStyle={{ height: '4px' }}
                                            handleStyle={{ height: '14px', width: '14px', border: '2px solid #598931' }}
                                        />
                                        <div className="flex justify-between w-full text-sm text-gray-700 mt-1">
                                            <span className="text-[14px]">{slider.range && slider.range.length === 2 ? new Date(slider.range[0]).toLocaleDateString('en-GB') : new Date(minDate).toLocaleDateString('en-GB')}</span>
                                            <span className="text-[14px]">{slider.range && slider.range.length === 2 ? new Date(slider.range[1]).toLocaleDateString('en-GB') : new Date(maxDate).toLocaleDateString('en-GB')}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PreviewBtn;