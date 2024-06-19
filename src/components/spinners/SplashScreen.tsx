// react
import type { ReactNode } from "react";

// components
import Spinner from "./Spinner";

type Props = {
  children?: ReactNode;
  notMain?: boolean;
};

const SplashScreen = ({ children, notMain }: Props) => {
  return (
    <div className={`splash-screen${notMain ? " not-main" : ""}`}>
      <Spinner settings={{ clr: "var(--main)" }}>
        {children || "Loading..."}
      </Spinner>
    </div>
  );
};

export default SplashScreen;
