import AuthTest from "../components/auth-test";

export default function TestAuthRoute() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>
      <p className="mb-4">
        This page is not in a protected route, so it should be accessible
        without authentication.
      </p>
      <AuthTest />
    </div>
  );
}
