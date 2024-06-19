// react
import {
  useRef,
  useState,
  useImperativeHandle,
  useEffect,
  forwardRef,
  memo,

  // types
  type ChangeEvent,
  type Dispatch,
  type RefObject,
  type SetStateAction,
  type MutableRefObject,
} from "react";

// components
import Warning from "../../../../../components/Warning";
import FormInput from "../../../../../components/appForm/Input/FormInput";
import FilterBySpecificTopicCell from "./FilterBySpecificTopicCell";

import SidebarWrapper, {
  type SidebarWraperComponentRefType,
} from "../../../../../components/layout/SidebarWrapper";
import ProductsPageFilterCell, {
  type ProductsPageFilterCellRefType,
} from "./ProductsPageFilterCell";

// types
import type { FiltersListType } from "../../ProductsPage";

type Props = {
  setPage: Dispatch<SetStateAction<number>>;
  sidebarCloseList: (HTMLElement | null)[];
  apiPriceRange: FiltersListType["priceRange"];
  setFiltersList: Dispatch<SetStateAction<FiltersListType>>;
  initCategories?: string[];
  initBrands?: string[];
};

export type ProductsPageFiltersListRefType = {
  sidebarRef: RefObject<SidebarWraperComponentRefType>;
  isResetProductsRef: MutableRefObject<boolean>;
};

export type AvailabilityOption = "in stock" | "out of stock" | "both";
const availabilityOptionsList: AvailabilityOption[] = [
  "both",
  "in stock",
  "out of stock",
];

const ProductsPageFiltersList = memo(
  forwardRef<ProductsPageFiltersListRefType, Props>(
    (
      {
        setPage,
        sidebarCloseList,
        apiPriceRange,
        setFiltersList,
        initCategories,
        initBrands,
      },
      ref
    ) => {
      // refs
      const isResetProductsRef = useRef(false);

      const catsListRef = useRef<ProductsPageFilterCellRefType>(null);
      const brandsListRef = useRef<ProductsPageFilterCellRefType>(null);
      const availabilityOptionRef = useRef<ProductsPageFilterCellRefType>(null);

      const sidebarRef = useRef<SidebarWraperComponentRefType>(null);
      const MinPriceRef = useRef<HTMLInputElement>(null);
      const MaxPriceRef = useRef<HTMLInputElement>(null);

      const filtersListStorage = useRef<FiltersListType>({
        categories: initCategories,
        brands: initBrands,
        availability: "both",
      });

      // states
      const [filtersListCloseList, setFiltersListCloseList] = useState<
        (HTMLElement | null)[]
      >([]);

      // handlers
      const preventWrongValues = (e: ChangeEvent<HTMLInputElement>) => {
        const min = e.currentTarget.min;
        const max = e.currentTarget.max;

        if (+e.currentTarget.value < +min) e.currentTarget.value = min;
        if (+e.currentTarget.value > +max) e.currentTarget.value = max;
      };

      const submitFilters = () => {
        const extractValues = (
          listRef: RefObject<ProductsPageFilterCellRefType>
        ) => {
          return listRef.current?.optionsRefsList
            ?.filter(({ current }) => current?.checked)
            .map(({ current }) => current?.name)
            .filter((val) => val !== undefined) as string[];
        };

        const categories = extractValues(catsListRef);
        const brands = extractValues(brandsListRef);

        let priceRange = {} as FiltersListType["priceRange"];

        if (MinPriceRef.current && MaxPriceRef.current) {
          if (priceRange) {
            priceRange.min = +MinPriceRef.current?.value;
            priceRange.max = +MaxPriceRef.current?.value;
          }
        } else priceRange = undefined;

        const finalValues: FiltersListType = {
          categories,
          brands,
          priceRange,
          availability: availabilityOptionRef.current?.optionsRefsList?.find(
            (input) => input.current?.checked
          )?.current?.dataset.name as FiltersListType["availability"],
        };

        isResetProductsRef.current = true;
        filtersListStorage.current = finalValues;
        setFiltersList(finalValues);
        setPage(1);

        sidebarRef.current?.setToggleSidebar(false);
      };

      const resetFilters = () => {
        const resetedValues: FiltersListType = {
          brands: [],
          categories: [],
          availability: "both",
          priceRange: undefined,
        };

        isResetProductsRef.current = true;
        filtersListStorage.current = resetedValues;
        setFiltersList(resetedValues);
        setPage(1);

        sidebarRef.current?.setToggleSidebar(false);
      };

      useImperativeHandle(ref, () => ({ sidebarRef, isResetProductsRef }), []);

      useEffect(() => {
        const isSame = sidebarCloseList.sort().every((el, i) => {
          return el?.isEqualNode(filtersListCloseList.sort()[i]);
        });

        if (!isSame) setFiltersListCloseList(sidebarCloseList);
      }, [sidebarCloseList, filtersListCloseList]);

      return (
        <SidebarWrapper
          insideClose={false}
          ref={sidebarRef}
          closeList={{
            reversedList: filtersListCloseList,
          }}
          id="filters-list-sidebar"
        >
          <Warning>Don't forget to hit Submit button</Warning>

          <ul className="products-page-filters-list">
            <FilterBySpecificTopicCell
              defaultValues={filtersListStorage.current["categories"]}
              ref={catsListRef}
              query="categories"
              title="Categories"
            />
            <FilterBySpecificTopicCell
              defaultValues={filtersListStorage.current["brands"]}
              ref={brandsListRef}
              query="brands"
              title="Brands"
            />

            <ProductsPageFilterCell
              defaultValues={
                filtersListStorage.current["availability"]
                  ? [filtersListStorage.current["availability"]]
                  : undefined
              }
              ref={availabilityOptionRef}
              optionsList={availabilityOptionsList}
              title="Availability"
              type="radio-list"
            />

            <ProductsPageFilterCell title="Price" type="custom">
              <div style={{ padding: 10 }}>
                <span
                  style={{
                    color: "var(--dark)",
                  }}
                >
                  From{" "}
                  <FormInput
                    onBlur={preventWrongValues}
                    type="number"
                    ref={MinPriceRef}
                    defaultValue={apiPriceRange?.min}
                    min={apiPriceRange?.min}
                    max={(apiPriceRange?.max || 1) - 1 || undefined}
                  />
                </span>
                <span
                  style={{
                    color: "var(--dark)",
                    marginTop: 10,
                    display: "block",
                  }}
                >
                  To{" "}
                  <FormInput
                    onBlur={preventWrongValues}
                    type="number"
                    ref={MaxPriceRef}
                    min={(apiPriceRange?.min || -1) + 1 || undefined}
                    max={apiPriceRange?.max}
                    defaultValue={apiPriceRange?.max}
                  />
                </span>
              </div>
            </ProductsPageFilterCell>
          </ul>

          <div className="filters-list-top-btns-holder">
            <button
              title="submit new filter btn"
              className="btn"
              onClick={submitFilters}
            >
              Submit
            </button>

            <button
              title="reset filters list btn"
              className="red-btn"
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>
        </SidebarWrapper>
      );
    }
  )
);
export default ProductsPageFiltersList;
