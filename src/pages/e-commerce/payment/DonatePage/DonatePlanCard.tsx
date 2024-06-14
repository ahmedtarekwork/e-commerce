// react
import { useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";

// components
import TopMessage, {
  type TopMessageRefType,
} from "../../../../components/TopMessage";

// hooks
import useGetPaymentSessionURL from "../../../../hooks/ReactQuery/useGetPaymentSessionURL";

// icons
import { FaCrown } from "react-icons/fa6";

// utils
import handleError from "../../../../utiles/functions/handleError";

// types
import type { UserType } from "../../../../utiles/types";

export type DonatePlanCardComponentProps = {
  name: Exclude<UserType["donationPlan"], undefined>;
  price: number | "Free";
  specialType?: "popular" | "expensive";
  user: UserType | null;
};

const DonatePlanCard = ({
  name,
  price,
  specialType,
  user,
}: DonatePlanCardComponentProps) => {
  const navigation = useNavigate();
  const description = `This is the ${name} plan, it's ${price} only, harry up before price gets change.`;

  const isCurrentPlan = user?.donationPlan
    ?.toLocaleLowerCase()
    .startsWith(name);

  let subscripeBtnContent = "Subscripe Now";
  if (user?.donationPlan)
    subscripeBtnContent = isCurrentPlan
      ? "Subscriped"
      : "Subscripe to this plan insted";

  // refs
  const msgRef = useRef<TopMessageRefType>(null);

  // hooks
  const { handlePayment, isPending, data, error } =
    useGetPaymentSessionURL(msgRef);

  // useEffects
  useEffect(() => {
    if (error) {
      handleError(error, msgRef, {
        forAllStates: "something went wrong while handle the payment",
      });
    }

    if (data) window.location.href = data.url;
  }, [data, error]);

  return (
    <>
      <li className={`donate-plan-card${specialType ? ` ${specialType}` : ""}`}>
        {specialType === "popular" && (
          <p className="porpular-mark">
            <FaCrown />
            most popular
          </p>
        )}

        <h3 className="donate-plan-card-name">{name}</h3>
        <p className="donate-plan-card-price">
          {price}
          {price !== "Free" ? <span>$ / month</span> : ""}
        </p>
        <p className="donate-plan-card-description">{description}</p>

        <button
          title="subscripe to this donate plan"
          disabled={isCurrentPlan || isPending}
          onClick={() => {
            if (user) {
              handlePayment({
                sessionType: !user.donationPlan
                  ? "donation"
                  : "changeDonatePlan",
                donationPlan: {
                  description,
                  name,
                  price,
                },
                recurring: {
                  interval: "month",
                  interval_count: 1,
                },
              });
            } else navigation("/login", { relative: "path" });
          }}
          className={`donate-plan-card-btn btn${
            isPending ? " center spinner-pseudo-after fade scale active" : ""
          }`}
        >
          {subscripeBtnContent}
        </button>
      </li>

      <TopMessage ref={msgRef} />
    </>
  );
};
export default DonatePlanCard;
