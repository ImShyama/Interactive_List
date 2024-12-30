import { Input } from '../ui/input'


function InputWithIcon({ icon, ...props }) {
    return (
        <div className='relative'>
            {icon && <img src={icon} className='w-[16px] h-[16px] absolute top-[50%] translate-y-[-50%] left-[8px]' alt="" />}
            <Input {...props} className={`${icon ? 'pl-[30px]' : ""}`} />
        </div>
    )
}

export default InputWithIcon;