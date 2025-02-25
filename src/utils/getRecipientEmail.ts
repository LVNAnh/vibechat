import { Conversation } from "@/types";
import { User } from "firebase/auth";

export const getRecipientEmail = (
    conversationUsers: Conversation['users'],
    user?: User | null
) => conversationUsers.find(userEmail => userEmail !== user?.email)