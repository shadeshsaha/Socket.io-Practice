"use client";

import useConversation from "@/app/hooks/useConversation";
import { pusherClient } from "@/app/libs/pusher";
import { FullConversationType } from "@/app/types";
import { User } from "@prisma/client";
import clsx from "clsx";
import { find } from "lodash";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";

interface ConversationListProps {
  // Will update these items in real time using "Pusher", which users "Sockets" underneath.
  initialItems: FullConversationType[];
  users: User[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
}) => {
  const session = useSession();
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const { conversationId, isOpen } = useConversation();

  // Create a Pusher key
  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    // check if we have the Pusher key, means the session has not loaded yet.
    if (!pusherKey) {
      return; // return and break this useEffect
    }

    // pusherKey is going to our email because in conversations that is where we are going to trigger an update for each user's conversation list.
    pusherClient.subscribe(pusherKey);

    // Append new conversation to the list of items
    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        // compare if there is an existing conversation that we are trying to add. Ensure that there are no duplicates.
        if (find(current, { id: conversation.id })) {
          return current;
        }

        return [conversation, ...current];
      });
    };

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((currentConversation) => {
          // Comparison to find the one to update.
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            };
          }

          return currentConversation;
        })
      );

      // "conversation": is the new conversation that came from the Pusher
      // "currentConversation" is from the "current" list from current array
    };

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [
          ...current.filter(
            (singleConversation) => singleConversation.id !== conversation.id
          ),
        ];
      });
    };

    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:remove", removeHandler);

    // return/unmount function
    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:remove", removeHandler);
    };
  }, [pusherKey]);

  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <aside
        className={clsx(
          `
          fixed
          inset-y-0
          pb-20
          lg:pb-0
          lg:left-20
          lg:w-80
          lg:block
          overflow-y-auto
          border-r
        border-gray-200
        `,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div
              className="
                text-2xl 
                font-bold
              text-neutral-800
              "
            >
              Messages
            </div>

            {/* Add New Chat */}
            <div
              onClick={() => setIsModalOpen(true)}
              className="
                rounded-full
                p-2
              bg-gray-100
              text-gray-600
                cursor-pointer
                hover:opacity-75
                transition
              "
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>

          {items.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
