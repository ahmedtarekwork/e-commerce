// react
import { useState } from "react";

// redux
import useDispatch from "../../hooks/redux/useDispatch";
import useSelector from "../../hooks/redux/useSelector";
// redux actions
import { setUser } from "../../store/fetures/userSlice";

// react-query
import { useMutation } from "@tanstack/react-query";

// component
import BtnWithSpinner from "../../components/animatedBtns/BtnWithSpinner";
import FormInput from "../../components/appForm/Input/FormInput";

// utils
import axios from "../../utils/axios";

// types
import type { UserType } from "../../utils/types";

// hooks
import useHandleErrorMsg from "../../hooks/useHandleErrorMsg";

type Props = {
  propName: keyof UserType;
  content: string;
  user: UserType;
  isCurrentUserProfile: boolean;
};

type reqParamType = {
  userId: string;
  userData: Partial<Pick<UserType, "address" | "email" | "username">>;
};

// fetchers
const updateUserMutationFn = async (
  userId: reqParamType["userId"],
  userData: reqParamType["userData"]
) => {
  if (!Object.keys(userData).length) {
    throw new axios.AxiosError(
      "you need to send some data to update it",
      "400"
    );
  }

  return (await axios.patch(`/users/${userId}`, userData)).data;
};

const ProfilePageCell = ({
  propName,
  content,
  user,
  isCurrentUserProfile,
}: Props) => {
  const handleError = useHandleErrorMsg();

  const dispatch = useDispatch();
  const showMsg = useSelector((state) => state.topMessage.showMsg);

  // states
  const [inputValue, setInputValue] = useState(content);
  const [editMode, setEditMode] = useState(false);

  const { mutate: updateUser, isPending: isLoading } = useMutation({
    mutationKey: ["updateUser", user._id],
    mutationFn: ({ userId, userData }: reqParamType) =>
      updateUserMutationFn(userId, userData),

    onSuccess(data) {
      dispatch(setUser(data));

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

        5000
      );
    },
  });

  return (
    <div className="profile-page-cell">
      <div className="profile-page-cell-content-holder">
        <strong className="prop-cell-name">{propName}:</strong>
        <div className="profile-cell-content">
          {editMode ? (
            <FormInput
              className="profile-cell-input"
              onChange={(e) => setInputValue(e.target.value)}
              value={inputValue}
            />
          ) : (
            `${propName === "username" ? "#" : ""}${content}`
          )}
        </div>
      </div>

      {isCurrentUserProfile && (
        <div className="profile-cell-btns-holder">
          <button
            title={`edit your ${propName}`}
            className={`${editMode ? "red-" : ""}btn`}
            disabled={isLoading}
            onClick={() => {
              if (editMode) setInputValue(content);
              setEditMode(!editMode);
            }}
          >
            {editMode ? "cancel" : "edit"}
          </button>

          {editMode && (
            <BtnWithSpinner
              title="save changes"
              toggleSpinner={isLoading}
              className="btn save-profile-cell-btn"
              disabled={
                !inputValue.length || inputValue === content || isLoading
              }
              onClick={() =>
                updateUser({
                  userId: user._id,
                  userData: { [propName]: inputValue },
                })
              }
            >
              save changes
            </BtnWithSpinner>
          )}
        </div>
      )}
    </div>
  );
};
export default ProfilePageCell;
