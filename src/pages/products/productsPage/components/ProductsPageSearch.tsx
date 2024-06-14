// react
import { useState, useEffect, useDeferredValue, memo, useRef } from "react";

// react query
import { useQueryClient } from "@tanstack/react-query";

// components
import FormInput from "../../../../components/appForm/Input/FormInput";
import IconsSwitcher from "../../../../components/IconsSwitcher";

// icons
import { FaSearch } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";

type Props = {
  onChangeFn: (value: string) => void;
};

const ProductsPageSearch = memo(({ onChangeFn }: Props) => {
  const [value, setValue] = useState("");
  const deferredSearchQuery = useDeferredValue(value);
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["getProducts"],
    });
  }, [deferredSearchQuery, queryClient]);

  return (
    <div className="products-page-search-input-holder icons-switcher-holder-parent">
      <FormInput
        ref={inputRef}
        placeholder="Product title..."
        value={deferredSearchQuery}
        onChange={(e) => {
          setValue(e.target.value);
          onChangeFn(e.target.value);
        }}
      />

      <IconsSwitcher
        firstIcon={
          <button onClick={() => inputRef.current?.focus()}>
            <FaSearch />
          </button>
        }
        lastIcon={
          <button
            onClick={() => {
              setValue("");
              onChangeFn("");
            }}
          >
            <IoMdCloseCircle />
          </button>
        }
        isActive={!!value}
      />
    </div>
  );
});
export default ProductsPageSearch;
