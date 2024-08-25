import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversations = async () => {
  const currentUser = await getCurrentUser();

  // If there is no current user
  if (!currentUser?.id) {
    return [];
  }

  try {
    // find the conversations
    const conversations = await prisma.conversation.findMany({
      // order newly conversations by the latest message that has been sent.
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        userIds: {
          // load every single conversation that includes current user, that includes single one-to-one conversations and group chats.
          has: currentUser.id,
        },
      },
      // populate some of the fields that have in the conversations model.
      include: {
        users: true,
        messages: {
          // populate the users inside of the messages
          include: {
            sender: true, // author of the message.
            seen: true, // seen is an array of people who have seen the latest message.
          },
        },
      },
    });

    return conversations;
  } catch (error: any) {
    return [];
  }
};

export default getConversations;
