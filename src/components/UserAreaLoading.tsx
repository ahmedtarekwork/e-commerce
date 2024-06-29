// react
import type { ReactNode } from "react";

// components
import EmptySpinner from "./spinners/EmptySpinner";
import Spinner from "./spinners/Spinner";

// layouts
import AnimatedLayout from "../layouts/AnimatedLayout";

type Props = {
  isCurrentUserProfile: boolean;
  children: ReactNode;
};

const UserAreaLoading = ({ isCurrentUserProfile, children }: Props) => {
  return (
    <AnimatedLayout>
      <Spinner
        fullWidth={isCurrentUserProfile}
        className={!isCurrentUserProfile ? "specific-user-list-loading" : ""}
      >
        {children}
      </Spinner>

      <div className="specific-user-list-small-loading">
        {children}

        <EmptySpinner
          settings={{
            "brdr-width": "3px",
            diminsions: "28px",
          }}
        />
      </div>
    </AnimatedLayout>
  );
};
export default UserAreaLoading;
