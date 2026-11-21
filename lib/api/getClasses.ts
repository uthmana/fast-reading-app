//   useEffect(() => {
//     if (!userData) return;

//     const requestData = async () => {
//       try {
//         setIsloading(true);
//         let resData = [] as any;
//         if (userData.role && userData.role !== "ADMIN") {
//           const query = encodeURIComponent(
//             JSON.stringify({
//               subscriberId: userData.subscriberId,
//             }),
//           );
//           setIsloading(true);
//           resData = await fetchData({
//             apiPath: `/api/classes?where=${query}&subscriber=true`,
//           });
//         } else {
//           resData = await fetchData({
//             apiPath: `/api/classes?subscriber=true`,
//           });
//         }
//         setClasses(resData);
//         setIsloading(false);
//       } catch (error) {
//         setIsloading(false);
//         console.error(error);
//         return;
//       }
//     };

//     requestData();
//   }, [userData]);

import { ClassesTypes } from "@/components/admin/model/admin";
import prisma from "@/lib/prisma";

type Props = {
  role: string;
  subscriberId?: number | undefined | unknown;
};

export const getClasses = async ({
  role,
  subscriberId,
}: Props): Promise<ClassesTypes[]> => {
  try {
    const where: any = {
      subscriberId,
    };

    const classes = await prisma.class.findMany({
      ...(role !== "ADMIN" ? where : {}),
      orderBy: { createdAt: "desc" },
      include: { students: true, subscriber: true },
    });

    return classes;
  } catch (error) {
    console.error("Error fetching classes:", error);
    return [];
  }
};
