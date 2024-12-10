"use client";

import Avatar from "@/app/components/Avatar";
import useOtherUser from "@/app/hooks/useOtherUser";
import { FullConversationType } from "@/app/types";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
// import { Conversation, Message, User } from "@prisma/client";
import AvatarGroup from "@/app/components/AvatarGroup";
import { format } from "date-fns";

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
}) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
  }, [data.id, router]);

  // Fetch the last message sent in the conversation
  const lastMessage = useMemo(() => {
    // Get all messages
    const messages = data.messages || [];

    // get the last message from the conversation
    return messages[messages.length - 1];
  }, [data.messages]);

  // Fetch user email
  const userEmail = useMemo(() => {
    return session?.data?.user?.email; // we have the user email
  }, [session?.data?.user?.email]);

  // Creating a control whether the user has seen this message already or not.
  const hasSeen = useMemo(() => {
    // check if there even is an existing last message
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    // Check if there is no current user email
    if (!userEmail) {
      return false;
    }

    // Go through this seenArray which hold all the users who have seen the message. And filter seenArray to only find the user which is the current logged in user and confirmed the length or array is not zero. Atleast one user inside matches the email of the logged in user and has seen the message.
    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  // Last message text
  const lastMessageText = useMemo(() => {
    // check last message is an image
    if (lastMessage?.image) {
      return "Sent an image";
    }

    // check last message is text
    if (lastMessage?.body) {
      return lastMessage.body; // it is actual message that someone sent.
    }

    // If these is none of this it means it just start a new conversation.
    return "Started a conversation";
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `
        w-full
        relative
        flex
        items-center
        space-x-3
      hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
        p-3
      `,
        selected ? "bg-neutral-100" : "bg-white"
      )}
    >
      {/* Creating a dynamic render */}
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={otherUser} />
      )}

      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div
            className="
              flex
              justify-between
              items-center
              mb-1
            "
          >
            <p
              className="
                text-md
                font-medium
              text-gray-900
              "
            >
              {/* "data.name" is a group chat conversation name */}
              {data.name || otherUser.name}
            </p>

            {/* Check if we have the last message */}
            {lastMessage?.createdAt && (
              <p
                className="
                  text-xs
                text-gray-400
                  font-light
                "
              >
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          <p
            className={clsx(
              `truncate text-sm`,
              hasSeen ? "text-gray-500" : "text-black font-medium"
            )}
          >
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
