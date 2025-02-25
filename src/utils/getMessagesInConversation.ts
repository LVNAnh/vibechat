import { db } from "@/config/firebase";
import { IMessage } from "@/types";
import { collection, DocumentData, orderBy, query, QueryDocumentSnapshot, Timestamp, where } from "firebase/firestore";
import moment from "moment";

export const generateQueryMessages = (conversationId?: string) => 
    query(
        collection(db,'messages'), 
        where('conversation_id','==',conversationId), 
        orderBy('sent_at','asc')
    )

export const transformMessage = (
    message: QueryDocumentSnapshot<DocumentData>
) => ({
        id: message.id,
        ...message.data(), //spread out conversation_id, text, sent_at, user
        sent_at: message.data().sent_at
            ? convertFirestoreTimeStampToString((message.data().sent_at as Timestamp))
            : null
    }) as IMessage 


export const convertFirestoreTimeStampToString = (timestamp: Timestamp): string => {
    return moment(timestamp.toDate()).format("DD-MM-YYYY hh:mm:ss A");
};
      