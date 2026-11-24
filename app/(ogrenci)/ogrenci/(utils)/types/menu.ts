import { Prisma } from "@prisma/client";

export type MenuPropsTypes = Prisma.MenuItemGetPayload<{
  include: {
    subMenu: true;
  };
}>;

export type ExerciseMenuPropsTypes = MenuPropsTypes & {
  startLink?: string;
};
