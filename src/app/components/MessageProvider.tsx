import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, ButtonProps } from "@nextui-org/react";
import { createContext, useCallback, useContext, useState } from "react";

type MessageFun = (msg: string) => void;
interface IMessage {
  successMsg: MessageFun;
  errorMsg: MessageFun;
  infoMsg: MessageFun;
}
interface IMessageOptions {
  visible: boolean;
  content: string;
  type: "info" | "succ" | "err";
}
const IconList = {
  info: <ExclamationCircleOutlined className="text-[40px] text-primary" />,
  succ: <CheckCircleOutlined className="text-[40px] text-success" />,
  err: <CloseCircleOutlined className="text-[40px] text-danger" />,
};
const colors: { [key: string]: ButtonProps["color"] } = { info: "primary", succ: "success", err: "danger" };
const defOptions: IMessageOptions = { visible: false, content: "", type: "info" };
const MessageContext = createContext<IMessage | null>(null);
// 消息提示
export const MessageProvider = ({ children }) => {
  const [options, setOptions] = useState<IMessageOptions>({ ...defOptions });

  // 成功提示
  const successMsg: MessageFun = useCallback((content: string) => {
    setOptions({ visible: true, type: "succ", content });
  }, []);
  // 错误提示
  const errorMsg: MessageFun = useCallback((content: string) => {
    setOptions({ visible: true, type: "err", content });
  }, []);
  // 信息提示
  const infoMsg: MessageFun = useCallback((content: string) => {
    setOptions({ visible: true, type: "info", content });
  }, []);

  return (
    <MessageContext.Provider value={{ successMsg, errorMsg, infoMsg }}>
      {children}
      <Modal size="xl" isOpen={options.visible} onClose={() => setOptions({ ...defOptions })}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Reminder</ModalHeader>
              <ModalBody className="flex flex-row items-center gap-4 px-[46px]">
                {IconList[options.type]}
                <div className="w-0 grow break-all max-h-[300px] overflow-auto">{options.content}</div>
              </ModalBody>
              <ModalFooter>
                <Button color={colors[options.type]} onPress={onClose}>
                  OK
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext) as IMessage;
