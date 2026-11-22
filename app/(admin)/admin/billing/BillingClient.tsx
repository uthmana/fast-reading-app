"use client";

import TableBuilder from "@/components/admin/tableBuilder";
import { AuthDataTypes, BillingTypes } from "@/app/(admin)/admin/dataModel";

type Props = {
  billings: BillingTypes[];
  authData: AuthDataTypes;
};

export default function BillingClient({ billings, authData }: Props) {
  const { canView, canEdit, canDelete, userData } = authData;

  return (
    <div className="w-full">
      {userData?.role === "ADMIN" ? (
        <TableBuilder
          showEditColumn={false}
          key={userData?.id}
          tableData={billings}
          showAddButton={false}
          columnKey="adminBillingColumn"
          showEditRow={canEdit}
          showDeleteRow={canDelete}
        />
      ) : canView ? (
        <TableBuilder
          showEditColumn={false}
          key={userData?.id}
          tableData={billings}
          showAddButton={false}
          columnKey="billingColumn"
          showEditRow={canEdit}
          showDeleteRow={canDelete}
        />
      ) : null}
    </div>
  );
}
