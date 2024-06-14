import type {
  Dispatch,
  SetStateAction,
  ChangeEvent,
  ComponentProps,
  ReactNode,
} from "react";

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
      />
      <label
        {...attr}
        htmlFor={`add-first-img-to-home-slider${
          attr.htmlFor ? ` ${attr.htmlFor}` : ""
        }`}
        className={`btn${attr.className ? ` ${attr.className}` : ""}`}
      >
        {children}
      </label>
    </>
  );
};
export default AddImgsToHomeSliderBtn;
