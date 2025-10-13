import Link from "next/link";
import LogOutInput from "../formInputs/logoutInput";

export default async function Header({
  session,
}: {
  session: { user: { role: string; name: string } } | null;
}) {
  if (!session) {
    return null;
  }

  return (
    <header className="flex justify-between items-center p-4">
      <nav>Navbar</nav>
      <div className="space-x-4">
        {session?.user?.role === "ADMIN" ? (
          <Link href="/admin" className="text-blue-600 underline">
            Admin
          </Link>
        ) : null}
        <LogOutInput />
      </div>
    </header>
  );
}
