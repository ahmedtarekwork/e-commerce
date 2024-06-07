import { type IconType } from "react-icons";
import { type PaymentSuccessOrFailPageProps } from "./PaymentSuccessOrFailedPage";

type Props = {
  Icon: IconType;
  paymentType: PaymentSuccessOrFailPageProps["type"];
};

const SuccessOrFailIcon = ({ Icon, paymentType }: Props) => {
  return (
    <Icon
      className="success-or-fail-icon"
      style={{
        color: paymentType === "success" ? "#0aad0a" : "#ad0a0a",
      }}
    />
  );
};
export default SuccessOrFailIcon;
