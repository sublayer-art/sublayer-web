import { Box, IconButton, Stack, Typography } from "@mui/material";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { FormItemContext } from "./FormItem";
import FormContext from "./context";
import { getIn } from "formik";
import CloseOutlined from "@mui/icons-material/CloseOutlined";

const FormUpload: React.FC<UploadProps> = ({ ...resetProps }) => {
  const formik = useContext(FormContext);
  const { name, disabled } = useContext(FormItemContext);
  const value = getIn(formik.values, name);
  return (
    <Upload
      {...resetProps}
      onChange={(files) => {
        formik.setFieldValue(name, files);
      }}
      name={name}
      disabled={disabled}
      value={value || ""}
    />
  );
};
export default FormUpload;

type UploadProps = {
  onChange?: (files: File[]) => void;
  value?: string | string[];
  multiple?: boolean;
  disabled?: boolean;
  name?: string;
};

function Upload(props: UploadProps) {
  const { name, onChange, multiple, disabled } = props;
  const [files, setFiles] = useState<File[]>([]);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (onChange) {
      onChange(files);
    }
  }, [files]);

  const updateInputFileList = useCallback(() => {
    if (ref.current) {
      const dataTransfer = new DataTransfer();
      files.forEach((file) => {
        dataTransfer.items.add(file);
      });

      ref.current.files = dataTransfer.files;
    }
  }, [files]);

  useEffect(() => {
    updateInputFileList();
  }, [updateInputFileList]);

  const appendFiles = useCallback(
    (newFiles: File[]) => {
      if (multiple) {
        setFiles((files) => [...files, ...newFiles]);
      } else if (newFiles.length > 0) {
        setFiles([newFiles[0]]);
      }
    },
    [multiple]
  );

  const dropRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const dropArea = dropRef.current;

    function preventDefaults(e: Event) {
      e.preventDefault();
      e.stopPropagation();
    }

    function handleDrop(e: DragEvent) {
      const dt = e.dataTransfer;
      if (dt) {
        const dtFiles = dt.files;
        appendFiles(Array.from(dtFiles || []));
      }
    }
    if (dropArea) {
      // 阻止浏览器默认行为
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
      });

      dropArea.addEventListener("drop", handleDrop, false);

      return () => {
        ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
          dropArea.removeEventListener(eventName, preventDefaults, false);
          document.body.removeEventListener(eventName, preventDefaults, false);
        });

        dropArea.removeEventListener("drop", handleDrop, false);
      };
    }
  }, [appendFiles]);

  return (
    <Box>
      <Box
        ref={dropRef}
        sx={{
          p: 2.5,
          borderRadius: 1,
          borderWidth: 1,
          borderStyle: "dashed",
          borderColor: "rgba(255, 255, 255, 0.23)",
          cursor: "pointer",

          "&:hover": {
            borderColor: "primary.main",
          },
        }}
        onClick={() => {
          console.log("ccc");
          ref.current?.click();
        }}
      >
        <input
          name={name}
          disabled={disabled}
          type="file"
          ref={ref}
          multiple={multiple}
          style={{ display: "none" }}
          onChange={(e) => {
            appendFiles(Array.from(e.target.files || []));
          }}
        />
        <Stack alignItems="center">
          <svg
            width="52.979980"
            height="52.979980"
            viewBox="0 0 52.98 52.98"
            fill="none"
          >
            <defs>
              <clipPath id="clip275_484">
                <rect
                  id="svg"
                  width="52.979965"
                  height="52.979980"
                  fill="white"
                  fillOpacity="0"
                />
              </clipPath>
            </defs>
            <g clipPath="url(#clip275_484)">
              <path
                id="path"
                d="M17.2853 32.6558C17.108 31.5776 16.1708 30.7993 15.093 30.8374C12.396 30.9331 9.69922 31.0352 7.00256 31.1426C5.82812 31.1895 4.91443 32.1821 4.96924 33.3726C5.10876 36.4136 5.45459 41.9648 6.2124 45.1851C6.5592 46.6616 7.84326 47.4922 9.33655 47.603C11.8444 47.7886 16.8547 48.0132 26.4385 48.0132C36.0221 48.0132 41.0325 47.7886 43.5403 47.603C45.0337 47.4922 46.3176 46.6611 46.6646 45.1851C47.4224 41.9648 47.7681 36.4136 47.9077 33.3726C47.9625 32.1821 47.0488 31.1895 45.8744 31.1426C43.9215 31.0649 40.8661 30.9463 37.7839 30.8374C36.7061 30.7993 35.7688 31.5776 35.5917 32.6558L35.3373 34.2021C35.1644 35.2534 34.2681 36.0234 33.217 36.0234L19.6599 36.0234C18.6089 36.0234 17.7125 35.2534 17.5397 34.2021L17.2853 32.6558Z"
                fill="#E0CC74"
                fillRule="nonzero"
              />
              <path
                id="path"
                d="M31.072 18.4316C32.6394 18.3926 33.9083 18.335 34.9304 18.2705C36.9617 18.1426 37.8419 16.2231 36.6052 14.6104C35.7764 13.5298 34.6642 12.1602 33.1913 10.4751C31.0193 7.99121 29.3715 6.53467 28.2474 5.69189C27.1428 4.86328 25.7343 4.86328 24.6285 5.69141C23.5044 6.53418 21.8564 7.99121 19.6847 10.4751C18.2117 12.1597 17.1006 13.5293 16.2719 14.6099C15.0339 16.2227 15.9154 18.1426 17.9476 18.2705C18.9686 18.335 20.2375 18.3926 21.804 18.4316C21.7986 19.1479 21.7953 19.9351 21.7953 20.8008C21.7953 24.167 21.8436 26.3545 21.894 27.7324C21.9446 29.0996 22.6036 30.3501 23.9489 30.6196C24.5791 30.7456 25.3939 30.8359 26.4385 30.8359C27.4819 30.8359 28.298 30.7456 28.9282 30.6196C30.2722 30.3501 30.9315 29.0996 30.9818 27.7324C31.0334 26.3545 31.0806 24.167 31.0806 20.8008C31.0806 19.9351 31.0775 19.1475 31.072 18.4316Z"
                fill="#E0CC74"
                fillRule="nonzero"
              />
            </g>
          </svg>

          <Typography mt={1}>
            Upload your files here or click to select files
          </Typography>
          <Typography variant="caption" color="rgb(183, 183, 183)">
            .jpg .webp .png .gif .txt .mp3 .mp4 and more
          </Typography>
        </Stack>
      </Box>
      {files.map((file, index) => {
        return (
          <Box
            key={index}
            sx={{
              borderRadius: 1,
              border: "solid 1px",
              borderColor: "primary.main",
              pl: 2,
              pr: 0.5,
              mt: 1,
              py: 0.5,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                overflow: "hidden",
              }}
            >
              <Typography
                color="primary"
                flex={1}
                textOverflow="ellipsis"
                overflow="hidden"
                whiteSpace="nowrap"
              >
                {file.name}
              </Typography>
              <IconButton
                size="small"
                sx={{ flexShrink: 0 }}
                onClick={() => {
                  setFiles((files) => {
                    files.splice(index, 1);
                    const newFiles = [...files];
                    return newFiles;
                  });
                }}
              >
                <CloseOutlined />
              </IconButton>
            </Stack>
          </Box>
        );
      })}
    </Box>
  );
}
