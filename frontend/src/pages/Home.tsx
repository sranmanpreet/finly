import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => (
  <div className="min-h-screen max-w-3xl mx-auto py-16 px-4 text-center bg-white dark:bg-gray-950 transition-colors duration-300">
    {/* Hero Section with Image */}
    <div className="flex flex-col items-center justify-center mb-8">
  <img src="/finly-logo.png" alt="Finly Logo" className="w-32 h-32 mb-4 rounded-full shadow-lg border-2 border-blue-200" />
      <h1 className="text-4xl font-bold mb-4 text-blue-700 dark:text-blue-200">Finly: Smarter Personal Finance</h1>
      <p className="text-lg mb-4 text-gray-700 dark:text-gray-300 max-w-xl mx-auto">
        <b>Finly</b> is your privacy-first personal finance dashboard. Effortlessly categorize your transactions, visualize your spending, and gain actionable insights—all from your own device.
      </p>
      <Link
        to="/categorizer"
        className="inline-block bg-blue-600 dark:bg-blue-800 text-white px-6 py-3 rounded shadow hover:bg-blue-700 dark:hover:bg-blue-900 transition mb-6"
      >
        Get Started: Transaction Categorizer
      </Link>
      <span className="text-sm text-gray-500 dark:text-gray-400">No sign-up required. Your data never leaves your device.</span>
    </div>

    {/* Key Features */}
    <section className="mt-12 mb-12">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
        <div className="bg-blue-50 dark:bg-gray-900 rounded p-4">
          <span className="text-2xl mr-2">🔒</span>
          <b className="text-gray-800 dark:text-gray-200">Privacy-first</b>: <span className="text-gray-700 dark:text-gray-300">All processing happens locally in your browser.</span>
        </div>
        <div className="bg-blue-50 dark:bg-gray-900 rounded p-4">
          <span className="text-2xl mr-2">📊</span>
          <b className="text-gray-800 dark:text-gray-200">Insightful Charts</b>: <span className="text-gray-700 dark:text-gray-300">Visualize trends, categories, and top merchants.</span>
        </div>
        <div className="bg-blue-50 dark:bg-gray-900 rounded p-4">
          <span className="text-2xl mr-2">⚡</span>
          <b className="text-gray-800 dark:text-gray-200">Fast & Easy</b>: <span className="text-gray-700 dark:text-gray-300">Drag-and-drop CSV upload, instant results.</span>
        </div>
        <div className="bg-blue-50 dark:bg-gray-900 rounded p-4">
          <span className="text-2xl mr-2">📝</span>
          <b className="text-gray-800 dark:text-gray-200">Manual & Auto Categorization</b>: <span className="text-gray-700 dark:text-gray-300">Fine-tune your data as you like.</span>
        </div>
        <div className="bg-blue-50 dark:bg-gray-900 rounded p-4">
          <span className="text-2xl mr-2">💾</span>
          <b className="text-gray-800 dark:text-gray-200">Export</b>: <span className="text-gray-700 dark:text-gray-300">Download your categorized data for further analysis.</span>
        </div>
        <div className="bg-blue-50 dark:bg-gray-900 rounded p-4">
          <span className="text-2xl mr-2">💡</span>
          <b className="text-gray-800 dark:text-gray-200">Open Source</b>: <span className="text-gray-700 dark:text-gray-300">100% free and transparent.</span>
        </div>
      </div>
    </section>

    {/* How It Works */}
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">How It Works</h2>
      <ol className="list-decimal list-inside text-left max-w-xl mx-auto text-gray-700 dark:text-gray-300 space-y-2">
        <li>Download your bank statement as a CSV file.</li>
        <li>Upload it to Finly using our secure, local tool.</li>
        <li>Review and adjust automatic categorizations if needed.</li>
        <li>Explore your finances with interactive charts and summaries.</li>
        <li>Export your categorized data for your records or accountant.</li>
      </ol>
    </section>

    {/* Benefits */}
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Why Choose Finly?</h2>
      <ul className="text-left max-w-xl mx-auto text-gray-700 dark:text-gray-300 list-disc list-inside space-y-2">
        <li>No sign-up required. Your data never leaves your device.</li>
        <li>Supports statements from all major banks.</li>
        <li>Modern, intuitive interface for all users.</li>
        <li>Community-driven and open source.</li>
      </ul>
    </section>

    {/* Visual Demo Section */}
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">See Finly in Action</h2>
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
  <img src="/finly-logo.png" alt="Finly Demo Screenshot" className="w-64 h-40 object-cover rounded-lg shadow border border-gray-200 dark:border-gray-800" />
        <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-6 text-gray-700 dark:text-gray-300 max-w-md">
          <b>Instant Results:</b> Upload your file, map columns, and see your spending visualized in seconds.<br />
          <b>Interactive Charts:</b> Explore your finances with pie charts, trends, and merchant breakdowns.<br />
          <b>Export & Share:</b> Download your categorized transactions for further analysis or sharing.
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">What Users Say</h2>
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <blockquote className="bg-white dark:bg-gray-900 rounded shadow p-4 text-left">
          <span className="text-blue-600 dark:text-blue-400 font-bold">“</span>
          <span className="text-gray-700 dark:text-gray-300">Finly made it so easy to understand my spending. Love the privacy!</span>
          <span className="text-blue-600 dark:text-blue-400 font-bold">”</span>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">— Alex, Freelancer</div>
        </blockquote>
        <blockquote className="bg-white dark:bg-gray-900 rounded shadow p-4 text-left">
          <span className="text-blue-600 dark:text-blue-400 font-bold">“</span>
          <span className="text-gray-700 dark:text-gray-300">The charts and export features are a game changer for my budgeting.</span>
          <span className="text-blue-600 dark:text-blue-400 font-bold">”</span>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">— Priya, Consultant</div>
        </blockquote>
      </div>
    </section>

    {/* FAQ */}
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Frequently Asked Questions</h2>
      <div className="text-left max-w-xl mx-auto space-y-4">
        <div>
          <b className="text-gray-800 dark:text-gray-200">Is my data safe?</b>
          <div className="text-gray-600 dark:text-gray-400">Yes! All processing happens in your browser. Nothing is uploaded or stored on our servers.</div>
        </div>
        <div>
          <b className="text-gray-800 dark:text-gray-200">What banks are supported?</b>
          <div className="text-gray-600 dark:text-gray-400">Any bank that lets you export transactions as CSV. We support all standard formats.</div>
        </div>
        <div>
          <b className="text-gray-800 dark:text-gray-200">Is Finly really free?</b>
          <div className="text-gray-600 dark:text-gray-400">Absolutely! Finly is open source and always will be.</div>
        </div>
        <div>
          <b className="text-gray-800 dark:text-gray-200">Can I contribute?</b>
          <div className="text-gray-600 dark:text-gray-400">Yes! Check out our <a href="https://github.com/sranmanpreet/tran-cate" className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">GitHub repo</a>.</div>
        </div>
      </div>
    </section>

    {/* About/Trust Section */}
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">About Finly</h2>
      <p className="text-gray-700 dark:text-gray-300 mb-2">
        Finly is built by a passionate team of developers and finance enthusiasts who believe in privacy, transparency, and empowering individuals to take control of their finances.
      </p>
      <div className="text-gray-600 dark:text-gray-400 text-sm">
        <a href="https://github.com/sranmanpreet/tran-cate" className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
          View on GitHub
        </a>
        <span className="mx-2">|</span>
        <a href="#" className="hover:underline">Privacy Policy</a>
        <span className="mx-2">|</span>
        <a href="#" className="hover:underline">Contact</a>
      </div>
    </section>
  </div>
);

export default Home;