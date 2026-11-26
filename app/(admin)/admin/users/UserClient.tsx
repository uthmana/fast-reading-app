"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import TableBuilder from "../(utils)/components/tableBuilder";
import FormBuilder from "../(utils)/components/formBuilder";
import { fetchData } from "../(utils)/lib/fetchData/fetchData";
import { useFormHandler } from "../(utils)/hooks/useFormHandler";
import Popup from "../(utils)/components/popup/popup";
import { AuthDataTypes } from "../(utils)/lib/dataModel";

type Props = {
  authData: AuthDataTypes;
  users: any[];
};

export default function UserClient({ authData, users: initialUsers }: Props) {
  const searchParams = useSearchParams();
  const regno = searchParams.get("regno");
  const [isLoading, setIsloading] = useState(false);
  const [users, setUsers] = useState(initialUsers);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const { canView, canCreate, canEdit, canDelete } = authData;
  const { isSubmitting, resError, handleFormSubmit } = useFormHandler();
  const [data, setData] = useState({} as any);

  useEffect(() => {
    const handleRegno = async () => {
      if (regno) {
        try {
          setIsloading(true);
          const resData = await fetchData({
            apiPath: `/api/registration?id=${regno}`,
          });
          setData({ name: resData.name, email: resData.email, regno });
          setIsShowPopUp(true);
          setIsloading(false);
        } catch (error) {
          setIsloading(false);
          console.error(error);
        }
      }
    };
    handleRegno();
  }, [regno]);

  const handleAction = async (actionType: string, info: any) => {
    const currentUser = info?.row?.original;

    if (actionType === "add") {
      setData({});
      setIsShowPopUp(true);
    }
    if (actionType === "edit") {
      setData({
        ...currentUser,
        ...(currentUser?.subscriberId
          ? {
              credit: currentUser.Subscriber.credit,
              price: currentUser.Subscriber.price,
            }
          : {}),
        createdAt: new Date(currentUser.createdAt).toISOString().split("T")[0],
      });
      setIsShowPopUp(true);
    }
    if (actionType === "delete") {
      if (confirm("Silmek istediğini emin misin ?")) {
        try {
          setIsloading(true);
          const res = await fetchData({
            apiPath: "/api/users",
            method: "DELETE",
            payload: { id: currentUser.id },
          });

          if (res) {
            setUsers(
              [...users].filter((val: any) => val.id !== currentUser.id),
            );
            setIsloading(false);
          }
        } catch (error) {
          setIsloading(false);
          console.error(error);
          return;
        }
      }
    }
  };

  const handleFormResponse = (response: Response) => {
    if (response.ok) {
      if (typeof window !== "undefined") {
        window.location.href = "/admin/users";
      }
    }
  };

  return (
    <div className="w-full">
      {canView ? (
        <TableBuilder
          key={isLoading}
          tableData={users}
          columnKey="usersColumn"
          onAction={handleAction}
          onAdd={handleAction}
          isLoading={isLoading}
          showAddButton={canCreate}
          showEditRow={canEdit}
          showDeleteRow={canDelete}
        />
      ) : null}

      {canCreate ? (
        <Popup
          show={isShowPopUp}
          onClose={() => setIsShowPopUp(false)}
          title="Kullanıcı Ekle"
          bodyClass="flex flex-col gap-3 pb-6 pt-0 !max-w-[700px] !w-[90%] max-h-[80%]"
          overlayClass="z-10"
          titleClass="border-b-2 border-blue-400 pt-6 pb-2 px-8 bg-[#f5f5f5]"
        >
          <FormBuilder
            id={"user"}
            className="px-8"
            data={data}
            onSubmit={(values) =>
              handleFormSubmit({
                values,
                method: "POST",
                apiPath: "/api/users",
                callback: (res: Response) => handleFormResponse(res),
              })
            }
            isSubmitting={isSubmitting}
            resError={resError}
            submitBtnProps={{
              text: "Kaydet",
              type: "submit",
            }}
          />
        </Popup>
      ) : null}
    </div>
  );
}
