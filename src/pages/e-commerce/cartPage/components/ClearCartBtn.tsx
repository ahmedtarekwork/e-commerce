// react
import { useEffect, type Dispatch, type SetStateAction } from "react";

// utils
import axios from "../../../../utils/axios";

// react query
import { useMutation } from "@tanstack/react-query";

// hooks
import useHandleErrorMsg from "../../../../hooks/useHandleErrorMsg";
import useShowMsg from "../../../../hooks/useShowMsg";

// redux
import useDispatch from "../../../../hooks/redux/useDispatch";
// redux actions
import { setCart } from "../../../../store/fetures/userSlice";

// components
import IconAndSpinnerSwitcher from "../../../../components/animatedBtns/IconAndSpinnerSwitcher";

// icons
import { MdOutlineRemoveShoppingCart } from "react-icons/md";

// types
import type { UserType } from "../../../../utils/types";

type Props = {
  user: UserType | null;
  setClearCartLoading: Dispatch<SetStateAction<boolean>>;
  submitOrderLoading: boolean;
};
const clearCartMutationFn = async (userId: string) => {
  if (!userId)
    throw new axios.AxiosError(
      "__APP_ERROR__ you need to login before modify your cart",
      "403"
    );

  return (await axios.delete(`carts/${userId}/resetCart`)).data;
};

const ClearCartBtn = ({
  user,
  setClearCartLoading,
  submitOrderLoading,
}: Props) => {
  const showMsg = useShowMsg();
  const handleError = useHandleErrorMsg();
  const dispatch = useDispatch();

  const { mutate: clearCart, isPending: clearCartLoading } = useMutation({
    mutationKey: ["clearCart"],
    mutationFn: () => clearCartMutationFn(user?._id || ""),

    onSuccess: (data) => {
      showMsg?.({
        content:
          "message" in data
            ? (data.message as string)
            : "your cart reseted successfully",
        clr: "green",
      });

      if (user) dispatch(setCart({ orderdby: user?._id, products: [] }));
    },

    onError(error) {
      handleError(error, {
        forAllStates: "something went wrong while clearing your cart",
      });
    },
  });

  useEffect(() => {
    setClearCartLoading(clearCartLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearCartLoading]);

  return (
    <button
      title="clear your cart"
      className="red-btn"
      onClick={() => clearCart()}
      disabled={clearCartLoading || submitOrderLoading}
    >
      <IconAndSpinnerSwitcher
        toggleIcon={clearCartLoading}
        icon={<MdOutlineRemoveShoppingCart />}
      />
      Clear Your Cart
    </button>
  );
};
export default ClearCartBtn;
