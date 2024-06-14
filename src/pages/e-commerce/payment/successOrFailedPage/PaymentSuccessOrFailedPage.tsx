// react router dom
import { Link, useLocation } from "react-router-dom";

// components
import SuccessOrFailIcon from "./SuccessOrFailIcon";

// icons
import { FaCircleCheck, FaCircleXmark, FaStore } from "react-icons/fa6";
import { FaShoppingCart, FaMap } from "react-icons/fa";

export type PaymentSuccessOrFailPageProps = {
  type: "failed" | "success";
};

const PaymentSuccessOrFailedPage = ({
  type,
}: PaymentSuccessOrFailPageProps) => {
  const { pathname } = useLocation();
  const isDonatePath = pathname.includes("donate");

  return (
    <div
      style={{
        display: "grid",
        placeContent: "center",
      }}
    >
      <SuccessOrFailIcon
        Icon={type === "success" ? FaCircleCheck : FaCircleXmark}
        paymentType={type}
      />

      <h1 className="payment-page-title">
        Payment {type === "success" ? "Successful" : "canceled"}
      </h1>

      {isDonatePath && type === "success" ? (
        <p className="donation-thanks-msg">
          Thank you for subscriping to one of our donation plans, we wish to
          give you some value For what you paid to us.
        </p>
      ) : null}

      <Link
        title="success or failed payment operation action btn"
        to={`/${type === "success" ? "" : isDonatePath ? "donate" : "cart"}`}
        relative="path"
        className="btn success-of-fail-payment-page-btn"
      >
        {type === "success" ? (
          <>
            <FaStore />
            Continue Shopping
          </>
        ) : (
          <>
            {isDonatePath ? <FaMap /> : <FaShoppingCart />}
            Back to {isDonatePath ? "plans" : "cart"}
          </>
        )}
      </Link>
    </div>
  );
};
export default PaymentSuccessOrFailedPage;
