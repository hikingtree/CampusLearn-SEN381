import { useEffect, useState } from "react";

export default function ChatbotPage() {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    fetch("/api/chatbot/embed-url")
      .then(r => r.json())
      .then((d) => setUrl(d.url))
      .catch(() => setUrl(""));
  }, []);

  return (
    <div className="p-6 h-full flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">AI Chatbot</h1>
      {!url ? (
        <div className="text-sm text-red-600">
          Chatbot URL not configured. Ask an admin to set <code>CHATBOT_IFRAME_URL</code>.
        </div>
      ) : (
        <div className="flex-1">
          <iframe
            title="CampusLearn AI Chatbot"
            src={url}
            className="w-full h-[75vh] rounded-xl border"
            allow="clipboard-read; clipboard-write; microphone; camera"
            sandbox="allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
          />
        </div>
      )}
      <p className="text-sm text-gray-500">
        Tip: if Power Automate requires sign-in, log in in this tab once and your session should persist.
      </p>
    </div>
  );
}
