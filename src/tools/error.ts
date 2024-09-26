import { enqueueSnackbar } from "notistack";
export class BusinessError extends Error {
  name = "业务异常";
  constructor(errorMessage: string) {
    super(errorMessage);
  }
}

/**
 * 默认异常处理器
 *
 * @param exception
 */
export function defaultExceptionHandler(exception: unknown) {
  console.debug(exception, typeof exception);
  let errorMessage = "unknow exception";
  if (exception instanceof Error) {
    errorMessage = exception.message;
  } else if (typeof exception === "object") {
    if ((exception as any)["message"]) {
      errorMessage = (exception as any).message;
    }
  }
  enqueueSnackbar(errorMessage, { variant: "error" });
}
