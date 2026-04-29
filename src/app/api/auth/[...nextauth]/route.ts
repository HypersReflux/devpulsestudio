import NextAuth, { type AuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const authOptions: AuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt", // ✅ now properly typed
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };