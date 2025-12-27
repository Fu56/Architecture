import { Prisma } from '@prisma/client';

export type User = Prisma.UserGetPayload<{}>;
export type Role = Prisma.RoleGetPayload<{}>;
export type Design_stage = Prisma.Design_stageGetPayload<{}>;
export type Resource = Prisma.ResourceGetPayload<{
  include: {
    uploader: true,
    design_stage: true,
  }
}>;
export type Comment = Prisma.CommentGetPayload<{
  include: {
    user: true,
  }
}>;
export type Rating = Prisma.RatingGetPayload<{}>;
export type Flag = Prisma.FlagGetPayload<{
  include: {
    resource: true,
    resolved_by: true,
  }
}>;
export type Notification = Prisma.NotificationGetPayload<{
  include: {
    user: true,
    resource: true,
  }
}>;
