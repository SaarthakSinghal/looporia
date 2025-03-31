
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLocation } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signIn, signUp } = useAuth();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        if (!username.trim()) {
          throw new Error('Username is required');
        }
        await signUp(email, password, username);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 crt-overlay flex flex-col">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-pixel text-retro-brown-3 mb-4">
          RETRO RHYTHM REVAMP
        </h1>
        <p className="font-retro text-xl md:text-2xl text-retro-brown-2 max-w-2xl mx-auto">
          {isLogin ? 'Login to your account' : 'Create a new account'}
          <span className="animate-blink inline-block ml-1">|</span>
        </p>
      </div>

      <div className="max-w-md w-full mx-auto mt-8 bg-retro-beige retro-border p-6 font-retro">
        <div className="flex mb-6">
          <button 
            className={`flex-1 py-2 ${isLogin ? 'bg-retro-tan-2 text-retro-brown-3' : 'bg-retro-beige text-retro-brown-2'}`}
            onClick={() => setIsLogin(true)}
          >
            LOGIN
          </button>
          <button 
            className={`flex-1 py-2 ${!isLogin ? 'bg-retro-tan-2 text-retro-brown-3' : 'bg-retro-beige text-retro-brown-2'}`}
            onClick={() => setIsLogin(false)}
          >
            SIGN UP
          </button>
        </div>

        {error && (
          <Alert className="mb-4 bg-retro-burgundy text-retro-beige border-0">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-lg text-retro-brown-3">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-retro-paper border-retro-brown-2 text-retro-brown-3 font-retro"
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="username" className="text-lg text-retro-brown-3">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-retro-paper border-retro-brown-2 text-retro-brown-3 font-retro"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password" className="text-lg text-retro-brown-3">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-retro-paper border-retro-brown-2 text-retro-brown-3 font-retro"
              minLength={6}
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="retro-btn w-full mt-6 text-xl"
          >
            {loading ? 'PROCESSING...' : isLogin ? 'LOGIN' : 'SIGN UP'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
