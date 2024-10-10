import { useQuery } from "@tanstack/react-query";
import axios from "../../utils/axios";

const getHomePageSliderImgsQueryFn = async () => {
  return (await axios.get("dashboard/homepageSliderImgs")).data;
};

const useGetHomePageSliderImgs = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ["getHomePageSliderImgs"],
    queryFn: getHomePageSliderImgsQueryFn,
    enabled,
  });
};

export default useGetHomePageSliderImgs;
