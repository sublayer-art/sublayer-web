/**
 * 选择图片
 *
 * @returns
 */
export function selectImage() {
  return new Promise<File>((resolve, reject) => {
    try {
      const inptuEl = document.createElement("input");

      inptuEl.id = "uploadImage";
      inptuEl.type = "file";
      inptuEl.accept = "image/*";
      inptuEl.style.position = "fixed";
      inptuEl.style.zIndex = "-1";
      inptuEl.style.opacity = "0";

      inptuEl.onchange = (e: any) => {
        if (e.target) {
          const files = e.target.files;
          if (files && files[0]) {
            resolve(files[0]);
          }
        } else {
          reject("e.target is undefined");
        }

        inptuEl.remove();
      };

      document.body.append(inptuEl);
      inptuEl.click();
      // const clickEvent = new Event('click');
      // inptuEl.dispatchEvent(clickEvent);
    } catch (error) {
      reject(error);
    }
  });
}
export function selectFiles() {
  return new Promise<FileList>((resolve, reject) => {
    try {
      const inptuEl = document.createElement("input");

      inptuEl.id = "uploadfiles";
      inptuEl.type = "file";
      inptuEl.multiple = true;
      // inptuEl.accept = "image/*";
      inptuEl.style.position = "fixed";
      inptuEl.style.zIndex = "-1";
      inptuEl.style.opacity = "0";

      inptuEl.onchange = (e: any) => {
        if (e.target) {
          const files = e.target.files;
          if (files) {
            resolve(files);
          }
        } else {
          reject("e.target is undefined");
        }

        inptuEl.remove();
      };

      document.body.append(inptuEl);
      inptuEl.click();
      // const clickEvent = new Event('click');
      // inptuEl.dispatchEvent(clickEvent);
    } catch (error) {
      reject(error);
    }
  });
}

export function download(src: string, fileName = "image.jpg") {
  const link = document.createElement("a");
  link.download = fileName;
  link.href = src;
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
