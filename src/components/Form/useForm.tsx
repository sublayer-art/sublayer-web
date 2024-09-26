import { useFormik } from "formik";
import { useRef } from "react";

export type FormInstance = ReturnType<typeof useFormik>;

export function useForm() {
  const instance = useRef<FormInstance>(null);
  return instance;
}
