import { useMyRedux } from "@/redux";
import { useMutation } from "@tanstack/react-query";
import { useMount } from "ahooks";

interface OptType {
  manual: boolean;
  initParam?: unknown;
}
// 请求速度最慢，比useRequest还慢，不想用
export const useMutate = (service: (params?: unknown) => Promise<any>, opt: OptType = { manual: false }) => {
  const { setMsg } = useMyRedux((state) => state);

  const { mutate, data, isPending } = useMutation({
    mutationFn: async (params: unknown) => {
      const res = await service(params);
      const data = res?.json ? await res.json() : res;
      return data;
    },
    onError: (err) => {
      setMsg({ type: "err", content: err.message });
    },
  });

  useMount(() => {
    if (!opt?.manual) {
      mutate(opt.initParam);
    }
  });

  return { data, loading: isPending, run: mutate };
};
