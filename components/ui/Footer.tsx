import Link from 'next/link';
import { ROUTES } from '@/lib/constants/routes';
import { APP_CONFIG } from '@/lib/constants/config';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {APP_CONFIG.NAME}
            </h3>
            <p className="text-sm text-gray-600 max-w-md">
              A production-ready legal publication platform dedicated to providing 
              comprehensive access to case law and legal opinions.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href={ROUTES.CASES} className="text-sm text-gray-600 hover:text-blue-600">
                  Cases
                </Link>
              </li>
              <li>
                <Link href={ROUTES.AUTHORS} className="text-sm text-gray-600 hover:text-blue-600">
                  Authors
                </Link>
              </li>
              <li>
                <Link href={ROUTES.SEARCH} className="text-sm text-gray-600 hover:text-blue-600">
                  Search
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Information</h4>
            <ul className="space-y-2">
              <li>
                <Link href={ROUTES.ABOUT} className="text-sm text-gray-600 hover:text-blue-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-blue-600">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            © {currentYear} {APP_CONFIG.NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}