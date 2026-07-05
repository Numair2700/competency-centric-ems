import { Form, Head } from '@inertiajs/react';
import { GraduationCap, Lock, LogIn, Mail } from 'lucide-react';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import { request } from '@/routes/password';
import { store } from '@/routes/login';
import TextLink from '@/components/text-link';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

/**
 * Login screen per the Stitch design: centred 440px card on the #f7f9fb
 * canvas with soft radial blobs, brand tile, tracked uppercase labels with
 * icon-prefixed inputs, and a full-width navy submit button. Role is
 * detected automatically on login (FR1, FR2) — no selector, no sign-up.
 */
export default function Login({ status, canResetPassword }: Props) {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ems-bg p-6 font-inter text-ems-on-surface">
            <Head title="Log in" />

            <div className="pointer-events-none absolute inset-0 opacity-20">
                <div className="absolute -top-24 -left-24 size-96 rounded-full bg-ems-primary opacity-10 blur-3xl" />
                <div className="absolute -right-24 -bottom-24 size-96 rounded-full bg-ems-tertiary opacity-10 blur-3xl" />
            </div>

            <main className="z-10 w-full max-w-[440px]">
                <div className="mb-6 text-center">
                    <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-ems-primary p-4 text-white shadow-sm">
                        <GraduationCap className="size-8" />
                    </div>
                    <h1 className="mb-2 text-3xl font-bold tracking-tight text-ems-primary">
                        EMS Portal
                    </h1>
                    <p className="text-sm text-ems-secondary">
                        Competency-Centric Education Management
                    </p>
                </div>

                <div className="rounded-xl border border-ems-border bg-white p-5 shadow-sm">
                    <div className="mb-6 border-b border-ems-border pb-4">
                        <h2 className="text-xl font-semibold">Sign in</h2>
                        <p className="mt-1 text-[13px] font-medium text-ems-secondary">
                            Your dashboard is matched to your role automatically
                        </p>
                    </div>

                    {status && (
                        <div className="mb-4 rounded-lg bg-ems-emerald/10 px-4 py-3 text-sm font-medium text-ems-emerald">
                            {status}
                        </div>
                    )}

                    <Form {...store.form()} resetOnSuccess={['password']} className="space-y-4">
                        {({ processing, errors }) => (
                            <>
                                <div className="space-y-2">
                                    <label
                                        htmlFor="email"
                                        className="block text-xs font-semibold tracking-wider text-ems-on-surface uppercase"
                                    >
                                        Email Address
                                    </label>
                                    <div className="group relative">
                                        <Mail className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-ems-outline transition-colors group-focus-within:text-ems-primary" />
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            autoComplete="email"
                                            placeholder="student@university.ac.uk"
                                            className="w-full rounded-lg border border-ems-border bg-ems-surface-low py-3 pr-4 pl-10 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-ems-primary focus:outline-none"
                                        />
                                    </div>
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label
                                            htmlFor="password"
                                            className="block text-xs font-semibold tracking-wider text-ems-on-surface uppercase"
                                        >
                                            Password
                                        </label>
                                        {canResetPassword && (
                                            <TextLink
                                                href={request()}
                                                className="text-[13px] font-medium text-ems-primary"
                                            >
                                                Forgot password?
                                            </TextLink>
                                        )}
                                    </div>
                                    <div className="group relative">
                                        <Lock className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-ems-outline transition-colors group-focus-within:text-ems-primary" />
                                        <input
                                            id="password"
                                            type="password"
                                            name="password"
                                            required
                                            autoComplete="current-password"
                                            placeholder="••••••••"
                                            className="w-full rounded-lg border border-ems-border bg-ems-surface-low py-3 pr-4 pl-10 text-sm transition-all focus:border-transparent focus:ring-2 focus:ring-ems-primary focus:outline-none"
                                        />
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        id="remember"
                                        name="remember"
                                        type="checkbox"
                                        className="size-4 rounded border-ems-border text-ems-primary focus:ring-ems-primary"
                                    />
                                    <label
                                        htmlFor="remember"
                                        className="text-[13px] font-medium text-ems-secondary"
                                    >
                                        Remember this device
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    data-test="login-button"
                                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-ems-primary py-4 text-lg font-semibold text-white shadow-sm transition-all duration-150 hover:bg-ems-primary-container active:scale-95 disabled:pointer-events-none disabled:opacity-60"
                                >
                                    {processing ? <Spinner /> : <LogIn className="size-5" />}
                                    Log In
                                </button>
                            </>
                        )}
                    </Form>
                </div>

                <p className="mt-6 text-center text-[13px] font-medium text-ems-outline">
                    Access restricted to accounts created by the administrator.
                </p>
            </main>
        </div>
    );
}
