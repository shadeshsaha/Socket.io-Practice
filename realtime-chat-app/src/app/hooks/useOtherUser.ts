import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";

const useOtherUser = (
  conversation: FullConversationType | { users: User[] }
) => {
  const session = useSession();
  const otherUser = useMemo(() => {
    // get the current user email.
    const currentUserEmail = session?.data?.user?.email;

    // filter through the conversation users which is not the current user. That's how we find the other users.
    const otherUser = conversation.users.filter(
      (user) => user.email !== currentUserEmail
    );

    return otherUser[0]; // it's going to return a single user
  }, [session?.data?.user?.email, conversation.users]);

  return otherUser;
};

export default useOtherUser;
