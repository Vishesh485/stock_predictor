'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
    const { user, logout, isAuthenticated, loading } = useAuth();

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
                        Stock Predictor
                    </Link>

                    <div className="flex items-center gap-4">
                        {loading ? (
                            <div className="animate-pulse h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        ) : isAuthenticated && user ? (
                            <>
                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <User size={20} />
                                    <span className="hidden sm:inline">{user.name || user.email}</span>
                                </div>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                >
                                    <LogOut size={18} />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <LogIn size={18} />
                                    <span>Login</span>
                                </Link>
                                <Link
                                    href="/register"
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    <UserPlus size={18} />
                                    <span>Sign Up</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
