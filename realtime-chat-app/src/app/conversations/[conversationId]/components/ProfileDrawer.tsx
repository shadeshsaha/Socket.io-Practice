"use client";

import useOtherUser from "@/app/hooks/useOtherUser";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Conversation, User } from "@prisma/client";
import { format } from "date-fns";
import { Fragment, useMemo } from "react";
import { IoClose } from "react-icons/io5";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: Conversation & {
    users: User[];
  };
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const otherUser = useOtherUser(data);

  // Joined date of messenger
  const joinedDate = useMemo(() => {
    return format(new Date(otherUser.createdAt), "PP");
  }, [otherUser.createdAt]);

  const title = useMemo(() => {
    return data.name || otherUser.name; // Group chat name or user name.
  }, [data.name, otherUser.name]);

  // Status text
  const statusText = useMemo(() => {
    // if data is grouped
    if (data.isGroup) {
      return `${data.users.length} members.`;
    }

    return "Active";
  }, [data]);
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          // animations
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="
                fixed
                inset-0
              bg-black
                bg-opacity-40
            "
          />
        </TransitionChild>

        <div
          className="
                fixed
                inset-0
                overflow-hidden
            "
        >
          <div
            className="
                    absolute
                    inset-0
                    overflow-hidden
                "
          >
            <div
              className="
                        pointer-events-none
                        fixed
                        inset-y-0
                        right-0
                        flex
                        max-w-full
                        pl-10
                    "
            >
              <TransitionChild
                as={Fragment}
                // animations
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveTo="translate-x-full"
              >
                <DialogPanel
                  className="
                                pointer-events-auto
                                w-screen
                                max-w-md
                            "
                >
                  <div
                    className="
                                    flex
                                    h-full
                                    flex-col
                                    overflow-y-scroll
                                    bg-white
                                    py-6
                                    shadow-xl
                                "
                  >
                    <div className="px-4 sm:px-6">
                      <div
                        className="
                                            flex
                                            items-start
                                            justify-end
                                        "
                      >
                        <div
                          className="
                                                ml-3
                                                flex
                                                h-7
                                                items-center
                                            "
                        >
                          <button
                            onClick={onClose}
                            type="button"
                            className="
                                                    rounded-md
                                                    bg-white
                                                    text-gray-400
                                                    hover:text-gray-500
                                                    focus:outline-none
                                                    focus:ring-2
                                                    focus:ring-sky-500
                                                    focus:ring-offset-2
                                                "
                          >
                            <span className="sr-only">Close Panel</span>
                            <IoClose size={24} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProfileDrawer;
