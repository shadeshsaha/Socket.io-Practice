import prisma from "../../app/libs/prismadb";
import getSession from "./getSession";

const getUsers = async () => {
  const session = await getSession();

  if (!session?.user?.email) {
    return [];
  }

  try {
    // Eleminating own user from the list of these users.
    const users = await prisma.user.findMany({
      // Ordering all the users by newest using createdAt descending
      orderBy: {
        createdAt: "desc",
      },
      // Finding every user where the email is not our current user
      where: {
        NOT: {
          email: session.user.email,
        },
      },
    });

    return users;
  } catch (error: any) {
    return [];
  }
};

export default getUsers;
