// react
import { useEffect, useRef, useState } from "react";

// redux
import useDispatch from "../../hooks/redux/useDispatch";
import { setUser } from "../../store/fetures/userSlice";

// react-query
import { useMutation } from "@tanstack/react-query";

// component
import FormInput from "../../components/appForm/Input/FormInput";
import TopMessage, { TopMessageRefType } from "../../components/TopMessage";

// utiles
import { axiosWithToken } from "../../utiles/axios";
import handleError from "../../utiles/functions/handleError";

// types
import { UserType } from "../../utiles/types";

type Props = {
  propName: keyof UserType;
  content: string;
  user: UserType;
};

type reqParamType = { userId: string; userData: UserType };

// fetchers
const updateUserMutationFn = async (userId: string, userData: UserType) => {
  return (await axiosWithToken.put("/users/" + userId, userData)).data;
};

const ProfilePageCell = ({ propName, content, user }: Props) => {
  const saveBtnRef = useRef<HTMLButtonElement>(null);
  const msgRef = useRef<TopMessageRefType>(null);

  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState(content);
  const [editMode, setEditMode] = useState(false);

  const {
    mutate: updateUser,
    isPending: isLoading,
    data: updatedUserData,
    error: updateUserErrData,
    isError: updateUserErr,
  } = useMutation({
    mutationKey: ["updateUser", user?._id],
    mutationFn: ({ userId, userData }: reqParamType) =>
      updateUserMutationFn(userId, userData),
  });

  useEffect(() => {
    if (updatedUserData) {
      dispatch(setUser(updatedUserData));
      setEditMode(false);
      msgRef.current?.setMessageData?.({
        clr: "green",
        content: `${propName} updated successfully`,
        show: true,
        time: 3500,
      });
    }

    if (updateUserErr) {
      handleError(
        updateUserErrData,
        msgRef,
        {
          forAllStates: "somethign went wrong while updating user Data",
          duplicatedMsg: propName + " is already taken",
        },

        5000
      );
    }
  }, [updatedUserData, updateUserErr, updateUserErrData, dispatch, propName]);

  useEffect(() => {
    saveBtnRef.current?.classList.toggle("active", isLoading);
  }, [isLoading]);

  return (
    <>
      <div className="profile-page-cell">
        <div className="profile-page-cell-content-holder">
          <strong className="cell-prop-name">{propName}:</strong>
          <div className="profile-cell-content">
            {editMode ? (
              <FormInput
                className="profile-cell-input"
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
              />
            ) : (
              `${propName === "email" ? "@" : ""}${content}`
            )}
          </div>
        </div>

        <div className="profile-cell-btns-holder">
          <button
            title="edit specific profile property btn"
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
            <button
              title="save profile property new changes btn"
              ref={saveBtnRef}
              className={`${
                isLoading ? "center fade scale spinner-pseudo-after " : ""
              }btn`}
              disabled={
                !inputValue.length || inputValue === content || isLoading
              }
              onClick={() =>
                updateUser({
                  userId: user._id,
                  userData: { ...user, [propName]: inputValue },
                })
              }
            >
              save changes
            </button>
          )}
        </div>
      </div>
      <TopMessage ref={msgRef} />
    </>
  );
};
export default ProfilePageCell;
