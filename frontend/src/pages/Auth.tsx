import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/custom/Button";
import { Input } from "@/components/custom/Input";
import { Label } from "@/components/custom/Label";
import { Card } from "@/components/custom/Card";
import { Wheat, Eye, EyeOff, Sprout, Sun, Cloud } from "lucide-react";
import api from "@/services/api";

const Auth = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(location.pathname === "/login");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
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

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        // Simple toast implementation - you can replace with your preferred toast library
        console.log(`${type}: ${message}`);
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            if (isLogin) {
                const { data } = await api.post("/auth/login", {
                    email: formData.email,
                    password: formData.password,
                });
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data));
                showToast("Welcome back to your agricultural dashboard!");
                navigate("/dashboard");
            } else {
                const { data } = await api.post("/auth/register", formData);
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data));
                showToast("Welcome to your agricultural platform! Start growing smarter.");
                navigate("/dashboard");
            }
        } catch (error: any) {
            showToast(error.response?.data?.message || "Authentication failed", 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-vanilla/30 flex items-center justify-center relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-10">
                {/* Floating wheat icons with animation */}
                <motion.div
                    className="absolute top-10 left-10"
                    animate={{
                        y: [0, -20, 0],
                        rotate: [12, 20, 12],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Wheat className="w-16 h-16 text-olive" />
                </motion.div>
                
                <motion.div
                    className="absolute top-32 right-20"
                    animate={{
                        y: [0, 15, 0],
                        rotate: [-12, -20, -12],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                    }}
                >
                    <Sprout className="w-12 h-12 text-olive" />
                </motion.div>
                
                <motion.div
                    className="absolute bottom-20 left-20"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 15, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Sun className="w-14 h-14 text-jonquil" />
                </motion.div>
                
                <motion.div
                    className="absolute bottom-10 right-10"
                    animate={{
                        x: [0, 15, 0],
                        y: [0, -10, 0],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                >
                    <Cloud className="w-12 h-12 text-arylide-yellow" />
                </motion.div>
                
                <motion.div
                    className="absolute top-1/2 left-1/4 transform -translate-y-1/2"
                    animate={{
                        rotate: [45, 60, 45],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 4.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.3
                    }}
                >
                    <Sprout className="w-8 h-8 text-olive/60" />
                </motion.div>
                
                <motion.div
                    className="absolute top-1/4 right-1/3"
                    animate={{
                        rotate: [-45, -60, -45],
                        y: [0, 10, 0],
                    }}
                    transition={{
                        duration: 5.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.8
                    }}
                >
                    <Wheat className="w-10 h-10 text-olive/60" />
                </motion.div>
                
                {/* Additional floating elements for more life */}
                <motion.div
                    className="absolute top-1/3 left-1/2"
                    animate={{
                        y: [0, -25, 0],
                        x: [0, 10, 0],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 7,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1.5
                    }}
                >
                    <Sprout className="w-6 h-6 text-jonquil" />
                </motion.div>
                
                <motion.div
                    className="absolute bottom-1/3 right-1/4"
                    animate={{
                        rotate: [0, 360],
                        scale: [0.8, 1, 0.8],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <Sun className="w-8 h-8 text-arylide-yellow/50" />
                </motion.div>
            </div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="container-padding w-full max-w-md mx-4"
            >
                <Card className="backdrop-blur-sm">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Wheat className="w-10 h-10 text-dark-moss" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            {isLogin ? "Welcome Back" : "Join AgriSmart"}
                        </h1>
                        <p className="text-muted-foreground">
                            {isLogin 
                                ? "Continue your smart farming journey" 
                                : "Start your smart farming journey today"
                            }
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-6">
                        {!isLogin && (
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Enter your full name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        
                        <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                placeholder="Enter your email address"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="relative">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full" 
                            size="lg"
                            disabled={isLoading}
                        >
                            {isLoading 
                                ? "Processing..." 
                                : isLogin ? "Sign In" : "Create Account"
                            }
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border/50"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="px-4 text-sm text-dark-moss font-medium">
                                    {isLogin ? "New to AgriSmart?" : "Already have an account?"}
                                </span>
                            </div>
                        </div>
                        
                        <Button
                            variant="outline"
                            onClick={toggleMode}
                            className="w-full"
                        >
                            {isLogin ? "Create Account" : "Sign In Instead"}
                        </Button>
                    </div>

                    {/* Feature highlights for new users */}
                    {!isLogin && (
                        <div className="mt-8 pt-6 border-t border-border/50">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <Sprout className="w-8 h-8 text-olive mx-auto mb-2" />
                                    <p className="text-xs text-muted-foreground">Crop Recommendations</p>
                                </div>
                                <div>
                                    <Sun className="w-8 h-8 text-jonquil mx-auto mb-2" />
                                    <p className="text-xs text-muted-foreground">Weather Insights</p>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </motion.div>
        </div>
    );
};

export default Auth;
