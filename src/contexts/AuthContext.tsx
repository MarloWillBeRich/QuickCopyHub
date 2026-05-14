import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  uid: string;
  email: string;
}

export interface UserProfile {
  email: string;
  avatarUrl?: string;
  createdAt: any;
  updatedAt: any;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('qc_user');
    if (storedUser) {
      const u = JSON.parse(storedUser);
      setUser(u);
      setProfile({ email: u.email, createdAt: new Date(), updatedAt: new Date() });
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string) => {
    const u = { uid: 'local_user_1', email };
    localStorage.setItem('qc_user', JSON.stringify(u));
    setUser(u);
    setProfile({ email: u.email, createdAt: new Date(), updatedAt: new Date() });
  };

  const signOut = async () => {
    localStorage.removeItem('qc_user');
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
