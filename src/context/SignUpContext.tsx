import { createContext, useContext, useState, ReactNode } from "react";

interface SignUpContextType {
  isSignUpOpen: boolean;
  openSignUp: () => void;
  closeSignUp: () => void;
}

const SignUpContext = createContext<SignUpContextType>({
  isSignUpOpen: false,
  openSignUp: () => {},
  closeSignUp: () => {},
});

export function SignUpProvider({ children }: { children: ReactNode }) {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  return (
    <SignUpContext.Provider
      value={{
        isSignUpOpen,
        openSignUp: () => setIsSignUpOpen(true),
        closeSignUp: () => setIsSignUpOpen(false),
      }}
    >
      {children}
    </SignUpContext.Provider>
  );
}

export const useSignUp = () => useContext(SignUpContext);
