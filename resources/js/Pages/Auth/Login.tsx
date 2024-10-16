// import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';

type LoginProps = {
  status?: string;
  canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: LoginProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  useEffect(() => {
    console.log({ d: data.remember });
  }, [data]);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <GuestLayout>
      <Head title="Log in" />

      {status && (
        <div className="mb-4 text-sm font-medium text-green-600">{status}</div>
      )}

      <form onSubmit={submit}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={data.email}
            className="mt-1 block w-full"
            autoFocus
            onChange={(e) => setData('email', e.target.value)}
          />
          {errors.email && (
            <Label variant="destructive" className="mt-2">
              {errors.email}
            </Label>
          )}
        </div>

        <div className="mt-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="mt-1 block w-full"
            onChange={(e) => setData('password', e.target.value)}
          />
          {errors.password && (
            <Label variant="destructive" className="mt-2">
              {errors.password}
            </Label>
          )}
        </div>

        <div className="mt-4 block">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={data.remember}
              onCheckedChange={() => setData('remember', !data.remember)}
            />
            <Label htmlFor="remember"> Remember me</Label>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end">
          {canResetPassword && (
            <Link
              href={route('password.request')}
              className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
            >
              Forgot your password?
            </Link>
          )}

          <Button className="ms-4" disabled={processing}>
            Log in
          </Button>
        </div>
      </form>
    </GuestLayout>
  );
}
