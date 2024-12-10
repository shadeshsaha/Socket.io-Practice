// import { authOptions } from "@/app/utils/authOptions";
import prisma from "@/app/libs/prismadb";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcrypt";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // Basic login functionalities in email and password
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      // authorize function to compare what user has written as his password and compare to the database to see whether we can login the user or not.
      async authorize(credentials) {
        // Check email and password has been passed from the form
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid Credentials");
        }

        // If email and password is okay in that case we can continue with searching for the user
        const user = await prisma.user.findUnique({
          where: {
            // Find the user by the Unique ID
            email: credentials.email,
          },
        });

        // Check if this user actually exists
        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid Credentials");
        }

        // Check if user entered the correct password
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        // If password is not correct
        if (!isCorrectPassword) {
          throw new Error("Invalid Credentials");
        }

        return user;
      },
    }),
  ],
  // Userful for debugging mode in development for authentication state
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { authOptions, handler as GET, handler as POST };
