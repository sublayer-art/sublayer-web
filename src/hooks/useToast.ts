import { OptionsWithExtraProps, useSnackbar } from "notistack";
export default function useToast() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleShowToast = (
    message: string,
    opt: OptionsWithExtraProps<any>
  ) => {
    return enqueueSnackbar(message, opt);
  };

  return {
    show: handleShowToast,
    success(message: string, opt?: OptionsWithExtraProps<"default">) {
      return handleShowToast(message, { ...opt, variant: "success" });
    },
    error(message: string, opt?: OptionsWithExtraProps<"default">) {
      return handleShowToast(message, { ...opt, variant: "error" });
    },
    close: closeSnackbar,
  };
}
