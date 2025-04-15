import AuthGuard from "../components/auth-guard";

export default function FoodLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
