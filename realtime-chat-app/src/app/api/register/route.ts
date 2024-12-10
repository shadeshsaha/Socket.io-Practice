import bcrypt from "bcrypt";

import { NextResponse } from "next/server";
import prisma from "../../libs/prismadb";

export async function POST(request: Request) {
  try {
    // Extract our body from the request
    const body = await request.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return new NextResponse("Missing information", { status: 404 });
    }

    // Create hashed password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Define User
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.log(error, "REGISTRATION ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
