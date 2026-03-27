import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithUsername, signUpWithUsername } = useAuth();
  const [loading, setLoading] = useState(false);

  const loginForm = useForm<LoginForm>({
    defaultValues: { username: '', password: '' },
  });

  const signupForm = useForm<LoginForm>({
    defaultValues: { username: '', password: '' },
  });

  const from = (location.state as { from?: string })?.from || '/';

  const handleLogin = async (data: LoginForm) => {
    setLoading(true);
    const { error } = await signInWithUsername(data.username, data.password);

    if (error) {
      toast.error(error.message || 'Login failed');
    } else {
      toast.success('Logged in successfully');
      navigate(from, { replace: true });
    }
    setLoading(false);
  };

  const handleSignup = async (data: LoginForm) => {
    // Validate username format
    if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
      signupForm.setError('username', {
        message: 'Username can only contain letters, numbers, and underscores',
      });
      return;
    }

    setLoading(true);
    const { error } = await signUpWithUsername(data.username, data.password);

    if (error) {
      toast.error(error.message || 'Signup failed');
    } else {
      toast.success('Account created successfully! You can now log in.');
      // Auto-login after signup
      const { error: loginError } = await signInWithUsername(data.username, data.password);
      if (!loginError) {
        navigate(from, { replace: true });
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background py-12">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to Gaytri Restaurant</CardTitle>
            <CardDescription>Sign in to access admin features</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      rules={{ required: 'Username is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      rules={{ required: 'Password is required' }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Logging in...' : 'Login'}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="signup">
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                    <FormField
                      control={signupForm.control}
                      name="username"
                      rules={{
                        required: 'Username is required',
                        pattern: {
                          value: /^[a-zA-Z0-9_]+$/,
                          message: 'Only letters, numbers, and underscores allowed',
                        },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Choose a username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="password"
                      rules={{
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' },
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Choose a password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Creating account...' : 'Sign Up'}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
