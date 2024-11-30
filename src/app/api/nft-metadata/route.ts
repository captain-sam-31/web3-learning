import { ResultItem } from "@/utils/types";
import { apiRes } from "@/utils/utils";
import { NextResponse } from "next/server";

// 获取 NFT MetaData 的json文件
export async function GET() {
  let resInfo: ResultItem;
  // 若涉及到敏感信息，基于安全性考虑，要放在后台处理，即此处的node环境）
  try {
    const res = await fetch(`${process.env.NFT_IPFS_JSON_URL}`);
    const data = await res.json();
    resInfo = apiRes.succ(data);
  } catch (err) {
    resInfo = apiRes.fail(err);
  }
  return NextResponse.json(resInfo);
}
