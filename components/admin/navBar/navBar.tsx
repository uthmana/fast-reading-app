"use client";
import Icon from "@/components/icon/icon";
import Profile from "../profile/profile";
import { MdCreditScore } from "react-icons/md";
import { useAuthHandler } from "@/app/(admin)/admin/authHandler/authOptions";
import { useEffect, useState } from "react";
import { fetchData } from "@/utils/fetchData";

export default function NavBar({
  toggleSidebar,
  isSidebarOpen,
}: {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}) {
  const [credit, setCredit] = useState(0);
  const { loading, userData } = useAuthHandler();

  useEffect(() => {
    if (loading || !userData || userData?.role === "ADMIN") return;

    const requestData = async () => {
      try {
        const query = encodeURIComponent(
          JSON.stringify({
            id: userData.subscriberId,
          })
        );
        const resData = await fetchData({
          apiPath: `/api/subscribers?where=${query}`,
        });

        setCredit(resData.credit);
      } catch (error) {
        console.error(error);
        return;
      }
    };

    requestData();
  }, [loading, userData]);

  return (
    <header className="w-full h-[60px] flex items-center justify-between px-4 bg-white shadow-md sticky top-0 z-20">
      <div className="flex gap-4 items-center">
        <button
          onClick={toggleSidebar}
          className="text-gray-700 hover:text-black"
          aria-label="Toggle sidebar"
        >
          <Icon name="menu" className="w-6 h-6 text-gray-600" />
        </button>
        {userData?.role !== "ADMIN" ? (
          <div className="bg-green-500 hover:bg-green-600 text-sm h-[60px] px-3 flex flex-col justify-center items-center text-white">
            <MdCreditScore className="w-5 h-5" />
            <b>{credit || 0} Kredi</b>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-2  py-4">
        <p className="text-sm">{userData?.name}</p>
        <Profile user={userData} />
      </div>
    </header>
  );
}
