"use client"

import styled from "styled-components"
import Sidebar from "../../../../components/Sidebar"
import { useEffect, useState } from "react"
import { doc, getDoc, getDocs } from "firebase/firestore"
import { auth, db } from "@/config/firebase"
import { Conversation, IMessage } from "@/types"
import { getRecipientEmail } from "@/utils/getRecipientEmail"
import { useAuthState } from "react-firebase-hooks/auth"
import { useParams } from "next/navigation"
import { generateQueryMessages, transformMessage } from "@/utils/getMessagesInConversation"
import ConversationScreen from "../../../../components/ConversationScreen"

const StyledContainer = styled.div`
    display: flex;
`
const StyledConversationContainer= styled.div`
    flex-grow: 1;
    overflow: scroll;
    height: 100vh;
    /* Hide scrollbar for Chrome, Safari and Opera */
	::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* Firefox */
`

const useDocumentTitle = (title: string) => {
  useEffect(() => {
    document.title = title;
    return () => {
      document.title = "VibeChat"; // Reset lại title khi component unmount
    };
  }, [title]);
};

const ConversationView = () => {
    const [user] = useAuthState(auth)
    const [conversation, setConversation] = useState<Conversation | null>(null)
    const [ messages, setMessages] = useState<IMessage[] | null>(null)
    const [loading, setLoading] = useState(true)
    const params = useParams<{ id: string }>()
    
    useEffect(() => {
        const getConversation = async () => {
            setLoading(true)
            try {
                const conversationId = params.id
                if (!conversationId) return
                
                // get conversation, to know who we are chatting with 
                const conversationRef = doc(db, 'conversations', conversationId as string)
                const conversationSnapshot = await getDoc(conversationRef)
                
                const queryMessages = generateQueryMessages(conversationId)
     
                const messagesSnapshot = await getDocs(queryMessages)

                setMessages(messagesSnapshot.docs.map(messageDoc => transformMessage(messageDoc)))
           
                if (conversationSnapshot.exists()) {
                    setConversation(conversationSnapshot.data() as Conversation)
                }
            } catch (error) {
                console.error('Error fetching conversation:', error)
            } finally {
                setLoading(false)
            }
        }
        
        getConversation()
    }, [params.id])
    
    // Sử dụng hook để cập nhật title nếu conversation đã tải xong
    const recipientEmail = conversation ? getRecipientEmail(conversation.users, user) : '';
    useDocumentTitle(recipientEmail ? `${recipientEmail}` : '');
    
    if (loading) return <div>Loading...</div>
    if (!conversation) return <div>Conversation not found</div>
    
    return (
        <StyledContainer>
            <Sidebar />

            <StyledConversationContainer>
                <ConversationScreen conversation={conversation} messages={messages || []} />
            </StyledConversationContainer>
        </StyledContainer>
    )
}

export default ConversationView