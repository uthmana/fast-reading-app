import { fetchData } from "@/utils/fetchData";

export const getCategoryOptions = async () => {
  try {
    const resData = await fetchData({ apiPath: "/api/category" });
    const res = resData?.map((item: { title: string; id: string }) => {
      return { name: item.title, value: item.id };
    });
    return res;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getArticleByCategoryId = async (id: string) => {
  try {
    const resData = await fetchData({
      apiPath: `/api/articles?categoryId=${id}`,
    });
    return resData;
  } catch (error) {
    console.error(error);
    return;
  }
};
