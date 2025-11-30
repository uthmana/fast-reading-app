"use client";

import React, { useEffect, useState } from "react";
import TableBuilder from "@/components/admin/tableBuilder";
import { fetchData } from "@/utils/fetchData";

export default function page() {
  const [isLoading, setIsloading] = useState(false);
  const [students, setStudents] = useState([] as any);

  useEffect(() => {
    const requestData = async () => {
      try {
        setIsloading(true);
        let resData = await fetchData({ apiPath: "/api/students" });
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
        setStudents(allData);

        setIsloading(false);
      } catch (error) {
        setIsloading(false);
        console.error(error);
        return;
      }
    };

    requestData();
  }, []);

  return (
    <div className="w-full">
      <TableBuilder
        showEditColumn={false}
        isLoading={isLoading}
        key={isLoading}
        tableData={students}
        showAddButton={false}
        columnKey="billingColumn"
      />
    </div>
  );
}
