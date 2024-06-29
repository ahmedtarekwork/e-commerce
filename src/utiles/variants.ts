export const slideOutVariant = {
  initial: { x: "-100vw" },
  animate: { x: 0 },
  exit: { x: "-100vw" },
  transition: {
    duration: 0.3,
    type: "tween",
    ease: "easeOut",
  },
};

export const cartOrWishlistAreasVariants = {
  initial: {
    ...slideOutVariant.initial,
    opacity: 0,
  },
  animate: {
    ...slideOutVariant.animate,
    opacity: 1,
  },
  exit: {
    ...slideOutVariant.exit,
    opacity: 0,
  },

  transition: {
    ...slideOutVariant.transition,
    opacity: {
      type: "tween",
      duration: 0.15,
    },
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
