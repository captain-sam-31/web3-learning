import { bgBlock } from "@/utils/commonClass";
import { FileSearchOutlined } from "@ant-design/icons";
import { cn } from "@nextui-org/react";
import { memo } from "react";
interface IEmpty {
  loading?: boolean;
}
const Empty = (props: IEmpty) => {
  const { loading } = props;

  return loading ? null : (
    <div className={cn("size-full flex justify-center items-center gap-3 text-2xl", bgBlock)}>
      <FileSearchOutlined className="text-3xl" />
      <div>No data found</div>
    </div>
  );
};
export default memo(Empty);
