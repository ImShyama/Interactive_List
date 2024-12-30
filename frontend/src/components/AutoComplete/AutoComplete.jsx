import * as React from "react";
import { Check, ChevronsUpDown, Cross } from "lucide-react";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { IoClose } from "react-icons/io5";


export function AutoComplete({
  value = "",
  searchText = "",
  width = "100%",
  options,
  className = "",
  onChangeValue = () => {},
  renderLabel,
}) {
  const [value2, setValue2] = React.useState(String(value));
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState(String(value));

  // Filter options by both label and value
  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(search.toLowerCase()) ||
      option.value.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-[${width}] justify-between ${className}`}
            style={{ width }}
          >
            <p
              className="overflow-hidden whitespace-nowrap"
              style={{ textOverflow: "ellipsis" }}
            >
              {value2
                ? options.find((option) => option.value === value2)?.value
                : searchText}
            </p>
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0 z-50">
          <Command shouldFilter={false}>
            <div className="relative">
              <CommandInput
                placeholder="Search"
                className="h-9"
                value={search}
                onValueChange={setSearch}
              />
              <Button
                onClick={() => setSearch("")}
                variant="outline"
                className="absolute right-2 z-20 top-[50%] translate-y-[-50%] min-w-0 w-[fit-content] px-0 py-0 h-[fit-content]"
              >
                <IoClose />
              </Button>
            </div>
            <CommandList>
              <CommandEmpty>No data found.</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    className={`${
                      value2 === option.value
                        ? "bg-[hsl(var(--tab-selected))] data-[selected=true]:bg-[hsl(var(--tab-selected))] text-accent-foreground"
                        : ""
                    }`}
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      setOpen(false);
                      setSearch(currentValue);
                      setValue2(currentValue);
                      onChangeValue(option);
                    }}
                  >
                    {renderLabel(option)}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
