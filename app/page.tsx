import { Scale, Search, BookOpen, Users, ArrowRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants/routes';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <Scale className="h-16 w-16 text-blue-600" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
              Appellate Tea
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your comprehensive platform for legal publications, case law, and judicial opinions.
              Access thousands of cases with advanced search and analysis tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={ROUTES.SEARCH}>
                <Button size="lg" className="w-full sm:w-auto">
                  <Search className="mr-2 h-5 w-5" />
                  Search Cases
                </Button>
              </Link>
              <Link href={ROUTES.CASES}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Browse All Cases
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything you need for legal research
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Comprehensive Database
              </h3>
              <p className="text-gray-600">
                Access thousands of appellate court decisions, Supreme Court rulings, and legal opinions.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Advanced Search
              </h3>
              <p className="text-gray-600">
                Find exactly what you need with powerful search, filters, and citation lookup.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Stay Updated
              </h3>
              <p className="text-gray-600">
                Get notified about new cases, legal developments, and analysis from expert authors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-sm text-gray-600">Cases</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-sm text-gray-600">Authors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-sm text-gray-600">Courts</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">1M+</div>
              <div className="text-sm text-gray-600">Monthly Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Users className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg text-blue-100 mb-8">
            Create an account to save cases, access premium features, and connect with legal professionals.
          </p>
          <Link href={ROUTES.REGISTER}>
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}