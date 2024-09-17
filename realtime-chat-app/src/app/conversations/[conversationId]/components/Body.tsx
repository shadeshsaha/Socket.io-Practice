"use client";

import useConversation from "@/app/hooks/useConversation";
import { pusherClient } from "@/app/libs/pusher";
import { FullMessageType } from "@/app/types";
import axios from "axios";
import { find } from "lodash";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);

  // Creating bottom wrath: when we get new message, it scroll down if user is all way up or a lot messages have come
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();

  useEffect(() => {
    // When we open this body component or this exact page loads, we'll send a post route to seen the last message.
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    // subscribe to pusher and expect all kinds of events
    pusherClient.subscribe(conversationId);

    // to see latest messages
    bottomRef?.current?.scrollIntoView();

    // This handler receive the new message from Pusher
    const messageHandler = (message: FullMessageType) => {
      // when we receive a new message we're going to alert everyone that we have seen that message.
      axios.post(`/api/conversations/${conversationId}/seen`);

      // using setMessages, get access to the current list of messages here
      setMessages((current) => {
        // then compare the current list of messages to the query which is going to search if there is any message in the current array which already has an ID of this new message that is coming.
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView();
    };

    // bind pusherClient to expect "messages:new"-this key
    pusherClient.bind("messages:new", messageHandler);

    // unbind and unsubscribe every time I unmount otherwise that might cause an overflow
    // this is an unmount method with the useEffect
    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Create an iteration of messages */}
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div ref={bottomRef} className="pt-24" />
    </div>
  );
};

export default Body;
