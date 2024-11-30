import { useMessage } from "@/app/components/MessageProvider";
import { useMount, useUpdateEffect } from "ahooks";
import { useState } from "react";

interface OptType {
  manual?: boolean;
  initParam?: { [key: string]: unknown };
  refreshDeps?: unknown[];
}
type ServiceType = (params?: any) => Promise<any>;
// ahooks的useRequest有点慢，react-query更慢，自己写个简单版好像快一点
export const useFetch = (service: ServiceType, opt: OptType = { manual: false, refreshDeps: [] }) => {
  const { manual, refreshDeps } = opt;
  const { errorMsg } = useMessage();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>();

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
        const jsonData = await res.json();
        if (jsonData.resCode === 1000) {
          setData(jsonData.data);
        } else {
          throw new Error(JSON.stringify(jsonData.data));
        }
      })
      .catch((err) => {
        errorMsg(err.message || "Fetch Failed");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { data, loading, run: handleRequest };
};
