import { LoginForm } from "@/components/admin/LoginForm";

type SearchParams = Promise<{ redirect?: string }>;

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <h1 className="font-serif text-3xl font-semibold text-accent">Admin Login</h1>
      <p className="mt-2 text-sm text-muted">
        Sign in to manage clothes and bookings.
      </p>
      <div className="mt-8">
        <LoginForm redirect={params.redirect} />
      </div>
    </div>
  );
}
