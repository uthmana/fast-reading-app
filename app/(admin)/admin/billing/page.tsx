"use client";

import React, { useEffect, useState } from "react";
import TableBuilder from "@/components/admin/tableBuilder";
import { fetchData } from "@/utils/fetchData";
import { useAuthHandler } from "../authHandler/authOptions";

export default function page() {
  const [isLoading, setIsloading] = useState(false);
  const [billings, setBillings] = useState([] as any);
  const { canView, canEdit, canDelete, userData, loading } = useAuthHandler();

  useEffect(() => {
    if (loading || !userData) return;
    const requestData = async () => {
      try {
        setIsloading(true);

        if (userData.role === "ADMIN") {
          const resData = await fetchData({
            apiPath: `/api/subscribers`,
          });
          const allData = resData.map((dVal: any) => {
            return {
              id: dVal.id,
              name: dVal?.users.find(
                (item: any) => item.subscriberId === dVal.id
              )?.name,
              credit: dVal.credit,
              price: dVal.price ?? 0,
              currency: "TL",
              startDate: dVal.createdAt,
            };
          });

          setBillings(allData);
          setIsloading(false);
          return;
        }

        const query = encodeURIComponent(
          JSON.stringify({
            subscriberId: userData.subscriberId,
          })
        );
        const resData = await fetchData({
          apiPath: `/api/students?where=${query}`,
        });

        //let resData = await fetchData({ apiPath: "/api/students" });
        const allData = resData.map((dVal: any) => {
          const { user, ...rest } = dVal;
          const { id, ...userRest } = user;
          return {
            ...userRest,
            id: rest.id,
            name: userRest.username,
            fee: rest.fee,
            currency: "TL",
            startDate: user.createdAt,
          };
        });
        setBillings(allData);
        setIsloading(false);
      } catch (error) {
        setIsloading(false);
        console.error(error);
        return;
      }
    };

    requestData();
  }, [userData, loading]);

  return (
    <div className="w-full">
      {userData?.role === "ADMIN" ? (
        <TableBuilder
          showEditColumn={false}
          isLoading={isLoading}
          key={isLoading}
          tableData={billings}
          showAddButton={false}
          columnKey="adminBillingColumn"
          showEditRow={canEdit}
          showDeleteRow={canDelete}
        />
      ) : canView ? (
        <TableBuilder
          showEditColumn={false}
          isLoading={isLoading}
          key={isLoading}
          tableData={billings}
          showAddButton={false}
          columnKey="billingColumn"
          showEditRow={canEdit}
          showDeleteRow={canDelete}
        />
      ) : null}

      {}
    </div>
  );
}
