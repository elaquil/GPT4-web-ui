import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import "./FooterComponent.css";
import { useState } from "react";
import ContentEditable from "react-contenteditable";

interface FooterComponentProps {
    sendMessageCallBack(text: string): void;
    isDisabled: boolean;
}

export default function FooterComponent({
    sendMessageCallBack, isDisabled
}: FooterComponentProps) {
    const [innerText, setInnerText] = useState("");

    const handleSend = () => {
        sendMessageCallBack(innerText);
        setInnerText(""); // clear the innerText state after sending
    };

    const handleKeyPress = (
        event: React.KeyboardEvent<HTMLDivElement>
    ): void => {
        const currentText = event.currentTarget.innerText;
        setInnerText(currentText);
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (currentText.length > 0) {
                sendMessageCallBack(currentText);
                setInnerText("");
            }
        }
        else if (event.key === "Enter" && event.shiftKey) {
            console.log("Shift + Enter");
            event.preventDefault();
            setInnerText(currentText + "\n");
        };
    };

    return (
        <div className="navbar fixed-bottom bg-secondary text-light p-4">
            <div className="input-group">
                <ContentEditable
                    html={innerText}
                    className={`form-control border-light text-start ${isDisabled ? 'disabled' : ''}`}
                    onChange={(event) => {
                        setInnerText(event.currentTarget.innerText);
                    }}
                    onKeyPress={(event) => handleKeyPress(event)}
                    disabled={isDisabled}
                ></ContentEditable>
                <button
                    className="btn btn-outline-light"
                    type="button"
                    id="button-addon2"
                    onClick={() => {
                        if (innerText.length > 0) {
                            handleSend();
                        }
                    }}
                    disabled={isDisabled}
                >
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>
        </div>
    );
}
