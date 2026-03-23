import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { resetPassword } from "@/services/auth";

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-2xl font-bold text-green-600">Password updated successfully</h1>
        <p className="text-sm text-muted-foreground">
          Redirecting to login...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password below.
        </p>
      </div>
      {error && (
        <div className="flex flex-col gap-2 text-center">
          <p className="text-sm text-red-500">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-xs text-primary underline underline-offset-4"
          >
            Request a new reset email
          </button>
        </div>
      )}
      <div className="grid gap-4">
        <Field>
          <FieldLabel htmlFor="new-password">New Password</FieldLabel>
          <Input
            id="new-password"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
        </Field>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </div>
    </form>
  );
}
