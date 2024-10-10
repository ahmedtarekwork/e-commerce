import type { IconType } from "react-icons";

type Props = {
  Icon: IconType;
  content: string;
};

const ProfilePageTabsError = ({ content, Icon }: Props) => {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
      }}
    >
      <Icon color="var(--dark)" size={40} />

      <strong style={{ color: "var(--dark)", fontSize: 20 }}>{content}</strong>
    </div>
  );
};
export default ProfilePageTabsError;
