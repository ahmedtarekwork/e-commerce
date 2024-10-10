import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// types
import type { CategoryAndBrandType } from "../../utils/types";

type GetBrandsOrCategoriesQueryFnType = (p: {
  queryKey: [string, "brands" | "categories", number | undefined];
}) => Promise<CategoryAndBrandType[]>;

const getBrandsOrCategoriesQueryFn: GetBrandsOrCategoriesQueryFnType = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, type, limit],
}) => {
  const limitOption = limit ? `limit=${limit}` : "";
  return (await axios.get(`${type}?${limitOption}`)).data;
};

const useGetBrandsOrCategories = (
  type: "brands" | "categories",
  limit?: number,
  enabled = true
) => {
  return useQuery({
    queryKey: ["get", type, limit || 0],
    queryFn: getBrandsOrCategoriesQueryFn,
    enabled,
  });
};

export default useGetBrandsOrCategories;
