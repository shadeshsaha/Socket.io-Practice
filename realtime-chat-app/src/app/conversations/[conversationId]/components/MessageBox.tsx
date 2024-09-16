"use client";

import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import ImageModal from "./ImageModal";

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  // Get session
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);

  // * Conditional variables which will use to recognize whether the message is our own message, or is it other users message.. should be displayed that this message has been seen by someone...
  // comparing the current session email with the email of the sender of the message.
  const isOwn = session?.data?.user?.email === data?.sender?.email;

  // Create a seen list of all the users that have seen the message.
  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(", ");
  // filtering through "data.seen" & removing the sender user from the list of people who have seen the message.

  // Dynamic Classes Start
  const container = clsx("flex gap-3 p-4", isOwn && "justify-end");

  const avatar = clsx(isOwn && "order-2");

  // Class for Body
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");

  // Class for Message
  const message = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
    data.image ? "rounded-md p-0" : "rounded-full py-2 px-3" // modify the message class if the message is an image
  );
  // Dynamic Classes End

  return (
    // Displaying messages here...
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>

      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{data.sender.name}</div>

          <div className="text-xs text-gray-400">
            {/* format is the created at of this message */}
            {format(new Date(data.createdAt), "p")}
          </div>
        </div>

        <div className={message}>
          <ImageModal
            src={data.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />

          {/* render an image on chat/message */}
          {data.image ? (
            <Image
              onClick={() => setImageModalOpen(true)}
              alt="Image"
              height="288"
              width="288"
              src={data.image}
              className="
                object-cover
                cursor-pointer
                hover:scale-110
                transition
                translate
              "
            />
          ) : (
            <div>{data.body}</div>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div
            className="
              text-xs
              font-light
            text-gray-500
            "
          >
            {`Seen by ${seenList}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
