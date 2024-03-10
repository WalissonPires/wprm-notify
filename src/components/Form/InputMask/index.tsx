import { forwardRef } from "react";
import InputMaskRect, { Props as InputMaskRectProps } from "react-input-mask";

export const InputMask = forwardRef<HTMLInputElement, InputMaskProps>(function InputMask({ mask, value, maskPlaceholder, preserveMask, onChange, maxLength, className, ...props }, ref) {

    const maskChar = maskPlaceholder || (props as any).maskChar || '';

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        const maskOptions = {
            mask,
            maskChar,
            preserveMask
        };

        const value = event.target.value; //unmaskValue(event.target.value, maskOptions);
        onChange(event, value);

        // [Fix] When using with react-hook-form: during form submit value is outdated.
        setTimeout(() => {

            const value = event.target.value; //unmaskValue(event.target.value, maskOptions);
            onChange(event, value);
        }, 0);
    }

    return <InputMaskRect inputRef={ref} mask={mask} value={value} onChange={handleChange}
        className={`appearance-none bg-transparent w-full border-b border-teal-400 hover:border-teal-500 text-gray-700 py-1 px-2 leading-tight focus:outline-none ${className ?? ''}`}
        {...{ maskChar: maskChar }} {...props} />;
});

type InputMaskProps = Omit<InputMaskRectProps, 'onChange'> & {
    preserveMask?: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>, unmaskedValue: string) => void;
}

export function unmaskValue (value: string, options: InputMaskOptions) {

    const { mask, maskChar, preserveMask } = options;

    let unmaskedValue = '';
    for (let i = 0; i < value.length; i++) {

        const isValueChar = mask[i] === '9' || mask[i] === 'a' || mask[i] === '*';
        const isMaskChar = value[i] === maskChar;

        if ((isValueChar || preserveMask) && !isMaskChar)
            unmaskedValue += value[i];
    }

    return unmaskedValue;
}

export function maskValue (value: string, options: InputMaskOptions) {

    if (!value) return value;

    const { mask } = options;

    let newValue = '';

    let i = 0;
    const lastIndex = value.length - 1;

    for (const maskChar of mask) {

        if (maskChar === '9' || maskChar === 'a' || maskChar === '*') {

            if (i > lastIndex) break;

            newValue += value[i];
            i++;
        }
        else {
            newValue += maskChar;
        }
    }

    return newValue;
}

interface InputMaskOptions {
    mask: string | (string | RegExp)[],
    maskChar?: string,
    preserveMask?: boolean
}