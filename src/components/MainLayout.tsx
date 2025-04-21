import { Outlet } from "react-router";
import { Toaster } from "sonner";

export default function MainLayout() {
    return (
        <div className="h-screen flex flex-col">
            {/* Navbar */}
            <nav className="bg-gray-800 p-4 h-14">        
            </nav>
    
            {/* Main */}        
            <main className="flex flex-col grow px-36 py-12">        
                <Outlet />
            </main>
            <Toaster richColors/>
    
            {/* Footer */}
            <footer className="bg-gray-800 p-4 h-40">
            </footer>
        </div>
    )
}