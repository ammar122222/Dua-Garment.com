import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, CheckCircle, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatedAlert } from "@/components/AnimatedAlert";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, role, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/account");
      }
    }
  }, [isAuthenticated, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAlert({ type: "error", message: "Please fill in both email and password." });
      return;
    }
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);
    if (result.success) {
      setAlert({ type: "success", message: "Successfully Logged In!" });
      toast({
        title: "Login Successful",
        description: `Welcome back!`,
      });
      setTimeout(() => {
        setAlert(null);
        navigate(result.role === "admin" ? "/admin" : "/account");
      }, 1200);
    } else {
      let message = "Invalid email or password. Try admin@duagarments.com / admin123";
      if (result.error && result.error.code) {
        if (result.error.code === "auth/user-not-found") {
          message = "No account found with this email.";
        } else if (result.error.code === "auth/wrong-password") {
          message = "Incorrect password.";
        } else if (result.error.code === "auth/invalid-email") {
          message = "Invalid email address.";
        } else if (result.error.code === "auth/too-many-requests") {
          message = "Too many failed attempts. Please try again later.";
        }
      }
      setAlert({ type: "error", message });
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            <Link to="/" className="text-primary">Dua Garments</Link>
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alert && <AnimatedAlert type={alert.type} message={alert.message} />}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
         
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
