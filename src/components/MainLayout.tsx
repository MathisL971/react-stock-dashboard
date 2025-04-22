import { Outlet } from "react-router";
import { Toaster } from "sonner";

export default function MainLayout() {
    return (
        <div className="h-screen flex flex-col">
            {/* Navbar */}
            <nav className="bg-gray-800 px-12 py-4">
                <h1 className="text-white text-xl font-bold">My Stock Dashboard</h1>        
            </nav>
    
            {/* Main */}        
            <main className="flex flex-col grow px-36 py-12 bg-gray-50">        
                <Outlet />
            </main>
            <Toaster richColors/>
    
            {/* Footer */}
            <footer className="bg-gray-800">
            </footer>
        </div>
    )
}