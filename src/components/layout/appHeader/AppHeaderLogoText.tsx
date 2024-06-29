import { AnimatePresence, motion } from "framer-motion";

const AppHeaderLogoText = ({ isDashbaord }: { isDashbaord: boolean }) => {
  return (
    <p className="logo-text-holder">
      {!isDashbaord ? (
        <AnimatePresence>
          <motion.span
            key="E"
            initial={{
              opacity: 0.1,
              x: -11,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.2,
              type: "spring",
              stiffness: 80,
              damping: 5,
            }}
          >
            E
          </motion.span>

          <motion.span
            key="-"
            transition={{
              duration: 0.2,
              delay: 0.15,
              stiffness: 80,
              type: "spring",
              damping: 5,
            }}
            initial={{
              x: -11,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
          >
            -
          </motion.span>

          <motion.span
            key="commerce Store"
            initial={{
              x: -4,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            transition={{
              delay: 0.45,
              duration: 0.25,
              type: "spring",
              damping: 5,
              stiffness: 180,
            }}
          >
            commerce Store
          </motion.span>
        </AnimatePresence>
      ) : (
        <>
          <motion.span
            initial={{
              x: -20,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            transition={{
              duration: 0.26,
              type: "spring",
              stiffness: 120,
            }}
          >
            Sales
          </motion.span>{" "}
          <motion.span
            initial={{
              x: -20,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            transition={{
              delay: 0.25,
              duration: 0.26,
              type: "spring",
              stiffness: 120,
            }}
          >
            Managment
          </motion.span>
        </>
      )}
    </p>
  );
};
export default AppHeaderLogoText;
