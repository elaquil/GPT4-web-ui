import "./App.css";
import FooterComponent from "./components/FooterComponent";
import HeaderComponent from "./components/HeaderComponent";
import ChatFrame from "./components/ChatFrame";
import IMessage from "./interfaces/IMessage";
import { useEffect, useState } from "react";
import { Configuration, OpenAIApi } from "openai";


const configuration = new Configuration({
    organization: import.meta.env.VITE_OPENAI_ORG,
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function App() {
    // const response = await openai.listModels();
    // console.log(response);
    const [chatHistory, setChatHistory] = useState<string>("");

    const intro = "You are a general purpose chatbot. You can see the previous message history above. Please respong to the query below, keep the context above in mind! Format your response completely neutrally. The prompt is: ";

    const [messages, setMessages] = useState<IMessage[]>([]);

    const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);

    const createUserMessage = (text: string) => {
        setIsInputDisabled(true);
        setMessages((prevState) => [
            ...prevState,
            {
                id: "" + (prevState.length + 1),
                text: text,
                createdAt: new Date(),
                sentBy: "user",
            },
        ]);
        awaitGPTResponse(text)
            .then((response) => {
                if(response)
                    createGPTMessage(response);
                else
                    throw new Error("No response from GPT-3");
            })
            .catch((error) => {
                console.error(error);
                createGPTMessage("An error has occurred, please try again later.", true);
                setIsInputDisabled(false);
            });
    };

    const createGPTMessage = (text: string, error: boolean = false) => {
        setIsInputDisabled(false);
        setMessages((prevState) => [
            ...prevState,
            {
                id: "" + (prevState.length + 1),
                text: text,
                createdAt: new Date(),
                sentBy: "gpt",
                error: error,
            },
        ]);
    };

    const awaitGPTResponse = async (text: string) => {
        const response = await openai.createChatCompletion(
                {
                    model: "gpt-3.5-turbo",
                    messages: [{role: "user", content: chatHistory + intro + "\nUser: "+text}],
                    max_tokens: 3500,
                    temperature: 1,
                    top_p: 1,
                    presence_penalty: 0.5,
                }
            )
        return response.data.choices[0].message?.content;
    };

    useEffect(() => {
        setChatHistory(() => {
            let newChatHistory = "";
            messages.forEach((message) => {
                if (message.sentBy === "user") {
                    newChatHistory += "\nUser: " + message.text;
                } else {
                    newChatHistory += "\nGPT: " + message.text;
                }
            });
            return newChatHistory;
        });
    }, [messages]);

    return (
        <>
            <HeaderComponent></HeaderComponent>
            <ChatFrame messages={messages}></ChatFrame>
            <FooterComponent
                sendMessageCallBack={createUserMessage}
                isDisabled={isInputDisabled}
            ></FooterComponent>
        </>
    );
}

export default App;
