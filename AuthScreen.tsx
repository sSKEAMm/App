
import React from 'react';
import { AuthUser, AuthProvider } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (user: AuthUser) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {

  // Simulate login
  const handleLogin = (provider: AuthProvider) => {
    const simulatedUser: AuthUser = {
      uid: `${provider}-${Date.now()}`,
      displayName: provider === 'google' ? 'Google User' : 'Apple User',
      email: `${provider}user@example.com`,
      provider: provider,
    };
    onLoginSuccess(simulatedUser);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 space-y-8 bg-gradient-to-br from-green-400 to-blue-500 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-lg opacity-90">Sign in to continue your culinary journey.</p>
      </div>
      
      <div className="w-full max-w-xs space-y-4">
        <button
          onClick={() => handleLogin('google')}
          className="w-full flex items-center justify-center bg-white text-gray-700 font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-gray-100 transition duration-150 ease-in-out"
          aria-label="Sign in with Google"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6 mr-3" />
          Sign in with Google
        </button>
        <button
          onClick={() => handleLogin('apple')}
          className="w-full flex items-center justify-center bg-black text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-gray-800 transition duration-150 ease-in-out"
          aria-label="Sign in with Apple"
        >
          <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.021 6.407c.059-.004.117-.01.176-.01.383 0 .619.141.876.435.224.258.375.594.375.989 0 .041-.003.082-.008.123-.098.81-.502 1.488-1.049 1.942-.564.48-.993.712-1.581.712-.047 0-.095-.003-.142-.007-.367-.03-.637-.171-.876-.435-.239-.279-.38-.619-.38-.976 0-.061.004-.122.012-.182.083-.787.495-1.488 1.05-1.956.49-.414.93-.616 1.522-.616zm2.345-2.616c-.007-.066-.022-.132-.03-.198-.316-1.083-1.066-1.782-1.906-1.782-.261 0-.528.062-.79.182-.454.21-.869.58-1.216 1.056-.37.518-.654 1.159-.654 1.912 0 .065.003.13.01.195.316 1.083 1.065 1.782 1.906 1.782.148 0 .296-.02.441-.059.57-.153 1.025-.515 1.341-.937.319-.425.53-.94.53-1.536 0-.306-.062-.605-.182-.897zM10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm4.072 14.398c-.203.042-.409.062-.616.062-.668 0-1.11-.274-1.571-.813-.448-.526-.788-1.267-.788-2.227 0-.085.007-.17.014-.255.086-1.01.597-1.802 1.258-2.29.626-.46 1.246-.616 1.996-.616.148 0 .297.013.442.039.11.02.21.042.316.066.085.02.163.042.246.062l.028.014c.246.079.479.163.687.252v.733c-.223-.082-.455-.166-.7-.255-.062-.02-.122-.039-.182-.058-.152-.042-.31-.062-.472-.062-.794 0-1.29.357-1.637.89-.346.533-.515 1.26-.515 2.185 0 .055.003.11.007.163.03.882.425 1.63.993 2.068.515.394 1.004.515 1.63.515.223 0 .438-.03.645-.086l.007-.003c.115-.03.223-.062.33-.099v.747c-.203.042-.409.062-.616.062z" fillRule="evenodd" clipRule="evenodd"></path></svg>
          Sign in with Apple
        </button>
      </div>
      <p className="text-xs text-center opacity-70">By signing in, you agree to our Terms of Service and Privacy Policy.</p>
    </div>
  );
};

export default AuthScreen;
