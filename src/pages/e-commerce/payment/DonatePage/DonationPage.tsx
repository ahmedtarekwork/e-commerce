// react
import { useEffect, useRef } from "react";

// react query
import { useMutation } from "@tanstack/react-query";

// reudx
import useSelector from "../../../../hooks/redux/useSelector";
import useDispatch from "../../../../hooks/redux/useDispatch";
// redux actions
import { setUser } from "../../../../store/fetures/userSlice";

// components
import Heading from "../../../../components/Heading";
import Warning from "../../../../components/Warning";
import DangerZone from "../../../../components/dangerZone/DangerZone";

import DonatePlanCard, {
  type DonatePlanCardComponentProps,
} from "./DonatePlanCard";
import TopMessage, {
  type TopMessageRefType,
} from "../../../../components/TopMessage";

// utils
import axios from "../../../../utiles/axios";
import handleError from "../../../../utiles/functions/handleError";

// types
import { type AppModalRefType } from "../../../../components/modals/appModal/AppModal";

// fetchers
const DeleteDonationMutationFn = async () => {
  return (await axios.delete("payment/donate")).data;
};

const donatePlanArr: Omit<DonatePlanCardComponentProps, "user">[] = [
  {
    name: "standard",
    price: 10,
  },

  {
    name: "pro",
    price: 25,
    specialType: "popular",
  },
  {
    name: "premium pro",
    price: 50,
    specialType: "expensive",
  },
];

const DonationPage = () => {
  const dispatch = useDispatch();

  // states
  const { user } = useSelector((state) => state.user);

  // refs
  const sureModalRef = useRef<AppModalRefType>(null);
  const msgRef = useRef<TopMessageRefType>(null);

  const {
    data,
    error,
    mutate: deleteDonation,
  } = useMutation({
    mutationKey: ["donationUnsubscripe"],
    mutationFn: DeleteDonationMutationFn,
  });

  useEffect(() => {
    if (data || error) sureModalRef.current?.toggleModal(false);

    if (data) {
      dispatch(setUser(data));
      msgRef.current?.setMessageData({
        clr: "green",
        content: "Subscription has been canceled",
        show: true,
        time: 5000,
      });
    }

    if (error) {
      handleError(error, msgRef, {
        forAllStates: "something went wrong while remove your subscription",
      });
    }
  }, [error, data, dispatch]);

  return (
    <>
      <Heading>Donate Us</Heading>

      <Warning>
        This page for practise on Stripe Recurring Payments only, It's not a
        real donation.
      </Warning>

      <ul className="donate-cards-list">
        {donatePlanArr.map((plan) => (
          <DonatePlanCard key={plan.name} {...plan} user={user} />
        ))}
      </ul>

      {user?.donationPlan && (
        <DangerZone
          content="you can unsubscripe from your Current plan by clicking on the
            unsubscripe button."
          title="Unsubscripe"
          deleteBtn={{
            type: "inline",
            content: "Unsubscripe",
            modalMsg: (
              <>
                Are you sure you want to unsubscripe from{" "}
                <strong style={{ color: "var(--danger)" }}>
                  {user?.donationPlan}
                </strong>{" "}
                plan ?
              </>
            ),
            onAcceptFn: () => deleteDonation(),
          }}
        />
      )}
      <TopMessage ref={msgRef} />
    </>
  );
};
export default DonationPage;
