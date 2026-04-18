import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";

const IsUserAdmin = ({ val }: { val: boolean }) => {
  const Icon = val ? FaCircleCheck : FaCircleXmark;

  return (
    <span
      style={{
        display: "grid",
        placeContent: "center",
      }}
    >
      <Icon
        data-testid={val ? "true-icon" : "false-icon"}
        style={{
          color: val ? "rgb(4 131 4)" : "red",
          background: "white",
          borderRadius: "100%",
        }}
        size={25}
      />
    </span>
  );
};
export default IsUserAdmin;
