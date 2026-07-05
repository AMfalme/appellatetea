'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { MainNav } from '@/components/ui/Navigation';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants/routes';
import { useAuth } from '@/components/providers/AuthProvider';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={ROUTES.HOME} className="flex items-center space-x-2">
              <img
                src="/logo/logo_white.png"
                alt="Appellate Tea"
                width={80}
                height={80}
                className="h-50 w-auto mt-5"
                style={{ display: 'block' }}
              />
              {/* <span className="text-xl font-bold text-gray-900">Appellate Tea</span> */}
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <MainNav />
          </div>
          
          {/* Auth Section */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    <span className="text-sm text-gray-700">
                      {user.displayName}
                    </span>
                    <Button variant="outline" size="sm">
                      Dashboard
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href={ROUTES.LOGIN}>
                      <Button variant="ghost" size="sm">Log in</Button>
                    </Link>
                    <Link href={ROUTES.REGISTER}>
                      <Button size="sm">Sign up</Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <MainNav className="flex-col items-start space-y-4 space-x-0" />
              <div className="pt-4 border-t border-gray-200">
                {!loading && (
                  <>
                    {user ? (
                      <>
                        <p className="text-sm text-gray-700 mb-2">
                          {user.displayName}
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          Dashboard
                        </Button>
                      </>
                    ) : (
                      <div className="flex flex-col space-y-2">
                        <Link href={ROUTES.LOGIN}>
                          <Button variant="outline" size="sm" className="w-full">
                            Log in
                          </Button>
                        </Link>
                        <Link href={ROUTES.REGISTER}>
                          <Button size="sm" className="w-full">
                            Sign up
                          </Button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}