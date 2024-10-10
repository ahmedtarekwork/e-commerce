export const slideOutVariant = {
  initial: { x: "-40px", opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "-40px", opacity: 0 },

  transition: {
    duration: 0.3,
    type: "tween",
    ease: "easeOut",
  },
};

export const scaleUpDownVariant = {
  initial: { scale: 0 },
  animate: {
    scale: 1,
  },
  exit: {
    scale: 0,
  },
  transition: {
    duration: 0.1,
    type: "tween",
  },
};
