import { type MouseEvent, type ReactNode } from "react";
import DangerZoneBtn from "./DangerZoneBtn";

export type InlineDeleteBtnType = {
  content: string;
  modalMsg: ReactNode;
  onAcceptFn: (e: MouseEvent<HTMLButtonElement>) => void;
};

type DeleteBtnType =
  | ({
      type: "custom";
      deleteBtn: JSX.Element;
    } & Partial<Record<keyof InlineDeleteBtnType, never>>)
  | ({
      type: "inline";
      deleteBtn?: never;
    } & InlineDeleteBtnType);

type Props = {
  title: string;
  content: string;
  deleteBtn: DeleteBtnType;
};

const DangerZone = ({ title, content, deleteBtn }: Props) => {
  return (
    <div className="danger-zone donation-page-danger-zone">
      <h3 className="danger-zone-title">{title}</h3>
      <p className="danger-zone-content">{content}</p>

      {deleteBtn.type === "inline" ? (
        <DangerZoneBtn {...deleteBtn} />
      ) : (
        deleteBtn.deleteBtn
      )}
    </div>
  );
};
export default DangerZone;
