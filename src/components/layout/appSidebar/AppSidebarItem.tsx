// react router dom
import { NavLink } from "react-router-dom";

// icons
import { BsFillCaretRightFill } from "react-icons/bs";

// types
import { type IconType } from "react-icons";

import { type AnimationControls, motion } from "framer-motion";

export type SidebarItemProps = {
  content: string;
  Icon: IconType;
  path: string;
  index: number;
  controller: AnimationControls;
};

const AppSidebarItem = ({
  content,
  path,
  Icon,
  index,
  controller,
}: SidebarItemProps) => {
  return (
    <motion.li
      initial={{
        x: "-100%",
      }}
      exit={{
        x: "-100%",
      }}
      animate={controller}
      transition={{
        type: "tween",
        delay: 0.05 * index,
      }}
    >
      <NavLink
        to={path}
        className="close-side"
        end={path !== "/"} // if the end of the page route === path of this NavLink component => put the active class on it
        relative="path"
      >
        <BsFillCaretRightFill className="sidebar-item-arrow" />

        <p>
          <Icon />
          {content}
        </p>
      </NavLink>
    </motion.li>
  );
};

export default AppSidebarItem;
