// components
import ProfilePageCell from "./ProfilePageCell";
import PropCell from "../../../components/PropCell";
import CurrentUserDonationPlan from "./CurrentUserDonationPlan";

// types
import type { UserType } from "../../../utils/types";

type Props = {
  user: UserType;
  isCurrentUserProfile: boolean;
};

const ProfilePageUserInfo = ({ user, isCurrentUserProfile }: Props) => {
  const { username, email } = user;

  return (
    <>
      <ProfilePageCell
        user={user}
        propName="username"
        content={username}
        isCurrentUserProfile={isCurrentUserProfile}
      />
      <ProfilePageCell
        user={user}
        propName="email"
        content={email}
        isCurrentUserProfile={isCurrentUserProfile}
      />

      <ProfilePageCell
        user={user}
        propName="address"
        content={user?.address || "NO_ADDRESS_FOUND!"}
        isCurrentUserProfile={isCurrentUserProfile}
      />
      <PropCell
        name="donationPlan"
        val={
          <CurrentUserDonationPlan
            user={user}
            isCurrentUserProfile={isCurrentUserProfile}
          />
        }
      />
    </>
  );
};
export default ProfilePageUserInfo;
