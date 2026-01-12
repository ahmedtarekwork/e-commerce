// react
import { type ReactNode } from "react";

// dnd kit
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// icons
import { FaBars } from "react-icons/fa6";

type Props = {
  children: ReactNode;
  id: string;
};

const SortableItem = ({ children, id }: Props) => {
  const { listeners, attributes, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: "1px solid var(--main)",
    padding: 4,
    borderRadius: 4,
  };

  return (
    <li ref={setNodeRef} style={style}>
      <button
        type="button"
        className="btn"
        style={{
          marginBottom: "0.5rem",
          width: "100%",
          display: "grid",
          placeContent: "center",
        }}
        {...attributes}
        {...listeners}
      >
        <FaBars />
      </button>

      {children}
    </li>
  );
};
export default SortableItem;
