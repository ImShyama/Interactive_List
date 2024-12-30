import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label";

interface SelectOptions {
    value: string | number;
    label: string
}

interface SelectWithLabelProps {
    id: string; // ID for the input field, which is also linked to the label
    label?: string; // The text for the label
    required?: boolean; // Whether the input is required
    onChange?: (value: string) => void; // Change event handler
    className?: string; // Additional CSS classes for customization
    options: string[] | SelectOptions[];
    defaultValue?: string | number;
    placeholder?: string;
}

const SelectWithLabel: React.FC<SelectWithLabelProps> = ({
    id,
    label,
    required = false,
    onChange,
    className = "",
    options = [],
    defaultValue = "",
    placeholder = ""
}) => {
    return (
        <div className={`grid max-w-sm items-center gap-1.5 ${className}`} id={id}>
            <div className={`grid w-full max-w-sm items-center gap-1.5`}>
                {label && <Label>{label}</Label>}
                <Select defaultValue={`${defaultValue}`} required={required} onValueChange={onChange}>
                    <SelectTrigger className={`w-[180px] ${className}`}>
                        <SelectValue placeholder={placeholder ?? `Select a ${label}`} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {
                                options.map((option) => (
                                    typeof option === "object" ? <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem> :
                                        <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default SelectWithLabel;