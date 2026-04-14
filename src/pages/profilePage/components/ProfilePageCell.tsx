// react
import { useEffect, useState } from "react";

// component
import FormInput from "../../../components/appForm/Input/FormInput";
import SubmitProfileChangesBtn from "./SubmitProfileChangesBtn";

// types
import type { UserType } from "../../../utils/types";

export type ProfilePageCellProps = {
  propName: keyof UserType;
  content: string;
  user: UserType;
  isCurrentUserProfile: boolean;
};

const ProfilePageCell = ({
  propName,
  content,
  user,
  isCurrentUserProfile,
}: ProfilePageCellProps) => {
  const initValue =
    content === "NO_ADDRESS_FOUND!" && propName === "address" ? "" : content;

  // states
  const [inputValue, setInputValue] = useState(initValue);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!editMode && isLoading) setIsLoading(false);
  }, [editMode, isLoading]);

  return (
    <div className="profile-page-cell">
      <div className="profile-page-cell-content-holder">
        <strong className="prop-cell-name">{propName}:</strong>
        <div className="profile-cell-content">
          {editMode ? (
            <FormInput
              autoFocus
              className="profile-cell-input"
              onChange={(e) => setInputValue(e.target.value)}
              value={inputValue}
              name={`edit-${propName}-input`}
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
              if (editMode) setInputValue(initValue);
              setEditMode(!editMode);
            }}
          >
            {editMode ? "cancel" : "edit"}
          </button>

          {editMode && (
            <SubmitProfileChangesBtn
              inputValue={inputValue}
              content={content}
              propName={propName}
              user={user}
              setIsLoading={setIsLoading}
              setEditMode={setEditMode}
            />
          )}
        </div>
      )}
    </div>
  );
};
export default ProfilePageCell;
