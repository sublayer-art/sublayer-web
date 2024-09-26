import { createContext } from "react";
import { FormikProps } from "formik";

// const FormContext = createContext({} as FormContextState);
const FormContext = createContext<FormikProps<any>>({} as FormikProps<any>);

export default FormContext;
