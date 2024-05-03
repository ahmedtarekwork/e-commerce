import { useQuery } from "@tanstack/react-query";
import { axiosWithToken } from "../utiles/axios";
import { ProductType } from "../utiles/types";

const getProductsQueryFn = async (): Promise<ProductType[]> => {
  return (await axiosWithToken.get("/products")).data;
};

const useGetProducts = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ["getProducts"],
    queryFn: getProductsQueryFn,
    enabled,
  });
};

export default useGetProducts;
