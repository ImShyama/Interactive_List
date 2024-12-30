import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";


type InputWithLabelProps =  {
    id: string; // ID for the input field, which is also linked to the label
    label?: string; // The text for the label
    type?: string; // The input type, defaulting to "text"
    required?: boolean; // Whether the input is required
    placeholder?: string; // Placeholder text for the input
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Change event handler
    className?: string; // Additional CSS classes for customization
    defaultValue?: string | number;
    multiline?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const InputWithLabel: React.FC<InputWithLabelProps> = ({
    id,
    label,
    type = "text",
    required = false,
    placeholder,
    onChange,
    className = "",
    defaultValue = "",
    multiline = false,
    ...props
}) => {
    return (
        <div className={`grid items-center gap-1.5 ${className}`}>
            <div className={`grid w-full items-center gap-1.5`}>
                {label && <Label htmlFor={id}>{label}</Label>}
                {!multiline && <Input {...props} width={"100%"} defaultValue={defaultValue} required={required} placeholder={placeholder} onChange={onChange} id={id} type={type} />}
                {multiline && type == "text" && <Textarea {...props} className="w-full" defaultValue={defaultValue} required={required} placeholder={placeholder} onChangeCapture={(e) => {
                    onChange({ target: { value: e.currentTarget.value } } as any);
                }} id={id} />}
            </div>
        </div>
    );
};

export default InputWithLabel;