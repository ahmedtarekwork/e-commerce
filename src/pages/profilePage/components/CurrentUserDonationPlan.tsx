// react router dom
import { Link } from "react-router-dom";

// types
import type { UserType } from "../../../utils/types";

// icons
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { FaDonate } from "react-icons/fa";

type Props = {
  user: UserType;
  isCurrentUserProfile: boolean;
};

const CurrentUserDonationPlan = ({ user, isCurrentUserProfile }: Props) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 30,
        justifyContent: "space-between",
      }}
    >
      <p className="profile-page-donation-cell">
        {user?.donationPlan ? (
          <>
            {isCurrentUserProfile ? "you are" : "this user"} subscriped to
            <strong className="plan-name">{user.donationPlan}</strong>
          </>
        ) : (
          `${
            isCurrentUserProfile ? "you aren't" : "this user doesn't"
          } subscriped to any donation plan`
        )}
      </p>

      {isCurrentUserProfile && (
        <Link
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
          title="go to donate page btn"
          className="btn"
          to="/donate"
          relative="path"
        >
          {user.donationPlan ? (
            <>
              <FaMoneyBillTransfer />
              change plan
            </>
          ) : (
            <>
              <FaDonate />
              Go to Donate
            </>
          )}
        </Link>
      )}
    </div>
  );
};
export default CurrentUserDonationPlan;
