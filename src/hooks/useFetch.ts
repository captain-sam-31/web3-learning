import { useMyRedux } from "@/redux";
import { useMount, useUpdateEffect } from "ahooks";
import { useState } from "react";

interface OptType {
  manual?: boolean;
  initParam?: unknown;
  refreshDeps?: unknown[];
}
type ServiceType = (params?: unknown) => Promise<any>;
// ahooks的useRequest好像返回有点慢，自己写个简单版的返回比较快
export const useFetch = (service: ServiceType, opt: OptType = { manual: false, refreshDeps: [] }) => {
  const { manual, refreshDeps } = opt;
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>();
  const { setMsg } = useMyRedux((state) => state);

  useMount(() => {
    if (!manual) {
      handleRequest(opt.initParam);
    }
  });

  useUpdateEffect(() => {
    handleRequest(opt.initParam);
  }, refreshDeps);

  const handleRequest = async (params?: unknown) => {
    setLoading(true);
    service(params)
      .then(async (res) => {
        const d = res?.json ? await res.json() : res;
        setData(d);
      })
      .catch((err) => {
        setMsg({ type: "err", content: err.message });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { data, loading, run: handleRequest };
};
