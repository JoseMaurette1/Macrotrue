import { auth, currentUser } from "@clerk/nextjs/server";

export const getSession = async () => {
  const { userId } = await auth();
  return userId ? { userId } : null;
};

export const getCurrentUserId = async (): Promise<string | null> => {
  const { userId } = await auth();
  return userId;
};

export const getCurrentUserInfo = async () => {
  const user = await currentUser();
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress,
    name: user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : null,
  };
};
