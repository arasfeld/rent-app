'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, CircleAlert } from 'lucide-react';

import { useAuth } from '@/lib/hooks';
import { Alert, AlertDescription } from '@repo/ui/components/alert';
import { Button } from '@repo/ui/components/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@repo/ui/components/field';
import { Input } from '@repo/ui/components/input';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <Building2 className="size-8 text-primary" />
                <h1 className="text-xl font-bold">Create your account</h1>
                <FieldDescription>
                  Start managing your rental properties today
                </FieldDescription>
              </div>

              {error && (
                <Alert variant="destructive">
                  <CircleAlert />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="firstName">First name</FieldLabel>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="At least 8 characters"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirm password
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
              </Field>
            </FieldGroup>
          </form>

          <FieldDescription className="text-center">
            Already have an account? <Link href="/login">Sign in</Link>
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}
