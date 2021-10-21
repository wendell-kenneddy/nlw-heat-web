import { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from '../services/api';

interface IAuthProvider {
  children: ReactNode;
}

interface IUser {
  name: string;
  id: string;
  login: string;
  avatar_url: string;
}

interface IAuthContextData {
  signInUrl: string;
  user: IUser | null;
  signOut: () => void;
}

interface IAuthResponse {
  jwt: string;
  user: IUser;
}

export const AuthContext = createContext({} as IAuthContextData);

export function AuthProvider(props: IAuthProvider) {
  const [user, setUser] = useState<IUser | null>(null);

  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=752221ce70eb7e2f7231`;

  const signIn = async (githubCode: string) => {
    const response = await api.post<IAuthResponse>('/auth', {
      code: githubCode
    });

    const { jwt, user } = response.data;
    localStorage.setItem('@dowhile:token', jwt);

    api.defaults.headers.common.authorization = `Bearer ${jwt}`;

    setUser(user);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('@dowhile:token');
  };

  useEffect(() => {
    const token = localStorage.getItem('@dowhile:token');

    if (token) {
      api.defaults.headers.common.authorization = `Bearer ${token}`;

      const user = api.get<IUser>('profile').then(res => setUser(res.data));
    }
  }, []);

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=');

    if (hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=');

      window.history.pushState({}, '', urlWithoutCode);
      signIn(githubCode);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInUrl,
        user,
        signOut
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
