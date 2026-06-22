import { createContext, useContext, useState, ReactNode } from "react";

interface SignUpContextType {
  isSignUpOpen: boolean;
  initialMode: 'signin' | 'signup';
  openSignUp: (mode?: 'signin' | 'signup') => void;
  closeSignUp: () => void;
}

const SignUpContext = createContext<SignUpContextType>({
  isSignUpOpen: false,
  initialMode: 'signup',
  openSignUp: () => {},
  closeSignUp: () => {},
});

export function SignUpProvider({ children }: { children: ReactNode }) {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [initialMode, setInitialMode] = useState<'signin' | 'signup'>('signup');

  return (
    <SignUpContext.Provider
      value={{
        isSignUpOpen,
        initialMode,
        openSignUp: (mode = 'signup') => {
          setInitialMode(mode);
          setIsSignUpOpen(true);
        },
        closeSignUp: () => setIsSignUpOpen(false),
      }}
    >
      {children}
    </SignUpContext.Provider>
  );
}

export const useSignUp = () => useContext(SignUpContext);

