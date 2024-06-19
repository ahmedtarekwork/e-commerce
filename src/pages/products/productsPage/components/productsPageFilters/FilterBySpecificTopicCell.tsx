// react
import { forwardRef, useEffect } from "react";

// components
import ProductsPageFilterCell, {
  type ListCellType,
  type SharedProductsPageFilterCellProps,
  type ProductsPageFilterCellRefType,
} from "./ProductsPageFilterCell";

// hooks
import useGetBrands from "../../../../../hooks/ReactQuery/products/useGetBrands";
import useGetCategories from "../../../../../hooks/ReactQuery/products/useGetCategories";

type Props = Pick<ListCellType, "defaultValues"> &
  Pick<SharedProductsPageFilterCellProps, "title"> &
  Partial<Pick<ListCellType, "type">> & {
    query: "categories" | "brands";
  };

const FilterBySpecificTopicCell = forwardRef<
  ProductsPageFilterCellRefType,
  Props
>(({ defaultValues, title, type, query }, ref) => {
  const {
    data: brands,
    isPending: brandsLoading,
    refetch: getBrands,
  } = useGetBrands(undefined, false);
  const {
    data: categories,
    isPending: categoriesLoading,
    refetch: getCategories,
  } = useGetCategories(undefined, false);

  useEffect(() => {
    query === "brands" ? getBrands() : getCategories();
  }, []);

  return (
    <ProductsPageFilterCell
      defaultValues={defaultValues}
      ref={ref}
      optionsList={query === "brands" ? brands : categories}
      title={title}
      type={type || "check-list"}
      loading={query === "brands" ? brandsLoading : categoriesLoading}
    />
  );
});
export default FilterBySpecificTopicCell;
