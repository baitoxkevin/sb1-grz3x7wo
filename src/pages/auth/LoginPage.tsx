import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';
// Add global styles
import '../../index.css';

export function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  // Using sonner toast directly

  useEffect(() => {
    document.title = 'Login - BaitoAI';
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');
    
    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Attempting login with:', { email });
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      console.log('Auth response:', data);

      if (error) {
        console.error('Auth error:', error);
        toast.error(error.message || "Access denied");
        setIsLoading(false);
        return;
      }

      if (!data?.user || !data?.session) {
        console.error('No user data returned');
        toast.error("Access denied");
        setIsLoading(false);
        return;
      }

      localStorage.setItem('user', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        session: data.session
      }));

      await supabase.auth.setSession(data.session);
      
      console.log('Login successful, redirecting to dashboard...');
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <Card className="w-[400px] shadow-lg border-border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-foreground">Welcome to BaitoAI</CardTitle>
          <CardDescription className="text-muted-foreground">
            Internal access only - Please sign in with your credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "w-full bg-background text-foreground",
                  !email && "border-destructive"
                )}
                required
                data-devinid="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  "w-full bg-background text-foreground",
                  !password && "border-destructive"
                )}
                required
                data-devinid="2"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-black text-white py-2 rounded-md hover:bg-black/90 transition-colors"
              disabled={isLoading || !email || !password}
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e as any);
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
