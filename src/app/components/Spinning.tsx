import { bgBlock } from "@/utils/commonClass";
import { cn, Spinner, SpinnerProps } from "@nextui-org/react";
import { memo } from "react";

interface SpinningProps extends SpinnerProps {
  visible?: boolean;
  zIndex?: number;
}
// 需要自行设置父元素的定位
const Spinning = (props: SpinningProps) => {
  const { visible, zIndex, ...rest } = props;

  return visible ? (
    <div
      className={cn("absolute left-0 top-0 size-full rounded-large flex items-center justify-center backdrop-blur-sm", bgBlock)}
      style={{ zIndex: zIndex ?? 30 }}
    >
      <Spinner label="Loading..." {...rest} />
    </div>
  ) : null;
};

export default memo(Spinning);
