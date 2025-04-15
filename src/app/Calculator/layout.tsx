import AuthGuard from "../components/auth-guard";

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
