import { IconButton, OutlinedInput, OutlinedInputProps } from "@mui/material";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import React, { useContext } from "react";
import { FormItemContext } from "./FormItem";
import FormContext from "./context";
import { getIn } from "formik";

const FormInput: React.FC<OutlinedInputProps & { allowClear?: boolean }> = ({
  allowClear = false,
  ...resetProps
}) => {
  const formik = useContext(FormContext);
  const { name, disabled } = useContext(FormItemContext);
  const value = getIn(formik.values, name);
  return (
    <OutlinedInput
      sx={{
        "input:placeholder-shown + .clear": {
          display: "none",
        },
      }}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      endAdornment={
        allowClear ? (
          <IconButton
            className="clear"
            disabled={disabled}
            tabIndex={-1}
            size="small"
            onClick={() => {
              formik.setFieldValue(name, "");
            }}
          >
            <CloseOutlined />
          </IconButton>
        ) : null
      }
      {...resetProps}
      name={name}
      disabled={disabled}
      value={value || ""}
      
    />
  );
};
export default FormInput;
