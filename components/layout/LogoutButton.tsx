import { logout } from "@/features/auth/login/actions/login";

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
