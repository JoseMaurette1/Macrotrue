import AuthGuard from "../components/auth-guard";

export default function WorkoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
