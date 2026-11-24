import { $Enums } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

export type AdminRouteTypes = (
  | {
      name: string;
      path: string;
      icon: JSX.Element;
      children: {
        name: string;
        path: string;
      }[];
    }
  | {
      name: string;
      path: string;
      icon: JSX.Element;
      children?: undefined;
    }
)[];

export type AuthDataTypes = {
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  userData:
    | ({
        id: string;
        role: string;
        name: string;
        username: string;
        student: any;
        subscriberId?: number | undefined;
      } & {
        name?: string | null | undefined;
        email?: string | null | undefined;
        image?: string | null | undefined;
      })
    | undefined;
  canViewMenu: boolean;
  hasPermission: boolean;
};

export type ArticleTypes = {
  id: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  subscriberId: number | null | undefined;
  title: string;
  description: string;
  hasQuestion: boolean;
  tests: JsonValue;
  categoryId: number;
} | null;

export type BillingTypes = {
  id: any;
  name: any;
  credit: any;
  price: any;
  currency: string;
  startDate: any;
};

export type CategoryTypes = {
  id: number;
  createdAt: Date;
  updatedAt: Date | null;
  subscriberId: number | null;
  title: string;
  description: string | null;
};

export type ClassesTypes = {
  name: string;
  id: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  subscriberId: number | null;
  studyGroup: $Enums.StudyGroup;
  teacherId: number | null;
};

export type WordsTypes = {
  subscriberId: number | null;
  id: number;
  createdAt: Date;
  updatedAt: Date | null;
  word: string;
  similarWord: string | null;
  wpc: number;
  lpw: number;
};

export type RegistrationTypes = {
  name: string;
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date | null;
  studyGroup: string | null;
  phone: string | null;
  type: $Enums.RegistrationType;
  companyInfo: string | null;
  message: string | null;
  isProcessed: boolean;
};

export type TeacherTypes = {
  subscriberId: number;
  id: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  userId: number;
};
