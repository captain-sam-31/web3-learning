// 用于node环境调用fetch时，拼上 域名或IP（client模式可用原生fetch，会自动拼）
export const wFetch = async (url: string, options?: RequestInit) => {
  const newUrl = !url.includes("http") ? `${process.env.__NEXT_PRIVATE_ORIGIN}${url}` : url;
  return fetch(newUrl, options);
};
// 缩写地址
export const shortAddr = (addr: string, length: number = 4) => {
  const reg = new RegExp(`^(\\w{${length}})(\\w*)(\\w{${length}})$`, "i");
  return addr.replace(reg, (...all) => `${all[1]}...${all[3]}`);
};
// 数字千分位（支持小数点）
export const thousands = (num: string | number) => {
  let [intPart, decPart] = String(num).split(".");
  decPart = decPart ? `.${decPart}` : "";
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${intPart}${decPart}`;
};
