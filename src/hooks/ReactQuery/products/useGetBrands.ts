import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type GetBrandsQueryFnType = (p: {
  queryKey: [string, number | undefined];
}) => Promise<string[]>;

const getBrandsQueryFn: GetBrandsQueryFnType = async ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  queryKey: [_key, limit],
}) => {
  const limitOption = limit ? `limit=${limit}` : "";
  return (await axios.get(`products/brands?${limitOption}`)).data;
};

const useGetBrands = (limit?: number, enabled = true) => {
  return useQuery({
    queryKey: ["getBrands", limit],
    queryFn: getBrandsQueryFn,
    enabled,
  });
};

export default useGetBrands;
