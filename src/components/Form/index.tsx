import { FormikValues, useFormik } from "formik";
import { FormInstance } from "./useForm";
import FormContext from "./context";
import React, { PropsWithChildren } from "react";
import { Box } from "@mui/material";

type FormProps = {
  initialValues?: FormikValues;
  form?: FormInstance;
  onSubmit?: (values: FormikValues) => Promise<void>;
};

const Form = React.forwardRef<FormInstance, PropsWithChildren<FormProps>>(
  (props, ref) => {
    const { children, initialValues = {} as any, onSubmit } = props;

    const formik = useFormik({
      initialValues,
      onSubmit: async (values, { setSubmitting }) => {
        await onSubmit?.(values);
        setSubmitting(false);
      },
    });

    React.useImperativeHandle(ref, () => formik);
    return (
      <FormContext.Provider value={formik}>
        <Box
          component="form"
          sx={{
            "> :not(:last-child)": {
              mb: 3,
            },
          }}
          onSubmit={formik.handleSubmit}
        >
          {children}
        </Box>
      </FormContext.Provider>
    );
  }
);
export default Form;
