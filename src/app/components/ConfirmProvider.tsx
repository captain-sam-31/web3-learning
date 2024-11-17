import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { createContext, useCallback, useContext, useState } from "react";

type ConfirmFunction = (opt: { content: string; onOk?: () => void }) => void;

const ConfirmContext = createContext<ConfirmFunction | null>(null);
interface OptionsType {
  visible: boolean;
  content: string;
  onOk?: () => void;
}
const defOptions = { visible: false, content: "" };
// 二次确认弹窗
export const ConfirmProvider = ({ children }) => {
  const [options, setOptions] = useState<OptionsType>({ ...defOptions });

  const confirm: ConfirmFunction = useCallback(({ content, onOk }) => {
    setOptions({ visible: true, content, onOk });
  }, []);

  const handleCancel = () => {
    setOptions((prev) => ({ ...prev, visible: false }));
  };

  const handleOk = () => {
    options.onOk?.();
    setOptions((prev) => ({ ...prev, visible: false }));
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal size="lg" isOpen={options.visible} onClose={handleCancel}>
        <ModalContent>
          <ModalHeader>Reminder</ModalHeader>
          <ModalBody className="flex flex-row items-center gap-4 px-[46px]">
            <ExclamationCircleOutlined className="text-[40px] text-primary" />
            <div className="w-0 grow break-all max-h-[300px] overflow-auto">{options.content}</div>
          </ModalBody>
          <ModalFooter>
            <Button onPress={handleCancel}>Cancel</Button>
            <Button color="primary" onPress={handleOk}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => useContext(ConfirmContext) as ConfirmFunction;
