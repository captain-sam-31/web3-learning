export interface IOptions {
  functionName: string;
  args?: unknown[];
  value?: bigint;
}
export interface IExtra {
  value?: bigint;
  gas?: bigint;
}
export interface ResultInfo {
  succ: (data?: unknown, resMsg?: string) => ResultItem;
  fail: (data?: unknown, resMsg?: string) => ResultItem;
}
export interface ResultItem {
  data: unknown;
  resCode: number;
  resMsg: string;
}
