import type {
  Dispatch,
  SetStateAction,
  ChangeEvent,
  ComponentProps,
  ReactNode,
} from "react";

// icons
import { BiSolidImageAdd } from "react-icons/bi";

type Props = {
  setImgsToUpload: Dispatch<SetStateAction<File[]>>;
  children: ReactNode;
} & ComponentProps<"label">;

const AddImgsToHomeSliderBtn = ({
  setImgsToUpload,
  children,
  ...attr
}: Props) => {
  const handleHomePageImgsSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget?.files || []);
    setImgsToUpload((prev) => [...prev, ...files]);
  };

  return (
    <>
      <input
        onChange={handleHomePageImgsSliderChange}
        id="add-first-img-to-home-slider"
        type="file"
        multiple={true}
        style={{ display: "none" }}
        accept="image/*"
      />
      <label
        {...attr}
        style={{
          ...attr.style,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
        }}
        htmlFor={`add-first-img-to-home-slider${
          attr.htmlFor ? ` ${attr.htmlFor}` : ""
        }`}
        className={`btn${attr.className ? ` ${attr.className}` : ""}`}
      >
        <BiSolidImageAdd
          style={{
            fontSize: 22,
          }}
        />
        {children}
      </label>
    </>
  );
};
export default AddImgsToHomeSliderBtn;
