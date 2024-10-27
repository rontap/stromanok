import {Slider, TextField} from "@radix-ui/themes";
import React, {useEffect, useState} from "react";

type SliderInputProps = {
    initialValue: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    placeholder: string;
}
export default function SliderInput({initialValue, onChange, min, max, placeholder}: SliderInputProps) {
    const [value, setValue] = useState(initialValue)
    useEffect(() => {
        if (value !== initialValue) {
            setValue(initialValue);
        }
    }, [initialValue])

    const handleSliderChange = (newValue) => {
        setValue(newValue[0]); // Ensure the first value is used for single slider
        onChange(newValue[0]);
    };

    const handleInputChange = (event) => {
        const inputValue = Number(event.target.value);
        if (!isNaN(inputValue) && inputValue >= 0 && inputValue <= 100) {
            setValue(inputValue);
            onChange(newValue[0]);

        }
    };

    return <div className="grid grid-cols-2 gap-4 align-middle">

        <Slider style={{marginTop: '10px'}} className="grid-span-2" min={min} max={max} value={[value]}
                onValueChange={handleSliderChange}/>
        <TextField.Root

            type="number"
            min={min}
            max={max}
            onChange={handleInputChange}
            value={value}
            variant="surface" placeholder={placeholder}/>
    </div>
}