import { useMessage } from "@/app/components/MessageProvider";
import { useMutation } from "@tanstack/react-query";
import { useMount } from "ahooks";

interface OptType {
  manual: boolean;
  initParam?: unknown;
}
// 请求速度最慢，比useRequest还慢，不想用（useQuery默认首次会自动执行，useMutation则不会）
export const useMutate = (service: (params?: unknown) => Promise<any>, opt: OptType = { manual: false }) => {
  const { errorMsg } = useMessage();

  const { mutate, data, isPending } = useMutation({
    mutationFn: async (params: unknown) => {
      const res = await service(params);
      const data = res?.json ? await res.json() : res;
      return data;
    },
    onError: (err) => {
      errorMsg(err.message);
    },
  });

  useMount(() => {
    if (!opt?.manual) {
      mutate(opt.initParam);
    }
  });

  return { data, loading: isPending, run: mutate };
};
