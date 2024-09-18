import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

interface IParams {
  conversationId?: string;
}

export async function DELETE(
  request: Request, // 1st argument
  { params }: { params: IParams } // 2nd argument
) {
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // having current user then find the conversation
    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
      },
    });

    // check if there is no existing conversation
    if (!existingConversation) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    // if there is existing conversation
    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        // users which are part of the group can remove the group
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(
          user.email,
          "conversation:remove",
          existingConversation
        );
      }
    });

    return NextResponse.json(deletedConversation);
  } catch (error: any) {
    console.log("Error_Conversation_Delete: ", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
