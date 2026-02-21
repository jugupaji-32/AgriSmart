import { Navigate, Outlet } from "react-router-dom";
import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import PageFallback from "@/components/PageFallback";


const ProtectedRoute = () => {
    const isAuthenticated = localStorage.getItem("token") !== null;

    return isAuthenticated ? (
        <Sidebar>
            {/* Keep Sidebar mounted; only lazy page content suspends with a skeleton */}
            <Suspense fallback={<PageFallback />}>
                <Outlet />
            </Suspense>
        </Sidebar>
    ) : (
        <Navigate to="/login" replace />
    );
};

export default ProtectedRoute;
