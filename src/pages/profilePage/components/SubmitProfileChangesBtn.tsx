// react
import { type Dispatch, type SetStateAction, useEffect } from "react";

// react query
import { useMutation } from "@tanstack/react-query";

// components
import BtnWithSpinner from "../../../components/animatedBtns/BtnWithSpinner";

// redux
import useDispatch from "../../../hooks/redux/useDispatch";
// redux actions
import { setUser } from "../../../store/fetures/userSlice";

// hooks
import useShowMsg from "../../../hooks/useShowMsg";
import useHandleErrorMsg from "../../../hooks/useHandleErrorMsg";

// utils
import axios from "../../../utils/axios";

// types
import type { ProfilePageCellProps } from "./ProfilePageCell";
import type { UserType } from "../../../utils/types";

type reqParamType = {
  userId: string;
  userData: Partial<Pick<UserType, "address" | "email" | "username">>;
};

type Props = {
  user: UserType;
  inputValue: string;
} & Pick<ProfilePageCellProps, "propName" | "content"> &
  Record<"setIsLoading" | "setEditMode", Dispatch<SetStateAction<boolean>>>;

const updateUserMutationFn = async (
  userId: reqParamType["userId"],
  userData: reqParamType["userData"],
) => {
  if (!Object.keys(userData).length) {
    throw new axios.AxiosError(
      "__APP_ERROR__ you need to send some data to update it",
      "400",
    );
  }

  return (await axios.patch(`/users/${userId}`, userData)).data;
};

const SubmitProfileChangesBtn = ({
  user,
  setIsLoading,
  setEditMode,
  content,
  propName,
  inputValue,
}: Props) => {
  const handleError = useHandleErrorMsg();

  const dispatch = useDispatch();
  const showMsg = useShowMsg();

  const { mutate: updateUser, isPending: isLoading } = useMutation({
    mutationKey: ["updateUser", user._id],
    mutationFn: ({ userId, userData }: reqParamType) =>
      updateUserMutationFn(userId, userData),

    onSuccess(data) {
      dispatch(setUser({ ...user, ...data }));

      setEditMode(false);

      showMsg?.({
        clr: "green",
        content: `${propName} updated successfully`,
      });
    },

    onError(error) {
      handleError(
        error,
        {
          forAllStates: "somethign went wrong while updating user Data",
          duplicatedMsg: propName + " is already taken",
        },

        5000,
      );
    },
  });

  useEffect(() => {
    setIsLoading(isLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  return (
    <BtnWithSpinner
      title="save changes"
      toggleSpinner={isLoading}
      className="btn save-profile-cell-btn"
      disabled={!inputValue.length || inputValue === content || isLoading}
      onClick={() =>
        updateUser({
          userId: user._id,
          userData: { [propName]: inputValue },
        })
      }
    >
      save changes
    </BtnWithSpinner>
  );
};
export default SubmitProfileChangesBtn;
