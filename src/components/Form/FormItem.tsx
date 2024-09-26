import {
  FormControl,
  FormControlProps,
  FormHelperText,
  InputLabel,
} from "@mui/material";
import React, { PropsWithChildren, createContext, useContext } from "react";
import { FieldValidator, getIn } from "formik";
import FormContext from "./context";

type FormItemProps = {
  name: string;
  label?: React.ReactNode;
  helpText?: string;
  validate?: FieldValidator;
} & FormControlProps;

const FormItem: React.FC<PropsWithChildren<FormItemProps>> = ({
  label,
  // helpText,
  children,
  name,
  required,
  validate,
  ...reset
}) => {
  if (!children) {
    throw Error("children is required");
  }
  const formik = useContext(FormContext);
  const touched = getIn(formik.touched, name);
  const error = getIn(formik.errors, name);
  // const [_, meta, __] = useField(name || "");
  if (name) {
    if (required) {
      formik.registerField(name, {
        validate: (value) => {
          if (!value || !value?.length) {
            return `${name} is required`;
          }
          if (validate) {
            return validate(value);
          }
        },
      });
    }
  }

  return (
    <FormItemContext.Provider value={{ name, ...reset }}>
      <FormControl
        fullWidth
        error={touched && error ? true : false}
        required={false}
        {...reset}
        sx={{
          label: {
            position: "relative",
            mb: 0.5,
          },

          ".MuiInputBase-adornedEnd": {
            paddingRight: "6px",
          },
          ".MuiFormHelperText-root": {
            marginLeft: 0,
          },
          input: {
            borderRadius: 4,
            position: "relative",
            fontSize: 16,
            padding: "12px 12px",
          },


          ...reset.sx,
        }}
      >
        {typeof label === "string" ? (
          <InputLabel shrink sx={{ transform: "unset" }}>
            {label}
          </InputLabel>
        ) : (
          label
        )}
        {children}
        {touched && error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    </FormItemContext.Provider>
  );
};
export default FormItem;
export const FormItemContext = createContext(
  {} as { name: string; disabled?: boolean }
);
