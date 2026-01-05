// react
import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

// components
import SelectList from "../../../../components/selectList/SelectList";

// hooks
import useGetBrandsOrCategories from "../../../../hooks/ReactQuery/useGetBrandsOrCategories";

// types
import type { ProductType } from "../../../../utils/types";

export type ProductSelectedCategoryAndBrandRefType = {
  selectedItem: string;
  setSelectedItem: Dispatch<SetStateAction<string>>;
};

type Props = {
  isLoading: boolean;
  type: "category" | "brand";
  product?: ProductType;
};

const ProductSelectedCategoryAndBrand = forwardRef<
  ProductSelectedCategoryAndBrandRefType,
  Props
>(({ isLoading, type, product }, ref) => {
  const PLURAL_TYPE = type === "category" ? "Categories" : "Brands";

  const [selectedItem, setSelectedItem] = useState<string>(
    product?.category?._id || ""
  );

  const {
    data: items,
    refetch: getItems,
    isPending: getItemsLoading,
  } = useGetBrandsOrCategories(
    PLURAL_TYPE.toLowerCase() as "brands" | "categories",
    undefined,
    false
  );

  useImperativeHandle(
    ref,
    () => ({
      selectedItem,
      setSelectedItem,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedItem, type]
  );

  useEffect(() => {
    getItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <span className="select-list-label">{type} :</span>
      <SelectList
        label={getItemsLoading ? `Loading ${PLURAL_TYPE}...` : `choose ${type}`}
        disabled={{
          value: isLoading || getItemsLoading,
        }}
        listOptsArr={(items || []).map((item) => {
          return {
            selected: item._id === selectedItem,
            text: item.name,
          };
        })}
        optClickFunc={(e) => {
          const itemId = (items || []).find(
            (cat) => cat.name === e.currentTarget.dataset.opt
          )?._id;

          if (itemId) setSelectedItem(itemId);
        }}
      />
    </div>
  );
});
export default ProductSelectedCategoryAndBrand;
