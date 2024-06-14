import { useQuery } from "@tanstack/react-query";
import axios from "../../utiles/axios";

const getHomePageSliderImgsQueryFn = async () => {
  return (await axios.get("dashboard/homepageSliderImgs")).data.imgs;
};

const useGetHomePageSliderImgs = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ["getHomePageSliderImgs"],
    queryFn: getHomePageSliderImgsQueryFn,
    enabled,
  });
};

export default useGetHomePageSliderImgs;
