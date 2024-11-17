import { bgBlock } from "@/utils/commonClass";
import { cn, Spinner, SpinnerProps } from "@nextui-org/react";
import { memo } from "react";

interface SpinningProps extends SpinnerProps {
  visible?: boolean;
}
// 需要自行设置父元素的定位
const Spinning = (props: SpinningProps) => {
  const { visible, ...rest } = props;

  return visible ? (
    <div className={cn("absolute rounded-large flex items-center justify-center size-full z-[999]", bgBlock)}>
      <Spinner label="Loading..." {...rest} />
    </div>
  ) : null;
};

export default memo(Spinning);
