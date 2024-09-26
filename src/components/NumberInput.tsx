import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Button, Divider, Stack, SxProps } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";

const parseNumber = (value?: string, decimal = 0) => {
  if (!value) return 0;
  if (decimal > 0) {
    const float = parseFloat(value);
    if (isNaN(float)) return 0;
    const v = 10 ** decimal;
    return Math.round(float * v) / v;
  }
  return parseInt(value);
};

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
};

const NumberInput: React.FC<NumberInputProps> = (props) => {
  const {
    value,
    onChange,
    sx,
    step = 1,
    min = 0,
    max = 50,
    disabled = false,
    decimal = 0,
    placeholder,
  } = props;
  if (decimal < 0) {
    throw Error("decimal must be greater than 0");
  }

  const [inputValue, setInputValue] = useState("");

  const numberInRange = useCallback(
    (value: number) => {
      if (max !== undefined || min != undefined) {
        return Math.max(Math.min(value, max ?? 0), min ?? 0);
      }
      return value;
    },
    [max, min]
  );

  useEffect(() => {
    if (value !== undefined) {
      setInputValue((v) => {
        if (parseNumber(v, decimal) !== value) {
          return value.toString();
        }
        return v;
      });
    }
  }, [decimal, value]);

  const [triggerChange, setTriggerChange] = useState(0);

  const onValueChange = useCallback(() => {
    if (onChange) {
      let parsedNumber = parseNumber(inputValue, decimal);
      if (parsedNumber !== value) {
        parsedNumber = numberInRange(parsedNumber);
        onChange(parsedNumber);
      }
    }
  }, [decimal, inputValue, numberInRange, onChange, value]);

  useEffect(() => {
    if (triggerChange) {
      onValueChange();
    }
  }, [triggerChange]);

  const [disabledIncrease, setDisabledIncrease] = useState(false);
  const [disabledReduce, setDisabledReduce] = useState(false);

  useEffect(() => {
    const v = value || 0;
    setDisabledIncrease(v >= max);
    setDisabledReduce(v <= 0);
  }, [min, max, value]);

  const increase = useCallback(() => {
    const v = inputValue;
    let num = parseNumber((+v + step) as unknown as string, decimal);
    num = numberInRange(num);
    setInputValue(num + "");
    setTriggerChange((v) => v + 1);
  }, [numberInRange, step, decimal, inputValue]);

  const reduce = useCallback(() => {
    const v = inputValue;
    let num = parseNumber((+v - step) as unknown as string, decimal);
    num = numberInRange(num);
    setInputValue(num + "");
    setTriggerChange((v) => v + 1);
  }, [numberInRange, step, decimal, inputValue]);

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
        value={inputValue}
        inputMode="decimal"
        type="text"
        pattern="[0-9]*(.[0-9]+)?"
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => {
          const inputValue = e.target.value;
          if (inputValue) {
            if (inputValue === "00") {
              setInputValue("0");
            } else if (decimal > 0 && inputValue === ".") {
              setInputValue("0.");
            } else {
              const reg =
                decimal > 0
                  ? new RegExp(`^[+-]?(\\d+([.]\\d{0,${decimal}})?)$`)
                  : new RegExp(/^[+-]?(\d+)$/);
              if (reg.test(inputValue)) {
                setInputValue(inputValue);
              }
            }
          } else {
            setInputValue("");
          }
          setTriggerChange((v) => v + 1);
        }}
        onBlur={(e) => {
          const inputValue = e.target.value;
          setInputValue(numberInRange(+inputValue) + "");
        }}
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
