// react
import { forwardRef, useEffect } from "react";

// components
import ProductsPageFilterCell, {
  type ListCellType,
  type SharedProductsPageFilterCellProps,
  type ProductsPageFilterCellRefType,
} from "./ProductsPageFilterCell";

// hooks
import useGetBrandsOrCategories from "../../../../../hooks/ReactQuery/useGetBrandsOrCategories";

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
  } = useGetBrandsOrCategories("brands", undefined, false);
  const {
    data: categories,
    isPending: categoriesLoading,
    refetch: getCategories,
  } = useGetBrandsOrCategories("categories", undefined, false);

  useEffect(() => {
    query === "brands" ? getBrands() : getCategories();
  }, []);

  return (
    <ProductsPageFilterCell
      defaultValues={defaultValues}
      ref={ref}
      optionsList={(query === "brands" ? brands : categories)?.map(
        ({ name }) => name
      )}
      title={title}
      type={type || "check-list"}
      loading={query === "brands" ? brandsLoading : categoriesLoading}
    />
  );
});
export default FilterBySpecificTopicCell;
