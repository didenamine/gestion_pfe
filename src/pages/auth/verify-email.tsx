import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const verificationStarted = useRef(false);

  const performVerification = async () => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    if (verificationStarted.current) return;
    verificationStarted.current = true;

    try {
      console.log("Starting verification with token:", token);
      setStatus("loading");
      const result = await verifyEmail(token);
      console.log("Verification successful:", result);
      setStatus("success");
      setMessage("Email verified successfully! You can now log in.");
    } catch (err: any) {
      console.error("Verification failed:", err);
      setStatus("error");
      setMessage(err.message || "Email verification failed.");
      // Allow retry if it failed
      verificationStarted.current = false;
    }
  };

  useEffect(() => {
    if (token && !verificationStarted.current) {
        performVerification();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="w-full max-w-md p-8 bg-card border border-border rounded-2xl shadow-lg relative overflow-hidden text-center">
        {status === "loading" && (
          <div className="space-y-4 py-8">
            <Loader2 className="size-12 animate-spin text-primary mx-auto" />
            <h1 className="text-2xl font-bold">Verifying your email...</h1>
            <p className="text-muted-foreground">This will only take a moment.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6 py-6 animate-in fade-in zoom-in duration-500">
            <div className="size-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                <CheckCircle2 className="size-10 text-green-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Email Verified!</h1>
              <p className="text-lg text-muted-foreground">{message}</p>
            </div>
            <Button 
                onClick={() => navigate("/login")}
                className="w-full h-12 text-lg font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Go to Login
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6 py-6 animate-in fade-in zoom-in duration-500">
            <div className="size-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                <XCircle className="size-10 text-red-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Verification Failed</h1>
              <p className="text-lg text-red-600/80 font-medium">{message}</p>
            </div>
            <div className="flex flex-col gap-3 pt-2">
                <Button 
                    onClick={() => navigate("/signup")}
                    variant="outline"
                    className="w-full h-12 text-lg transition-all hover:bg-muted"
                >
                Return to Signup
                </Button>
                <Button 
                    onClick={() => performVerification()}
                    variant="link"
                    className="text-primary hover:text-primary/80"
                >
                Try again
                </Button>
            </div>
          </div>
        )}

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-4 -mt-4 p-8 bg-primary/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 -ml-4 -mb-4 p-8 bg-primary/5 rounded-full blur-2xl" />
      </div>
    </div>
  );
}
