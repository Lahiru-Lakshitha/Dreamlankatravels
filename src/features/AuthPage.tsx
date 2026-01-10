"use client";

import { useState, useEffect } from 'react';
import { login, signup } from '@/app/auth/actions';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-sigiriya.jpg';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = loginSchema.extend({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false); // New success state
  const router = useRouter();
  const { user, refreshSession } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router, router.push]);

  // Separate forms with defaultValues to reset correctly
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', fullName: '', confirmPassword: '' }
  });

  // Clear forms when switching modes
  useEffect(() => {
    if (isLogin) {
      signupForm.reset();
      setSignupSuccess(false);
    } else {
      loginForm.reset();
    }
    setShowPassword(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin]);

  const handleLogin = async (data: LoginFormData) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);

    try {
      const result = await login(formData);

      if (!result.success) {
        let title = t.auth.loginFailed;
        let desc = result.error || "An error occurred";

        if (desc.includes("Email not confirmed")) {
          desc = "Please check your email to confirm your account before logging in.";
        } else if (desc === 'Invalid login credentials') {
          desc = t.auth.invalidCredentials;
        }

        toast({
          title: title,
          description: desc,
          variant: 'destructive',
        });
      } else {
        await refreshSession(); // Sync client state with server session
        toast({
          title: t.auth.welcomeBack,
          description: t.auth.loginSuccess,
        });
        router.push('/dashboard');
      }
    } catch (error) {
      toast({
        title: t.auth.loginFailed,
        description: "An unexpected error occurred",
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('name', data.fullName);

    try {
      const result = await signup(formData);

      if (!result.success) {
        let message = result.error;
        if (message && message.includes('already registered')) {
          message = t.auth.emailExists;
        }
        toast({
          title: t.auth.signupFailed,
          description: message,
          variant: 'destructive',
        });
      } else {
        setSignupSuccess(true);
        signupForm.reset();
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link.",
        });
        // No redirect here - wait for user to confirm email
      }
    } catch (error) {
      toast({
        title: t.auth.signupFailed,
        description: "An unexpected error occurred",
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src={heroImage}
          alt="Sri Lanka landscape"
          fill
          className="object-cover"
          placeholder="blur"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-dark/80 to-ocean-dark/40 flex items-center justify-center">
          <div className="text-center text-sand p-8 max-w-md">
            <h2 className="font-serif text-4xl font-bold mb-4">
              {t.auth.discoverSriLanka}
            </h2>
            <p className="text-sand/80 text-lg">
              {t.auth.authBenefits}
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {signupSuccess ? (
            <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-500" />
              </div>
              <h2 className="font-serif text-3xl font-bold mb-4">Check your email</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                We&apos;ve sent a confirmation link to <span className="font-medium text-foreground">{signupForm.getValues('email')}</span>.
                Please verify your email to access your account.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSignupSuccess(false);
                  setIsLogin(true); // Switch to login so they can sign in after confirming
                }}
              >
                Back to Sign In
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                  {isLogin ? t.auth.welcomeBack : t.auth.createAccount}
                </h1>
                <p className="text-muted-foreground">
                  {isLogin
                    ? t.auth.signInToAccess
                    : t.auth.joinForExperiences}
                </p>
              </div>

              {/* 
                CRITICAL FIX: distinct 'key' property causes React to completely replace the form 
                DOM tree when switching modes used by password managers to detect context.
                Also distinct ids for inputs.
              */}
              {isLogin ? (
                <form key="login-form" onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">{t.auth.email}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        autoComplete="username"
                        {...loginForm.register('email')}
                      />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-destructive text-sm">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">{t.auth.password}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        autoComplete="current-password"
                        {...loginForm.register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-destructive text-sm">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <Link href="/auth/forgot-password" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      Forgot password?
                    </Link>
                  </div>

                  <Button type="submit" variant="ocean" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        {t.auth.signingIn}
                      </>
                    ) : (
                      t.auth.signIn
                    )}
                  </Button>
                </form>
              ) : (
                <form key="signup-form" onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">{t.auth.fullName}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        placeholder="John Doe"
                        className="pl-10"
                        autoComplete="name"
                        {...signupForm.register('fullName')}
                      />
                    </div>
                    {signupForm.formState.errors.fullName && (
                      <p className="text-destructive text-sm">{signupForm.formState.errors.fullName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t.auth.email}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        autoComplete="email"
                        {...signupForm.register('email')}
                      />
                    </div>
                    {signupForm.formState.errors.email && (
                      <p className="text-destructive text-sm">{signupForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{t.auth.password}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        autoComplete="new-password"
                        {...signupForm.register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {signupForm.formState.errors.password && (
                      <p className="text-destructive text-sm">{signupForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">{t.auth.confirmPassword}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="signup-confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-10"
                        autoComplete="new-password"
                        {...signupForm.register('confirmPassword')}
                      />
                    </div>
                    {signupForm.formState.errors.confirmPassword && (
                      <p className="text-destructive text-sm">{signupForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button type="submit" variant="ocean" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        {t.auth.creatingAccount}
                      </>
                    ) : (
                      t.auth.createAccountBtn
                    )}
                  </Button>
                </form>
              )}

              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  {isLogin ? t.auth.noAccount : t.auth.haveAccount}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-sunset hover:underline font-medium"
                  >
                    {isLogin ? t.auth.signUpLink : t.auth.signInLink}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
