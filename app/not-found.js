import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-32 text-center">
      <div className="text-7xl mb-6">🔎</div>
      <h1 className="section-title mb-3">Page Not Found</h1>
      <p className="text-white/50 mb-8">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link href="/" className="btn-primary">
        Back to Homepage
      </Link>
    </div>
  );
}
