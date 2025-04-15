import AuthGuard from "../components/auth-guard";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
