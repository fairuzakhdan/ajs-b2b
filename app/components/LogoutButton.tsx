import { logout } from "@/app/actions/auth";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-sm font-medium text-slate-700 hover:text-red-700 transition-colors"
      >
        Logout
      </button>
    </form>
  );
}
