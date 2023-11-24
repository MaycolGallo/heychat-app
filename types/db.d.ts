type User = {
  id: string;
  name: string;
  email: string;
  image: string;
};

type Chat = {
  id: string;
  messages: Message[];
};

type Message = {
  id: string;
  // chatId: string;
  text: string;
  senderId: string;
  receiverId: string;
  timestamp: number;
};

type Requests = {
  senderId: string;
  senderEmail: string;
  senderImage: string;
  senderName: string;
};

type ExtendedMessage = Message & {
  senderEmail: string;
  senderName: string;
  senderImage?: string;
}