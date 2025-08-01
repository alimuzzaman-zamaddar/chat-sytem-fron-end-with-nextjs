"use client";

import { FaImage } from "react-icons/fa";
import avater from "../../Assets/avater.png";
import { Key, useRef, useState } from "react";
import { CiFaceSmile } from "react-icons/ci";
import EmojiPicker from "emoji-picker-react";
import { MdOutlineKeyboardVoice, MdRecordVoiceOver } from "react-icons/md";

// Example Data for Users and Messages
const users = [
  {
    id: 1,
    name: "Michael Smith",
    status: "online",
    messages: [
      {
        sender: "you",
        receiver: "Michael Smith",
        messageType: "text",
        content: "Do you have any recommendations for winter tires?",
      },
      {
        sender: "Michael Smith",
        receiver: "you",
        messageType: "text",
        content: "Yes, I would recommend Michelin or Bridgestone.",
      },
      {
        sender: "you",
        receiver: "Michael Smith",
        messageType: "emoji",
        content: "😊",
      },
      {
        sender: "Michael Smith",
        receiver: "you",
        messageType: "text",
        content: "That sounds great! I’ll check them out.",
      },
    ],
    time: "10:35 AM",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    status: "offline",
    messages: [
      {
        sender: "you",
        receiver: "Sarah Johnson",
        messageType: "text",
        content: "Are you available for a quick meeting tomorrow?",
      },
      {
        sender: "Sarah Johnson",
        receiver: "you",
        messageType: "text",
        content: "I’ll be free after 3 PM.",
      },
      {
        sender: "you",
        receiver: "Sarah Johnson",
        messageType: "image",
        content: "https://example.com/meeting_image.jpg",
      },
      {
        sender: "Sarah Johnson",
        receiver: "you",
        messageType: "text",
        content: "Looking forward to it!",
      },
    ],
    time: "Yesterday",
  },
  {
    id: 3,
    name: "David Wilson",
    status: "online",
    messages: [
      {
        sender: "you",
        receiver: "David Wilson",
        messageType: "text",
        content: "Can you send me the latest report?",
      },
      {
        sender: "David Wilson",
        receiver: "you",
        messageType: "text",
        content: "Sure, sending it over now!",
      },
      {
        sender: "you",
        receiver: "David Wilson",
        messageType: "emoji",
        content: "👍",
      },
      {
        sender: "David Wilson",
        receiver: "you",
        messageType: "text",
        content: "Done! Check your email.",
      },
    ],
    time: "Today",
  },
  {
    id: 4,
    name: "Jessica Taylor",
    status: "offline",
    messages: [
      {
        sender: "you",
        receiver: "Jessica Taylor",
        messageType: "text",
        content: "The meetup is scheduled for next week. Are you attending?",
      },
      {
        sender: "Jessica Taylor",
        receiver: "you",
        messageType: "text",
        content: "Yes, I’ll be there! Looking forward to it.",
      },
      {
        sender: "you",
        receiver: "Jessica Taylor",
        messageType: "image",
        content: "https://example.com/meetup_image.jpg",
      },
      {
        sender: "Jessica Taylor",
        receiver: "you",
        messageType: "text",
        content: "The picture looks great! I’m excited.",
      },
    ],
    time: "Monday",
  },
  {
    id: 5,
    name: "Robert Miller",
    status: "online",
    messages: [
      {
        sender: "you",
        receiver: "Robert Miller",
        messageType: "text",
        content: "I’m looking forward to our collaboration next month.",
      },
      {
        sender: "Robert Miller",
        receiver: "you",
        messageType: "text",
        content: "Me too! It’s going to be exciting.",
      },
      {
        sender: "you",
        receiver: "Robert Miller",
        messageType: "emoji",
        content: "🤝",
      },
      {
        sender: "Robert Miller",
        receiver: "you",
        messageType: "text",
        content: "Absolutely! Let’s do this!",
      },
    ],
    time: "05/10",
  },
];
const Page = () => {
  const [message, setMessage] = useState<string>(""); // Text message stategi
  const [file, setFile] = useState<any>(null); // To hold file/image
  const [audioBlob, setAudioBlob] = useState<any>(null); // To hold the audio blob
  const [audioUrl, setAudioUrl] = useState<string>(""); // To store the audio URL for playback
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false); // Show emoji picker state
  const [selectedUser, setSelectedUser] = useState<any>(null); // State to store the selected user
  const [isRecording, setIsRecording] = useState<boolean>(false); // To track if recording is in progress

  const audioRecorder = useRef<MediaRecorder | null>(null); // Audio recorder reference
  const audioChunks = useRef<any>([]); // To store the audio chunks

  // Handle selecting a user
  const selectUser = (user: any) => {
    setSelectedUser(user);
  };

