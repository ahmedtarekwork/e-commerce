// react router dom
import { NavLink } from "react-router-dom";

// icons
import { BsFillCaretRightFill } from "react-icons/bs";

// types
import { type IconType } from "react-icons";

export type SidebarItemProps = {
  content: string;
  Icon: IconType;
  path: string;
};

const SidebarItem = ({ content, path, Icon }: SidebarItemProps) => {
  return (
    <li>
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
    </li>
  );
};

export default SidebarItem;
