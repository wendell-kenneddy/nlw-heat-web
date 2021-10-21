import styles from './styles.module.scss';
import logo from '../../assets/logo.svg';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import io from 'socket.io-client';

interface IMessage {
  text: string;
  id: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const messageQueue: IMessage[] = [];

const socket = io('http://localhost:4000');
socket.on('new_message', (message: IMessage) => messageQueue.push(message));

export function MessagesList() {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    api.get<IMessage[]>('/messages/last_three').then(res => setMessages(res.data));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (messageQueue.length > 0) {
        setMessages(prevState => [messageQueue[0], prevState[0], prevState[1]].filter(Boolean));

        messageQueue.shift();
      }
    }, 3000);
  }, []);

  return (
    <div className={styles.messageListWrapper}>
      <img src={logo} alt="Logo DoWhile 2021" />

      <ul className={styles.messageList}>
        {messages.map(message => {
          return (
            <li className={styles.message} key={message.id}>
              <p className={styles.messageContent}>{message.text}</p>

              <div className={styles.messageUser}>
                <div className={styles.userImage}>
                  <img src={message.user.avatar_url} alt={message.user.name} />
                </div>

                <span>{message.user.name}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
