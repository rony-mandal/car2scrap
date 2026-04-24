import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Recycle, MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function Auth() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    document.title = "Admin Sign In | car2scrap";
  }, []);

  useEffect(() => {
    if (!loading && session) navigate("/admin", { replace: true });
  }, [session, loading, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setOtpSent(true);
  }

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-lg justify-center mb-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-cta text-accent-green-foreground">
            <Recycle className="h-5 w-5" />
          </span>
          <span className="font-[Poppins]">
            car<span className="text-accent-green">2</span>scrap
          </span>
        </Link>

        <Card className="p-6 shadow-elegant">
          {otpSent ? (
            /* ── Check-your-inbox state ── */
            <div className="py-6 text-center space-y-4">
              <div className="mx-auto h-14 w-14 rounded-full bg-accent-green-soft flex items-center justify-center">
                <MailCheck className="h-7 w-7 text-accent-green" />
              </div>
              <h1 className="text-xl font-bold font-[Poppins]">Check your inbox</h1>
              <p className="text-sm text-muted-foreground">
                We sent a sign-in link to{" "}
                <strong className="text-foreground">{email}</strong>.
                <br />
                Click the link in the email to access the admin dashboard.
              </p>
              <p className="text-xs text-muted-foreground">
                Didn't receive it?{" "}
                <button
                  className="underline hover:text-foreground"
                  onClick={() => setOtpSent(false)}
                >
                  Try again
                </button>
              </p>
            </div>
          ) : (
            /* ── Email entry state ── */
            <>
              <h1 className="text-xl font-bold mb-1 font-[Poppins]">Admin Access</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Enter your email and we'll send you a secure sign-in link — no password needed.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1.5"
                  />
                </div>

                <Button
                  type="submit"
                  variant="cta"
                  className="w-full"
                  disabled={busy || !email.trim()}
                >
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                  Send Sign-in Link
                </Button>
              </form>
            </>
          )}
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          <Link to="/" className="hover:underline">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}