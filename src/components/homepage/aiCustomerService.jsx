import { useState, useRef, useEffect } from "react";

import { usePostAiMessageMutation } from "@/features/aiCustomerService/aiCustomerServiceApi";

function AiCustomerService() {
  const bottomRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [conversation, setConversation] = useState([]);
  const [postAiMessage, { isLoading, isError, error }] = usePostAiMessageMutation();
  const APP_BASE = import.meta.env.VITE_APP_BASE;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, isLoading]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!message.trim()) return;

    setMessage(""); // 送出後立即清空輸入
    setConversation(prev => [...prev, { type: "user", text: message }]);

    try {
      const result = await postAiMessage(message).unwrap();
      setResponse(result.response);
      setConversation(prev => [...prev, { type: "ai", text: result.response }]);
    } catch (err) {
      setResponse("客服暫時無法回覆，請稍後再試。");
    }
  };

  return (
    <>
      <button className="ai-fab" onClick={toggleChat}>
        <img src={`${APP_BASE}aiCustomerService.png`} alt="" />
      </button>
      {isOpen && (
        <div className="ai-chatbox">
          <div className="ai-chat-header">
            <strong>拾光堂 小幫手</strong>
            <button className="btn-close" onClick={toggleChat}></button>
          </div>
          <div className="ai-chat-body">
            <p className="system-msg">
              您好，我是 拾光堂 小幫手，
              <br />
              有什麼可以幫忙的嗎？
            </p>
            {conversation.map((msg, index) => (
              <p key={index} className={msg.type === "user" ? "user-msg" : "ai-response"}>
                {msg.text}
              </p>
            ))}
            <div ref={bottomRef} />
            {isLoading && (
              <p className="ai-typing">
                正在輸入中<span className="dot">.</span>
                <span className="dot">.</span>
                <span className="dot">.</span>
              </p>
            )}
            {isError && (
              <p className="ai-response">
                {error?.status === 401
                  ? "請先登入才能使用客服功能。"
                  : error?.data?.message === "請勿輸入不當內容"
                    ? "我們無法回覆含有不當內容的訊息，請重新輸入。"
                    : error?.data?.message === "訊息過長，請在 75 個字以內"
                      ? "訊息太長囉！請用更簡短的文字再試一次。"
                      : error?.data?.message || error?.error || "客服暫時無法回覆，請稍後再試。"}
              </p>
            )}
          </div>
          <form className="ai-chat-footer" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="請輸入訊息..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              送出
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default AiCustomerService;
