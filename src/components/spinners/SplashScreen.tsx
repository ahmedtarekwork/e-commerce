import { ReactNode } from "react";
import Spinner from "./Spinner";

interface props {
  children?: ReactNode;
  notMain?: boolean;
}

const SplashScreen = ({ children, notMain }: props) => {
  return (
    <div className={`splash-screen${notMain ? " not-main" : ""}`}>
      <Spinner settings={{ clr: "var(--main)" }}>
        {children || "Loading..."}
      </Spinner>
    </div>
  );
};

export default SplashScreen;
