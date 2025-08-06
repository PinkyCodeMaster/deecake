import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, openAPI } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { APIError } from "better-auth/api";
import * as schema from "@/db/schema/auth";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { db } from "@/db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url, token }) => {
            // Implement your email sending logic here
            console.log(`Sending reset password email to ${user.email} with token ${token} and URLs ${url}`);
        },
        onPasswordReset: async ({ user }) => {
            // Implement your logic after password reset, e.g., logging, notifications, etc.
            // Example: send a notification email or log the reset action
            console.log(`Password for user ${user.email} has been reset.`);
        },
    },
    emailVerification: {
        sendOnSignUp: true,
        enabled: true,
        tokenExpiration: 60 * 60 * 24, // 24 hours
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }) => {
            // Implement your email sending logic here
            console.log(`Sending verification email to ${user.email} with token ${token} and URLs ${url}`);
        },
        async afterEmailVerification(user) {
            // Your custom logic here, e.g., grant access to premium features
            // sent welcome email, etc.
            console.log(`${user.email} has been successfully verified!`);
        }
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user, ctx) => {
                    // @ts-expect-error user is not typed
                    if (user.isAgreedToTerms === false) {
                        throw new APIError("BAD_REQUEST", {
                            message: "User must agree to the TOS before signing up.",
                        });
                    }
                    if (process.env.NODE_ENV !== "test") {
                        const userCount = await ctx!.context.adapter.count({ model: "user" });
                        if (userCount >= 1) {
                            // first user is automatically an grant admin privileges
                            return { data: { ...user, role: "admin" } };
                        }
                    }
                    return {
                        data: user,
                    };

                }
            },
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                input: false
            },
            isAgreedToTerms: {
                type: "boolean",
                input: false,
                defaultValue: false,
            }
        },
        deleteUser: {
            enabled: true,
            sendDeleteAccountVerification: async ({ user, url, token }) => {
                console.log(`Sending account deletion verification email to ${user.email} with token ${token} and URLs ${url}`);
                // Implement your email sending logic here
                // Example: sendEmail(user.email, "Verify Account Deletion", url);
            },
            afterDelete: async (user) => {
                // Perform any cleanup or additional actions here
                console.log(`User ${user.email} has been deleted successfully.`);
            },
        },
    },
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["apple", "email-password", "google", "microsoft",],
            allowDifferentEmails: true,
            updateUserInfoOnLink: false,
            allowUnlinkingAll: true
        }
    },
    plugins: [
        admin(),
        nextCookies(),
        openAPI(),
        expo()
    ]
});

export type Session = typeof auth.$Infer.Session;