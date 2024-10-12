// react
import { ReactNode, useEffect } from "react";

// react router dom
import { useNavigate } from "react-router-dom";

// components
import BtnWithSpinner from "../../../../components/animatedBtns/BtnWithSpinner";
import IconAndSpinnerSwitcher from "../../../../components/animatedBtns/IconAndSpinnerSwitcher";

// hooks
import useGetPaymentSessionURL from "../../../../hooks/ReactQuery/useGetPaymentSessionURL";
import useHandleErrorMsg from "../../../../hooks/useHandleErrorMsg";

// icons
import { FaCrown } from "react-icons/fa6";
import { BiTransferAlt } from "react-icons/bi";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";

// types
import type { UserType } from "../../../../utils/types";

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
  const handleError = useHandleErrorMsg();

  // hooks
  const { handlePayment, isPending, data, error } = useGetPaymentSessionURL();

  const description = `This is the ${name} plan, it's ${price} only, harry up before price gets change.`;

  const isCurrentPlan = user?.donationPlan
    ?.toLocaleLowerCase()
    .startsWith(name);

  let subscripeBtnContent: ReactNode = "Subscribe Now";
  if (user?.donationPlan) {
    subscripeBtnContent = isCurrentPlan ? (
      <>
        <IoCheckmarkDoneCircleSharp />
        Subscribed
      </>
    ) : (
      <>
        <IconAndSpinnerSwitcher
          spinnerDiminsions="20px"
          toggleIcon={isPending}
          icon={<BiTransferAlt />}
        />
        Switch to this plan
      </>
    );
  }

  // useEffects
  useEffect(() => {
    if (error) {
      handleError(error, {
        forAllStates: "something went wrong while handle the payment",
      });
    }

    if (data) window.location.href = data.url;
  }, [data, error]);

  const TagName = user?.donationPlan ? "button" : BtnWithSpinner;

  return (
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

      <TagName
        toggleSpinner={!user?.donationPlan && isPending}
        title="subscripe to this donate plan"
        disabled={isCurrentPlan || isPending}
        onClick={() => {
          if (user) {
            handlePayment({
              sessionType: !user.donationPlan ? "donation" : "changeDonatePlan",
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
        className="donate-plan-card-btn btn"
      >
        {subscripeBtnContent}
      </TagName>
    </li>
  );
};
export default DonatePlanCard;
