import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

// API route to create our conversations
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const {
      userId, // for one-to-one conversion
      isGroup,
      members,
      name,
    } = body;

    // Check if we have the current user
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if we send isGroup true but not sent members or not sent name.
    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Invalid Data", { status: 400 });
    }

    // Group Chat Conversation: Create a group chat if this group is present
    if (isGroup) {
      // Create a new conversation
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            // connect them using prisma
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              // separately adds the current user to the group members
              {
                id: currentUser.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });

      // Update sidebar of conversation [For Group Chat]
      newConversation.users.forEach((user) => {
        if (user.email) {
          pusherServer.trigger(user.email, "conversation:new", newConversation);
        }
      });

      return NextResponse.json(newConversation);
    }

    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            // look throughout all the conversations that exist we search for the userIds field and we are going to find if there is a conversation which has only these 2 users...
            userIds: {
              equals: [currentUser.id, userId], // ...user that currently logged in as and the user that trying to start a new conversation with. if it exists we not going to create a new one for them.
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });

    // Extract the only existing one like this
    const singleConversation = existingConversations[0];

    if (singleConversation) {
      // return the very same conversation back to the user, instead of creating a new one.
      return NextResponse.json(singleConversation);
    }

    // Individual one-on-one Conversation: Create a new conversation if this query does not exist
    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          // connect the users we are using.
          connect: [
            {
              // first user going to connect
              id: currentUser.id, // which is ourselves
            },
            {
              // second user going to connect
              id: userId, // which is pressed from the user box.
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    // Update sidebar of conversation [For Individual one-on-one Conversation Chat]
    newConversation.users.map((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "conversation:new", newConversation);
      }
    });

    return NextResponse.json(newConversation);
  } catch (error: any) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
