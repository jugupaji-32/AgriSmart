import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/custom/Button";
import { Input } from "@/components/custom/Input";
import { Wheat, Eye, EyeOff } from "lucide-react";
import api from "@/services/api";
import { toast } from "sonner";

const Register = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(location.pathname === "/login");
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        city: "",
        state: "",
        password: "",
    });

    useEffect(() => {
        setIsLogin(location.pathname === "/login");
    }, [location.pathname]);

    const toggleMode = () => {
        const newPath = isLogin ? "/register" : "/login";
        navigate(newPath);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("handleAuth called", { isLogin, formData });
        try {
            if (isLogin) {
                const { data } = await api.post("/auth/login", {
                    email: formData.email,
                    password: formData.password,
                });
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data));
                toast.success("Login successful!");
                navigate("/dashboard");
            } else {
                const { data } = await api.post("/auth/register", formData);
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data));
                toast.success("Registration successful!");
                navigate("/dashboard");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-vanilla/30 p-4 relative overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1560493676-04071c5f467b"
                    alt="Farmer in field"
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-vanilla/50 backdrop-blur-[2px]" />
            </div>

            <motion.div
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="w-full max-w-md bg-card border border-border rounded-xl shadow-lg p-4 sm:p-8 relative z-10"
            >
                <div className="flex flex-col items-center mb-4 sm:mb-8">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary flex items-center justify-center mb-3 sm:mb-4">
                        <Wheat className="w-5 h-5 sm:w-7 sm:h-7 text-primary-foreground" />
                    </div>
                    {!isLogin ? (
                        <>
                            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Create Account</h1>
                            <p className="text-sm sm:text-base text-muted-foreground text-center mt-1 sm:mt-2">
                                Join us for smarter farming
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Welcome Back</h1>
                            <p className="text-sm sm:text-base text-muted-foreground text-center mt-1 sm:mt-2">
                                Log in to access your farming insights
                            </p>
                        </>
                    )}
                </div>

                <form className="space-y-3 sm:space-y-6" onSubmit={handleAuth}>
                    {!isLogin && (
                        <div className="space-y-2">
                            <Input
                                name="name"
                                placeholder="Full Name"
                                className="h-10 sm:h-11"
                                value={formData.name}
                                onChange={handleChange}
                                required={!isLogin}
                            />
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <Input
                            name="email"
                            placeholder="Email Address"
                            type="email"
                            className="h-10 sm:h-11"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    {!isLogin && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="space-y-2">
                                <Input
                                    name="city"
                                    placeholder="City"
                                    className="h-10 sm:h-11"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required={!isLogin}
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    name="state"
                                    placeholder="State"
                                    className="h-10 sm:h-11"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required={!isLogin}
                                />
                            </div>
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        {isLogin && (
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Password</span>
                                <a href="#" className="text-xs text-primary hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                        )}
                        <div className="relative">
                            <Input
                                name="password"
                                placeholder="Password"
                                type={showPassword ? "text" : "password"}
                                className="h-10 sm:h-11 pr-10"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <Button className="w-full h-10 sm:h-11 text-sm sm:text-base flex items-center justify-center" size="lg" type="submit">
                        {isLogin ? "Log In" : "Sign Up"}
                    </Button>
                </form>

                <div className="relative my-4 sm:my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>

                <Button variant="outline" className="w-full h-10 sm:h-11 flex items-center justify-center text-sm sm:text-base" type="button">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    {isLogin ? "Log in with Google" : "Sign up with Google"}
                </Button>

                <div className="mt-4 sm:mt-6 text-center text-sm">
                    {!isLogin ? (
                        <>
                            <span className="text-muted-foreground">Already have an account?</span>{" "}
                            <button 
                                onClick={toggleMode}
                                className="text-olive font-semibold hover:underline"
                            >
                                Log In
                            </button>
                        </>
                    ) : (
                        <>
                            <span className="text-muted-foreground">Don't have an account?</span>{" "}
                            <button 
                                onClick={toggleMode}
                                className="text-olive font-semibold hover:underline"
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
