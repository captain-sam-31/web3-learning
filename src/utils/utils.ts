// 缩写地址
export const shortAddr = (addr: string, length: number = 4) => {
  const reg = new RegExp(`^(\\w{${length}})(\\w*)(\\w{${length}})$`, "i");
  return addr.replace(reg, (...all) => `${all[1]}...${all[3]}`);
};
