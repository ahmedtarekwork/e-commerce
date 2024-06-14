import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type GetCategoriesQueryFnType = (params: {
  queryKey: [string, number | string];
}) => Promise<string[]>;

const getCategoriesQueryFn: GetCategoriesQueryFnType = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, limit],
}) => {
  return (
    await axios.get(`products/categories${limit ? `?limit=${limit}` : ""}`)
  ).data;
};

const useGetCategories = (limit?: number) => {
  return useQuery({
    queryKey: ["getCategories", limit || ""],
    queryFn: getCategoriesQueryFn,
  });
};

export default useGetCategories;
