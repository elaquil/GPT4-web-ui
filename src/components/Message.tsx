import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import "./Message.css";
import IMessage from "../interfaces/IMessage";
import remarkGemoji from "remark-gemoji";

interface MessageProps {
    message: IMessage;
}

export default function Message({message}: MessageProps) {
    return (
        <div className="container-fluid mt-4 mb-4" style={{display: "flow-root"}} id={message.id}>
            
            <img
                className="avatar rounded-2 float-start mr-1"
                height={"50px"}
                src={message.sentBy === 'gpt' ? "src/assets/chatgpt.jpeg" : "src/assets/user.jpeg"}
            />

            <div className={`card ${message.sentBy == "gpt" ? "bg-dark" : "bg-dark2"} ${message.error ? "error" : ""} border-white border-opacity-50 border-3 m-1 p-1 text-start text-light`}>
                <ReactMarkdown
                    children={message.text}
                    components={{
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(
                                className || ""
                            );
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    children={String(children).replace(
                                        /\n$/,
                                        ""
                                    )}
                                    language={match[1]}
                                    {...props}
                                    style={tomorrow}
                                />
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            );
                        },
                    }}
                    remarkPlugins={[remarkGfm, remarkGemoji]}
                />
            </div>
        </div>
    );
}
