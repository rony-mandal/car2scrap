import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Recycle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export default function Auth() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = "Admin Sign In | car2scrap";
  }, []);

  useEffect(() => {
    if (!loading && session) navigate("/admin", { replace: true });
  }, [session, loading, navigate]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Signed in");
    navigate("/admin", { replace: true });
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
        data: { full_name: fullName },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created. You can sign in now.");
  }

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg justify-center mb-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-cta text-accent-green-foreground">
            <Recycle className="h-5 w-5" />
          </span>
          <span className="font-[Poppins]">
            car<span className="text-accent-green">2</span>scrap
          </span>
        </Link>

        <Card className="p-6 shadow-elegant">
          <h1 className="text-xl font-bold mb-1 font-[Poppins]">Admin Access</h1>
          <p className="text-sm text-muted-foreground mb-5">
            Sign in to manage leads and bookings.
          </p>

          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={signIn} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="si-email">Email</Label>
                  <Input
                    id="si-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="si-pw">Password</Label>
                  <Input
                    id="si-pw"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1.5"
                  />
                </div>
                <Button type="submit" variant="cta" className="w-full" disabled={busy}>
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={signUp} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="su-name">Full name</Label>
                  <Input
                    id="su-name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="su-email">Email</Label>
                  <Input
                    id="su-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="su-pw">Password (min 8 characters)</Label>
                  <Input
                    id="su-pw"
                    type="password"
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1.5"
                  />
                </div>
                <Button type="submit" variant="cta" className="w-full" disabled={busy}>
                  {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Admin role is granted manually after first signup.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          <Link to="/" className="hover:underline">← Back to website</Link>
        </p>
      </div>
    </div>
  );
}
