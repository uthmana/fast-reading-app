import { fetchData } from "@/utils/fetchData";

interface SessionTypes {
  user: {
    id: string;
    role: string;
    name: string;
    username: string;
    student: any;
    subscriberId?: number;
  };
}

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

export const getArticleOptionsByCategoryId = async (id: string) => {
  try {
    const resData = await fetchData({
      apiPath: `/api/articles?categoryId=${id}`,
    });
    const res = resData?.map((item: { title: string; id: string }) => {
      return { name: item.title, value: item.id, data: JSON.stringify(item) };
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

export const getExerciseOptions = async (session: SessionTypes) => {
  try {
    const resData = await fetchData({ apiPath: "/api/exercises" });
    const res = resData?.map((item: { title: string; id: string }) => {
      return { name: item.title, value: item.id };
    });
    return res;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getTeacherOptions = async (session: SessionTypes) => {
  try {
    const query = encodeURIComponent(
      JSON.stringify({
        subscriberId: session.user.subscriberId,
      }),
    );
    const resData = await fetchData({
      apiPath: `/api/teachers?where=${query}`,
    });
    const res = resData?.map(
      (item: { title: string; id: string; user: any }) => {
        return { name: item.user.name, value: item.id };
      },
    );
    return res;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getClassOptions = async (session: SessionTypes) => {
  try {
    const query = encodeURIComponent(
      JSON.stringify({
        subscriberId: session.user.subscriberId,
      }),
    );
    const resData = await fetchData({
      apiPath: `/api/classes?where=${query}&subscriber=true`,
    });
    const res = resData?.map((item: { id: string; name: any }) => {
      return { name: item.name, value: item.id };
    });
    return res;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getClassOptionsById = async (id: string) => {
  try {
    const query = encodeURIComponent(
      JSON.stringify({
        subscriberId: id,
      }),
    );
    const resData = await fetchData({
      apiPath: `/api/classes?where=${query}&subscriber=true`,
    });
    const res = resData?.map((item: { id: string; name: any }) => {
      return { name: item.name, value: item.id };
    });
    return res;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const getSubscriberOptions = async () => {
  try {
    const resData = await fetchData({
      apiPath: `/api/subscribers`,
    });
    const res = resData?.map((item: { id: string; users: any }) => {
      return { name: item.users?.[0].name, value: item.id };
    });
    return res;
  } catch (error) {
    console.error(error);
  }
};
export const getArticleByStudyGroup = async ({
  studyGroup,
  hasQuestion,
}: {
  studyGroup: string;
  hasQuestion: boolean;
}) => {
  const query = encodeURIComponent(
    JSON.stringify({
      studyGroup,
      hasQuestion,
    }),
  );
  try {
    const resData = await fetchData({
      apiPath: `/api/articles?where=${query}`,
    });
    return resData;
  } catch (error) {
    console.error(error);
  }
};

export const getWordListByLetterCount = async (
  letterCount: number,
  wpc: number,
) => {
  const query = encodeURIComponent(
    JSON.stringify({
      lpw: letterCount,
      wpc: wpc || 1,
    }),
  );
  try {
    const wordData = await fetchData({
      apiPath: `/api/words?where=${query}`,
    });
    return wordData;
  } catch (error) {
    console.error(error);
  }
};

export const getWordListPerCount = async (letterCount: number) => {
  const query = encodeURIComponent(
    JSON.stringify({
      wpc: letterCount || 1,
    }),
  );
  try {
    const wordData = await fetchData({
      apiPath: `/api/words?where=${query}`,
    });
    return wordData;
  } catch (error) {
    console.error(error);
  }
};
