import { AnimatePresence, motion } from "framer-motion";

const ErrorDiv = ({ msg }: { msg: string | undefined }) => {
  return (
    <AnimatePresence mode="popLayout">
      {msg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            type: "tween",
            duration: 0.15,
          }}
          layout
          style={{ color: "var(--danger)" }}
        >
          {msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default ErrorDiv;
