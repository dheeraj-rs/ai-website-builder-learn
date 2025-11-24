'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sparkles, Code, Zap, Eye } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Website Builder</span>
          </div>

          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Build Beautiful Websites
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              With AI Assistance
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Create stunning, production-ready websites by simply chatting with our AI.
            No coding experience required.
          </p>

          <Button
            onClick={() => router.push('/builder')}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg h-auto rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start Building Now
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              AI-Powered Creation
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Describe what you want and watch as AI generates beautiful, responsive designs instantly.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Live Preview
            </h3>
            <p className="text-gray-600 leading-relaxed">
              See changes in real-time. Click any element to edit it with AI-powered suggestions.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Export & Deploy
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Download your website as a single HTML file, ready for deployment anywhere.
            </p>
          </div>
        </div>

        <div className="mt-20 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-12 text-center text-white shadow-2xl">
          <Code className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">
            No Coding Required
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Just chat with our AI, describe your vision, and watch your website come to life.
          </p>
          <Button
            onClick={() => router.push('/builder')}
            size="lg"
            variant="outline"
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg h-auto rounded-xl border-2 border-white"
          >
            Get Started Free
          </Button>
        </div>
      </div>
    </div>
  );
}
