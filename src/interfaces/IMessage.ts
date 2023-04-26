export default interface IMessage {
    id: string;
    text: string;
    createdAt: Date;
    sentBy: 'gpt' | 'user';
    error?: boolean;
};