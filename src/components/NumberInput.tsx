import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Button, Divider, Stack, SxProps } from "@mui/material";
import React, { useCallback, useState } from "react";


type NumberInputProps = {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  sx?: SxProps;
  disabled?: boolean;
  decimal?: number;
  placeholder?: string;
  name?: string;
};

const NumberInput: React.FC<NumberInputProps> = (props) => {
  const {
    value: propValue,
    onChange,
    sx,
    step = 1,
    min = 0,
    max,
    disabled = false,
    decimal = 0,
    placeholder,
    name
  } = props;

  // 内部状态用于非受控模式，使用空字符串作为默认值
  const [internalValue, setInternalValue] = useState<string | number>(propValue ?? '');
  
  // 使用 propValue 或 internalValue
  const value = propValue ?? internalValue;

  if (decimal < 0) {
    throw Error("decimal must be greater than 0");
  }

  const numberInRange = useCallback(
    (value: number) => {
      if (max !== undefined || min !== undefined) {
        return Math.max(Math.min(value, max ?? Infinity), min ?? -Infinity);
      }
      return value;
    },
    [max, min]
  );

  const handleValueChange = useCallback((newValue: string | number) => {
    if (onChange) {
      // 当传入onChange时，需要转换成数字
      const numValue = typeof newValue === 'string' ? (newValue === '' ? 0 : parseFloat(newValue)) : newValue;
      onChange(numValue);
    } else {
      setInternalValue(newValue);
    }
  }, [onChange]);

  const increase = useCallback(() => {
    const currentValue = value === '' ? 0 : Number(value);
    const newValue = numberInRange(currentValue + step);
    handleValueChange(newValue);
  }, [numberInRange, step, value, handleValueChange]);

  const reduce = useCallback(() => {
    const currentValue = value === '' ? 0 : Number(value);
    const newValue = numberInRange(currentValue - step);
    handleValueChange(newValue);
  }, [numberInRange, step, value, handleValueChange]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      handleValueChange('');
      return;
    }
    
    if (inputValue === '00') {
      handleValueChange('0');
      return;
    }
    
    if (decimal > 0 && inputValue === '.') {
      handleValueChange('0.');
      return;
    }

    const reg = decimal > 0
      ? new RegExp(`^[+-]?(\\d+([.]\\d{0,${decimal}})?)$`)
      : new RegExp(/^[+-]?(\d+)$/);

    if (reg.test(inputValue)) {
      handleValueChange(inputValue);
    }
  }, [decimal, handleValueChange]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      handleValueChange('');
      return;
    }
    const numValue = parseFloat(inputValue);
    const newValue = numberInRange(numValue);
    handleValueChange(newValue);
  }, [numberInRange, handleValueChange]);

  const disabledIncrease = value !== '' && max !== undefined && Number(value) >= max;
  const disabledReduce = value !== '' && min !== undefined && Number(value) <= min;

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={(theme) => ({
        borderColor: theme.palette.divider,
        borderWidth: 1,
        height: 40,
        borderStyle: "solid",
        borderRadius: "6px",
        maxHeight: 56,

        "&:hover,&:focus-within": disabled
          ? {
              cursor: "not-allowed",
            }
          : {
              borderColor: theme.palette.primary.main,
            },

        input: {
          px: 1,
          flex: 1,
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
          cursor: "inherit",
          border: "none",
          outline: "none",
          color: "inherit",
          fontFamily: "inherit",
          fontSize: "inherit",
        },
        ...(sx as any),
      })}
    >
      <input
        value={value}
        inputMode="decimal"
        name={name}
        type="text"
        pattern="[0-9]*(.[0-9]+)?"
        placeholder={placeholder}
        disabled={disabled}
        onChange={handleInputChange}
        onBlur={handleBlur}
      />

      <Stack
        sx={(theme) => ({
          borderLeft: "solid 1px",
          borderColor: theme.palette.divider,
          height: "100%",

          "> button": {
            flex: 1,
            width: 24,
            padding: 0,
            minWidth: "unset",
            borderRadius: 0,
            overflow: "hidden",
            height: "100%",
          },
        })}
      >
        <Button onClick={increase} disabled={disabled || disabledIncrease}>
          <ArrowDropUp />
        </Button>
        <Divider />
        <Button onClick={reduce} disabled={disabled || disabledReduce}>
          <ArrowDropDown />
        </Button>
      </Stack>
    </Stack>
  );
};

export default NumberInput;
