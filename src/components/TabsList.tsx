import { createRef, useState } from "react";
import { nanoid } from "@reduxjs/toolkit";

type Props = {
  lists: {
    tabName: string;
    tabContent: JSX.Element;
  }[];
};

const TabsList = ({ lists }: Props) => {
  const [selected, setSelected] = useState(lists[0]);
  const btnsListRef = lists.map(() => createRef<HTMLButtonElement>());

  return (
    <div className="tabs-list">
      <div className="tabs-list-left-side">
        <ul>
          {lists.map(({ tabName }, i) => (
            <li key={nanoid()}>
              <button
                title="tabs list btn"
                ref={btnsListRef[i]}
                onClick={(e) => {
                  btnsListRef.forEach((btn) =>
                    btn.current?.classList.toggle(
                      "active",
                      btn.current === e.currentTarget
                    )
                  );

                  setSelected(
                    lists.find((list) => list.tabName === tabName) || selected
                  );
                }}
                className={
                  "tabs-list-btn" +
                  (selected.tabName === tabName ? " active" : "")
                }
              >
                {tabName}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="tabs-list-right-side">{selected.tabContent}</div>
    </div>
  );
};
export default TabsList;
