import styled from "styled-components";
import Message from "./Message";
import IMessage from "../interfaces/IMessage";
import { Children, useEffect, useRef } from "react";

const ChatContainer = styled.div`
    height: 81%;
    width: 100%;
    overflow-y: auto;
    padding-bottom: 25px;
`;

interface ChatFrameProps {
    messages: IMessage[];
    children?: React.ReactNode;
}

export default function ChatFrame({ messages, children }: ChatFrameProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest",
            });
        }
    }, [messages]);

    return (
        <>
            <ChatContainer className="bg-dark">
                {messages.map((message) => (
                    <Message message={message} key={message.id} />
                ))}
                <div
                    style={{ float: "left", clear: "both" }}
                    ref={messagesEndRef}
                ></div>
            </ChatContainer>
            {children}
        </>
    );
}
