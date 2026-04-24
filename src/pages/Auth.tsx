import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Recycle, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function Auth() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = "Admin Sign In | car2scrap";
  }, []);

  useEffect(() => {
    if (!loading && session) navigate("/admin", { replace: true });
  }, [session, loading, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate("/admin", { replace: true });
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
          <h1 className="text-xl font-bold mb-1 font-[Poppins]">Admin Sign In</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Enter your email and password to access the dashboard.
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

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="cta"
              className="w-full"
              disabled={busy || !email.trim() || !password}
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
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