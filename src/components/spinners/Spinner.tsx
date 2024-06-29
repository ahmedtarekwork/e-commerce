import {
  Fragment,
  forwardRef,
  useEffect,
  useRef,

  // types
  type RefObject,
  type ComponentProps,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";

type Content =
  | {
      content?: ReactNode;
      children?: never;
    }
  | {
      children?: ReactNode;
      content?: never;
    };

type Settings =
  | {
      clr?: never;
      "brdr-width": number;
    }
  | {
      clr: string;
      "brdr-width"?: never;
    };

type Props = Content & {
  settings?: Settings;
  mainSpinner?: boolean;
  fullWidth?: boolean;
  holderAttributes?: ComponentProps<"div">;
} & ComponentProps<"div">;

const circleSpinVariantes = {
  animate: {
    rotate: 360,

    transition: {
      duration: 1.6,
      ease: "easeInOut",
      repeat: Infinity,
      type: "spring",
      stiffness: 40,
    },
  },
};

const Spinner = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { settings, content, children, fullWidth, holderAttributes, ...attr } =
    props;

  const emergencyRef = useRef<HTMLDivElement>(null);
  const spinnerEl = ref || emergencyRef;

  useEffect(() => {
    const spinner = (spinnerEl as RefObject<HTMLDivElement>).current;

    if (spinner) {
      // gap between content and cirlcle stroke
      const gap = 30;
      spinner.style.padding = `${gap}px`;

      if (settings && Object.keys(settings).length) {
        spinner.style.cssText += Object.entries(settings)
          .map(([prop, val]) => `--${prop}: ${val}`)
          .join("; ");
      }

      return () => {
        spinner.parentElement?.style.removeProperty("position");
      };
    }
  }, [settings, spinnerEl]);

  const Holder = fullWidth ? "div" : Fragment;

  const finalHolderAttr: ComponentProps<"div"> = fullWidth
    ? {
        ...holderAttributes,
        className: `spinner-full-width-holder${
          holderAttributes?.className ? ` ${holderAttributes.className}` : ""
        }`,
      }
    : {};

  return (
    <Holder {...finalHolderAttr}>
      <div
        {...attr}
        ref={spinnerEl}
        className={`spinner-holder${
          attr.className ? ` ${attr.className}` : ""
        }`}
      >
        <motion.span
          className="spinner"
          variants={circleSpinVariantes}
          animate="animate"
        />
        <motion.span
          className="spinner-transparent-circle"
          initial={{
            scale: 0,
          }}
          animate={{
            scale: 1,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.6,
            ease: "easeInOut",
            repeatType: "loop",
            repeat: Infinity,
          }}
        />
        {<p>{children || content}</p>}
      </div>
    </Holder>
  );
});
export default Spinner;