const handleEmojiClick = (emojiData: any) => {
  setMessage(prev => prev + emojiData.emoji);
  setShowEmojiPicker(false);
};

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile); // Set the selected file
    if (selectedFile) {
      setMessage(selectedFile.name); // Set the file name as the message content
    }
  };

  // Trigger file input when FaImage is clicked
  const triggerFileInput = () => {
    document.getElementById("fileInput")?.click(); // Trigger file input click
  };

  // Start recording audio
  const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioRecorder.current = new MediaRecorder(stream);

      audioRecorder.current.ondataavailable = event => {
        audioChunks.current.push(event.data);
      };

      audioRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        setAudioBlob(audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        audioChunks.current = []; // Clear the chunks
      };

      audioRecorder.current.start();
      setIsRecording(true);
    }
  };

  // Stop recording audio
  const stopRecording = () => {
    if (audioRecorder.current) {
      audioRecorder.current.stop();
      setIsRecording(false);
    }
  };

  // Handle sending a message
  const sendMessage = () => {
    if (selectedUser) {
      const updatedUser = {
        ...selectedUser,
        messages: [
          ...selectedUser.messages,
          {
            sender: "you", // Always sender's message
            receiver: selectedUser.name,
            messageType: file
              ? "file"
              : audioUrl
              ? "audio"
              : message
              ? "text"
              : "emoji", // Check if there's a file or emoji or audio
            content: file
              ? URL.createObjectURL(file)
              : audioUrl
              ? audioUrl
              : message, // If file, set file URL, else set audio URL or message
          },
        ],
      };
      setSelectedUser(updatedUser); // Update the selected user with the new message
    }
    setMessage(""); // Clear the input field after sending
    setFile(null); // Clear the file state after sending the message
    setAudioUrl(""); // Clear the audio URL after sending the message
  };

  // Function to render the appropriate message type (Text, Image, File, Emoji, Audio)
  const renderMessage = (message: any) => {
    switch (message.messageType) {
      case "text":
        return <p>{message.content}</p>;
      case "emoji":
        return <span>{message.content}</span>;
      case "file":
        return (
          <div>
            <img
              src={message.content}
              alt="file"
              className="max-w-[250px] rounded-md"
            />
          </div>
        );
      case "audio":
        return (
          <audio controls>
            <source src={message.content} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        );
      default:
        return <p>Unknown message type</p>;
    }
  };

  return (
    <div className="min-h-[80vh] flex bg-gray-50 m-6 rounded-lg border border-gray-200">
      {/* Sidebar */}
      <div className="bg-white w-1/4 p-4  border-r border-r-gray-200">
        <h2 className="text-lg font-semibold">Messages</h2>
        <div className="mt-4 ">
          {users.map(user => (
            <div
              key={user.id}
              className="flex justify-between items-center p-4 border-b border-b-gray-200 hover:bg-[#F9FAFB] duration-300 cursor-pointer"
              onClick={() => selectUser(user)} // Select the user on click
            >
              <div className="flex items-center gap-5 ">
                <div className="relative w-15 h-15 rounded-full">
                  <img
                    src={avater.src}
                    alt="Profile image"
                    width={60}
                    height={60}
                    className="rounded-full "
                  />
                  <div
                    className={` absolute right-0 bottom-0 w-3 h-3 ml-2 rounded-xl ${
                      user.status === "online" ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></div>
                </div>
                <div className="">
                  <p className="text-sm font-medium mb-3">{user.name}</p>
                  <p className="text-xs text-gray-600">
                    {user.messages[0].content.split(" ").slice(0, 3).join(" ")}
                    ...
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-500">{user.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="bg-white w-3/4 p-6 border-r border-r-gray-200 ">
        {selectedUser ? (
          <div className="mb-4 w-full max-h-[800px] overflow-y-auto relative flex flex-col justify-self-start">
            <div className="flex justify-between items-center p-4 border-b border-b-gray-200">
              <div className="flex items-center">
                <img
                  src={avater.src}
                  alt="Profile image"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="ml-2 text-sm font-medium">
                  {selectedUser.name}
                </span>
              </div>
              <div className="text-xs text-gray-500">{selectedUser.time}</div>
            </div>

            {/* Chat Messages */}
            <div className="h-full flex flex-col overflow-auto space-y-4 my-5">
              {selectedUser.messages.map(
                (msg: { sender: string }, index: Key | null | undefined) => {
                  const isSender = msg.sender === "you"; // Check if it's the sender's message
                  return (
                    <div
                      key={index}
                      className={`flex ${
                        isSender ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-1/2 p-3 rounded-xl ${
                          isSender ? "bg-[#051345] text-white" : "bg-gray-100"
                        }`}
                      >
                        <div className="font-medium">
                          {isSender ? "You" : selectedUser.name}
                        </div>
                        {renderMessage(msg)}
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {/* Message Input */}
            <div className="flex items-center p-2 border-t border-t-gray-200 gap-3">
              {/* Image Input */}
              <input
                type="file"
                id="fileInput"
                style={{ display: "none" }} // Hide the input field
                onChange={handleFileSelect}
              />
              {/* Image icon as the clickable button */}
              <div className="cursor-pointer" onClick={triggerFileInput}>
                <FaImage />
              </div>

              {/* Emoji picker trigger */}
              <div
                className="cursor-pointer"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <CiFaceSmile />
              </div>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-10">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}

              {/* Audio Recording Controls */}
              <div className="flex items-center">
                {isRecording ? (
                  <button onClick={stopRecording}>
                    <MdRecordVoiceOver />
                  </button>
                ) : (
                  <button onClick={startRecording}>
                    <MdOutlineKeyboardVoice />
                  </button>
                )}
              </div>

{/* Text Message Input */}
<input
  type="text"
  value={message}
  onChange={(e) => setMessage(e.target.value)} // Handle text input
  onKeyDown={(e) => {
    if (e.key === "Enter") sendMessage();
  }}
  placeholder="Type a message..."
  className="flex-1 p-2 rounded-md border border-gray-300"
/>

              <button
                onClick={sendMessage}
                className="ml-2 p-2 rounded-lg bg-[#051345] text-white"
              >
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            Select a user to start the conversation
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;