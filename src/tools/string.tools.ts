/**
 * 截断字符串，保留指定长度的开始和结束部分，并在中间添加省略号。
 * @param str 要截断的字符串。
 * @param startLen 开始部分保留的字符长度，默认为8。
 * @param endLen 结束部分保留的字符长度，默认为8。
 * @returns 返回截断后的字符串。
 */
export function truncateString(
  str: string,
  startLen: number = 8,
  endLen: number = 8
): string {
  // 确保开始和结束长度非负
  startLen = Math.max(startLen, 0);
  endLen = Math.max(endLen, 0);

  // 如果字符串长度小于或等于开始长度加结束长度，则直接返回原字符串
  if (str.length <= startLen + endLen) {
    return str;
  }

  // 处理任一长度为0的情况，考虑仅显示一侧
  if (startLen === 0 && endLen > 0) {
    return "..." + str.substring(str.length - endLen);
  }
  if (endLen === 0 && startLen > 0) {
    return str.substring(0, startLen) + "...";
  }

  // 处理常规情况，结合开始、结束长度和省略号
  return (
    str.substring(0, startLen) + "..." + str.substring(str.length - endLen)
  );
}
