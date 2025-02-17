import NextAuth, { CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const config = {
  runtime: "nodejs",
};

class CustomError extends CredentialsSignin {
  constructor(code: string) {
    super();
    this.code = code;
    this.message = code;
    this.stack = undefined;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new CustomError("Email and password are required.");
        }
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });
        if (!user) {
          throw new CustomError("UserNotFound");
        }
        if (!user.password) {
          throw new CustomError("CreatedUsingProvider");
        }
        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password as string
        );
        if (!passwordMatch) {
          throw new CustomError("PasswordIncorrect");
        }
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string; 
      }
      return token;
    },
  
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string; 
      }
      return session;
    },
    async signIn({ user, account }) {
      console.log("SignIn callback triggered for user:", user.email);
    
      if (!account) {
        throw new CustomError("Account data is missing.");
      }
    
      // Ensure user.email is defined
      if (!user.email) {
        throw new CustomError("User email is missing.");
      }
    
      // Check if the user already exists
      let existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });
    
      if (!existingUser) {
        console.log("No existing user found. Creating new user:", user.email);
    
        // Create a new user if they don't exist
        existingUser = await prisma.user.create({
          data: {
            name: user.name ?? undefined, 
            email: user.email,
            emailVerified: new Date(), 
            image: user.image ?? undefined, 
          },
        });
    
        console.log("New user created:", existingUser.email);
      } else {
        console.log("Existing user found:", existingUser.email);
    
        // Update the user's image if it's provided
        if (user.image) {
          console.log("Updating user image for:", existingUser.email);
          await prisma.user.update({
            where: { email: user.email },
            data: { image: user.image },
          });
        }
    
        // Set emailVerified to true for OAuth providers (if not already set)
        if (account.provider === "google" || account.provider === "github") {
          console.log("Setting emailVerified for OAuth user:", existingUser.email);
          await prisma.user.update({
            where: { email: user.email },
            data: { emailVerified: new Date() },
          });
        }
      }
    
      // Upsert the account
      console.log("Upserting account for:", existingUser.email);
      await prisma.account.upsert({
        where: {
          provider_providerAccountId: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
        },
        update: {
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          expires_at: account.expires_at,
        },
        create: {
          userId: existingUser.id,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          type: account.type,
          access_token: account.access_token,
          refresh_token: account.refresh_token,
          expires_at: account.expires_at,
        },
      });
    
      return true;
    }
  },
});