"use client";
import { useMyRedux } from "@/redux";
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { memo } from "react";

const IconList = {
  info: <ExclamationCircleOutlined className="text-[40px] text-primary" />,
  succ: <CheckCircleOutlined className="text-[40px] text-success" />,
  err: <CloseCircleOutlined className="text-[40px] text-danger" />,
};
const colors: any = { info: "primary", succ: "success", err: "danger" };
// 消息提示
const Message = memo(() => {
  const { msg, setMsg } = useMyRedux((state) => state);

  return (
    <Modal size="lg" isOpen={!!msg.content} onClose={() => setMsg({ content: "" })}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Reminder</ModalHeader>
            <ModalBody className="flex flex-row items-center gap-4 px-[46px]">
              {IconList[msg.type ?? "info"]}
              <div className="w-0 grow break-all max-h-[300px] overflow-auto">{msg.content}</div>
            </ModalBody>
            <ModalFooter>
              <Button color={colors[msg.type ?? "info"]} onPress={onClose}>
                OK
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
});
Message.displayName = "Message";
export default Message;
