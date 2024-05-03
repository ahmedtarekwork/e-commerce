import { NavLink } from "react-router-dom";

// icons
import { BsFillCaretRightFill } from "react-icons/bs";

export type SidebarItemProps = {
  exact?: boolean;
  content: string;
  path: string;
};

const SidebarItem = ({ content, path, exact }: SidebarItemProps) => {
  return (
    <li>
      <NavLink
        to={path}
        className="close-side"
        {...(exact ? { end: true } : {})}
      >
        <BsFillCaretRightFill />
        <p>{content}</p>
      </NavLink>
    </li>
  );
};

export default SidebarItem;
