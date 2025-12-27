import { Link, useLocation } from 'react-router-dom';
import { getUser } from '../../lib/auth';

interface SidebarProps {
    isOpen: boolean;
    setOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setOpen }: SidebarProps) {
    const loc = useLocation();
    const user = getUser();
    const active = (p: string) => (loc.pathname === p ? 'bg-gray-100' : '');

    const closeSidebar = () => setOpen(false);

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" onClick={closeSidebar}></div>}

            <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r p-4 space-y-2 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-56 z-20`}>
                <div className="flex justify-between items-center md:hidden">
                    <h2 className="text-lg font-semibold">Menu</h2>
                    <button onClick={closeSidebar} className="text-gray-500 hover:text-gray-700">
                        &times;
                    </button>
                </div>
                <Link onClick={closeSidebar} className={`block px-3 py-2 rounded ${active('/')}`} to="/">Browse</Link>
                <Link onClick={closeSidebar} className={`block px-3 py-2 rounded ${active('/upload')}`} to="/upload">Upload</Link>
                {user?.role === 'admin' && (
                    <>
                        <div className="pt-4 pb-1 px-3 text-xs font-semibold text-gray-500 uppercase">Admin</div>
                        <Link onClick={closeSidebar} className={`block px-3 py-2 rounded ${active('/admin')}`} to="/admin">Dashboard</Link>
                        <Link onClick={closeSidebar} className={`block px-3 py-2 rounded ${active('/admin/approvals')}`} to="/admin/approvals">Approvals</Link>
                        <Link onClick={closeSidebar} className={`block px-3 py-2 rounded ${active('/admin/users')}`} to="/admin/users">Users</Link>
                        <Link onClick={closeSidebar} className={`block px-3 py-2 rounded ${active('/admin/flags')}`} to="/admin/flags">Flags</Link>
                    </>
                )}
            </aside>
        </>
    );
}
