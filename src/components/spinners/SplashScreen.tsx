// react
import type { ReactNode } from "react";

// components
import Spinner from "./Spinner";
// layouts
import AnimatedLayout from "../../layouts/AnimatedLayout";

type Props = {
  children?: ReactNode;
  notMain?: boolean;
};

const SplashScreen = ({ children, notMain }: Props) => {
  return (
    <AnimatedLayout className={`splash-screen${notMain ? " not-main" : ""}`}>
      <Spinner
        style={{
          marginInline: "auto",
        }}
      >
        {children || "Loading..."}
      </Spinner>
    </AnimatedLayout>
  );
};

export default SplashScreen;
