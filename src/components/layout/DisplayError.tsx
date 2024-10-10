// components
import EmptyPage from "./EmptyPage";

// utils
import { isAxiosError } from "axios";

// SVGs
import ErrorSvg from "../../../imgs/error.svg";

type Props = {
  error: Error | null;
  initMsg?: string;
};

const DisplayError = ({ error, initMsg }: Props) => {
  let msg = initMsg || "something went wrong!";

  if (isAxiosError(error) && error.response?.data.message) {
    msg = error.response.data.message;
  }

  return (
    <EmptyPage content={msg} svg={ErrorSvg} withBtn={{ type: "GoToHome" }} />
  );
};
export default DisplayError;
