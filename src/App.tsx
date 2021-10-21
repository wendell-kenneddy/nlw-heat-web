import { useContext } from 'react';
import { LoginBox } from './components/LoginBox';
import { MessagesList } from './components/MessagesList';
import { SendMessageForm } from './components/SendMessageForm';
import { AuthContext } from './contexts/auth';
import styles from './styles/App.module.scss';

export function App() {
  const { user } = useContext(AuthContext);

  return (
    <main className={`${styles.contentWrapper} ${!!user ? styles.contentSigned : ''}`}>
      <MessagesList />
      {!!user ? <SendMessageForm /> : <LoginBox />}
    </main>
  );
}
