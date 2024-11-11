import { Spinner, SpinnerProps } from "@nextui-org/react";
import { memo } from "react";

interface SpinningProps extends SpinnerProps {
  visible?: boolean;
}
// 需要自行设置父元素的定位
const Spinning = (props: SpinningProps) => {
  const { visible, ...rest } = props;

  return visible ? <Spinner className="absolute top-1/2 left-1/2" {...rest} /> : null;
};

export default memo(Spinning);
