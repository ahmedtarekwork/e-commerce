import axios from "axios";

const DisplayError = ({
  error,
  initMsg,
}: {
  error: Error;
  initMsg?: string;
}) => {
  let msg = initMsg || "something went wrong!";

  if (axios.isAxiosError(error))
    msg = error.response?.data.msg || error.response?.data;

  return <h1>{msg}</h1>;
};
export default DisplayError;
