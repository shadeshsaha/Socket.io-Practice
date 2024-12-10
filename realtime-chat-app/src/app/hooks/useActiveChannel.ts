import { Channel, Members } from "pusher-js";
import { useEffect, useState } from "react";
import { pusherClient } from "../libs/pusher";
import useActiveList from "./useActiveList";

const useActiveChannel = () => {
  // Destruct set, add, remove actions from zustand store
  const { set, add, remove } = useActiveList();
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  // This is going to listen to all the people joining the present channel or leaving the presence channel and move them to the global active list.
  useEffect(() => {
    // First get the active channel
    let channel = activeChannel;

    // if the channel doesn't exist
    if (!channel) {
      // "presence" channel has to be named "presence-messenger" in this case.
      channel = pusherClient.subscribe("presence-messenger");
      setActiveChannel(channel);
    }

    // initial bind event where it load all the active users which might have been logged in before us
    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      // difining initial members
      const initialMembers: string[] = [];

      // iterate over these "members" and push their emails
      members.each((member: Record<string, any>) =>
        initialMembers.push(member.id)
      );
      set(initialMembers);

      /* 
                using each instead of forEach/map because "Members" is a special type for its special class from Pusher. So its not like a normal array. We have to use (dot)each here.
            */

      /*
                "member.id" is practically we are working with user emails(auth.ts>user_id) and we have the "presence-messenger" channel which only works when we create the authentication(auth.ts). That's why we had to create that authentication otherwise it won't work. 

                As "Pusher" documentation, called "subscription_succeeded" we are going to define our initial members(25-29 line). So when we ourselves subscribe to this presence channel we are going to list of all active members and set them in "Global store(initialMembers)". Compare who's active and who is not.
            */
    });

    // binds for when users get added
    channel.bind("pusher:member_added", (member: Record<string, any>) => {
      add(member.id);
    });

    // binds for when users get removed
    channel.bind("pusher:member_removed", (member: Record<string, any>) => {
      remove(member.id);
    });

    // unsubscribe
    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe("presence-messenger");
        setActiveChannel(null);
      }
    };
  }, [activeChannel, set, add, remove]);
};

export default useActiveChannel;
