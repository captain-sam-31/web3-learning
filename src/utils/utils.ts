import { traceDomain } from "./constants";

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
// BigInt格式化千分位（支持小数）
export const thousands = (s: string, digist: number = 2) => {
  const dec = 18; // waterToken精度为18位
  let intPart = s.length <= dec ? "0" : s.slice(0, -dec);
  const sArr = s.split("");
  s.length < dec && sArr.splice(0, 0, new Array(dec - s.length).fill("0").join(""));
  const newS = sArr.join("");
  let decPart = newS.slice(-dec).slice(0, -(dec - digist));
  decPart = decPart ? `.${decPart}` : "";
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${intPart}${decPart}`;
};
// 合约追踪
export const tracer = (address: string) => {
  return `${traceDomain}/${address}`;
};
// 将合约的uint类型转为string
export const bigToString = (num: unknown) => {
  return ((num || 0) as bigint).toString();
};
