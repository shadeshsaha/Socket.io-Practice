// Add a functionality to this active status
/* 
  first we have to create a presence channel where we are going to search for active users in order to know whether we assigned an active status or an offline status.
*/

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { pusherServer } from "@/app/libs/pusher";
// import { authOptions } from "@/app/utils/authOptions";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const session = await getServerSession(request, response, authOptions);

  // Check we are authorized or not
  if (!session?.user?.email) {
    return response.status(401);
  }

  // Defining Sockets
  const socketId = request.body.socket_id;
  const channel = request.body.channel_name;
  const data = {
    user_id: session.user.email,
  };

  const authResponse = pusherServer.authorizeChannel(socketId, channel, data);

  return response.send(authResponse);
}
