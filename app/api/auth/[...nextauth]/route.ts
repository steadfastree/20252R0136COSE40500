import NextAuth from "next-auth";
import StravaProvider from "next-auth/providers/strava";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    StravaProvider({
      clientId: process.env.STRAVA_CLIENT_ID as string,
      clientSecret: process.env.STRAVA_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "read,read_all,profile:read_all,activity:read_all",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }: { session: any; user: any }) {
      session.user.id = user.id;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
