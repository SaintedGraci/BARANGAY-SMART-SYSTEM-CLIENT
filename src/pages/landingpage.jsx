import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Bell,
  Check,
  ChevronRight,
  Clock,
  FileText,
  Mail,
  MapPin,
  Menu,
  Megaphone,
  Phone,
  Shield,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import bakilidLogo from '../assets/bakilidlogo.png';

const services = [
  {
    icon: FileText,
    title: 'Document Requests',
    description: 'Request barangay clearance, certificates, and permits online—no more long queues.',
    accent: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Clock,
    title: 'Real-Time Tracking',
    description: 'Follow every step of your application with live status updates and notifications.',
    accent: 'from-violet-500 to-purple-500',
  },
  {
    icon: Megaphone,
    title: 'Announcements',
    description: 'Stay informed with community news, events, and official barangay notices.',
    accent: 'from-amber-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Your personal data is protected with secure authentication and encrypted storage.',
    accent: 'from-emerald-500 to-teal-500',
  },
];

const documents = [
  'Barangay Clearance',
  'Certificate of Residency',
  'Indigency Certificate',
  'Business Permit',
  'Certificate of Good Moral',
  'Community Tax Certificate',
];

const steps = [
  {
    step: '01',
    title: 'Create your account',
    description: 'Register with your details in minutes and verify your resident profile.',
  },
  {
    step: '02',
    title: 'Submit a request',
    description: 'Choose your document type, upload requirements, and submit online.',
  },
  {
    step: '03',
    title: 'Track & pick up',
    description: 'Monitor status in real time and get notified when your document is ready.',
  },
];

const mockRequests = [
  { title: 'Barangay Clearance', status: 'Ready for Release', color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
  { title: 'Certificate of Residency', status: 'Processing', color: 'text-blue-600', bg: 'bg-blue-50', dot: 'bg-blue-500' },
  { title: 'Business Permit', status: 'Under Review', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-500' },
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#services', label: 'Services' },
    { href: '#how-it-works', label: 'How it works' },
    { href: '#documents', label: 'Documents' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 antialiased">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-3xl animate-blob" />
        <div className="absolute top-1/3 -left-32 h-[400px] w-[400px] rounded-full bg-indigo-400/15 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 right-1/4 h-[350px] w-[350px] rounded-full bg-violet-400/10 blur-3xl animate-blob animation-delay-4000" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.25) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#home" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-sm">
              <img src={bakilidLogo} alt="Bakilid Logo" className="h-full w-full object-contain" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold tracking-tight text-slate-900">Barangay Bakilid</p>
              <p className="text-xs font-medium text-blue-600">Smart Document System</p>
            </div>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/login')}
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 sm:block"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate('/register')}
              className="hidden rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 sm:inline-flex sm:items-center sm:gap-1.5"
            >
              Register
            </button>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-1 rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-slate-200/60 bg-white/95 px-4 py-4 backdrop-blur-xl md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => navigate('/login')}
                className="mt-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/register')}
                className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700"
              >
                Register
              </button>
              <button
                onClick={() => navigate('/login')}
                className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Get started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="home" className="relative">
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:pb-28">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-12">
            <div className="animate-fade-in-up">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3.5 py-1.5 text-sm font-medium text-blue-700">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                </span>
                <Sparkles className="h-3.5 w-3.5" />
                Digital services for Barangay Bakilid
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                Government services,{' '}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  simplified online
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
                Request documents, track applications, and stay connected with your barangay—all from one modern portal built for residents.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={() => navigate('/register')}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl"
                >
                  Register as resident
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 hover:shadow-xl"
                >
                  Sign in to portal
                  <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-slate-200/80 pt-8">
                {[
                  { value: '6+', label: 'Document types' },
                  { value: '24/7', label: 'Online access' },
                  { value: 'Live', label: 'Status tracking' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold tracking-tight text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Product preview */}
            <div className="relative animate-fade-in-up animation-delay-150">
              <div className="relative rounded-2xl border border-slate-200/80 bg-white p-1 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5">
                <div className="flex items-center gap-2 rounded-t-xl border-b border-slate-100 bg-slate-50/80 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="flex-1 text-center text-xs font-medium text-slate-400">portal.barangay-bakilid.gov</span>
                </div>

                <div className="space-y-3 p-4 sm:p-5">
                  <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 text-white">
                    <div>
                      <p className="text-xs font-medium text-slate-400">Welcome back</p>
                      <p className="text-sm font-semibold">My Document Requests</p>
                    </div>
                    <div className="relative">
                      <Bell className="h-5 w-5 text-slate-300" />
                      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-blue-400 ring-2 ring-slate-900" />
                    </div>
                  </div>

                  {mockRequests.map((req) => (
                    <div
                      key={req.title}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 transition-colors hover:bg-white hover:shadow-sm"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200/80">
                        <FileText className="h-5 w-5 text-slate-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">{req.title}</p>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${req.bg} ${req.color}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${req.dot}`} />
                          {req.status}
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -left-4 top-1/4 hidden rounded-xl border border-slate-200/80 bg-white px-3 py-2 shadow-lg sm:block lg:-left-8">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                    <Zap className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Fast processing</p>
                    <p className="text-[10px] text-slate-500">Avg. 2–3 days</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-2 bottom-8 hidden rounded-xl border border-slate-200/80 bg-white px-3 py-2 shadow-lg sm:block lg:-right-6">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                    <Shield className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Secure portal</p>
                    <p className="text-[10px] text-slate-500">Encrypted data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services — Bento grid */}
      <section id="services" className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Platform features</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need in one place
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              A complete digital workspace for residents and barangay staff—built for speed, clarity, and trust.
            </p>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div
                    className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${service.accent} text-white shadow-md`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.description}</p>
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-slate-100 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative border-y border-slate-200/60 bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">How it works</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Three steps to your documents
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              From registration to pickup—our streamlined process saves you time and trips to the hall.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((item, i) => (
              <div key={item.step} className="relative text-center md:text-left">
                {i < steps.length - 1 && (
                  <div className="absolute top-8 left-[calc(50%+2rem)] hidden h-px w-[calc(100%-4rem)] bg-gradient-to-r from-slate-200 to-transparent md:block" />
                )}
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-lg font-bold text-slate-900 md:mx-0">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents */}
      <section id="documents" className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Available documents</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Request any certificate online
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Choose from our full catalog of barangay documents—all requestable through the resident portal.
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700"
            >
              Browse all documents
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map((doc) => (
              <div
                key={doc}
                className="group flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{doc}</h3>
                  <p className="text-xs text-slate-500">Available online</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-slate-900 px-8 py-16 text-center sm:px-16 sm:py-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl" />
            <div className="absolute -bottom-16 right-0 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.15) 1px, transparent 0)`,
                backgroundSize: '24px 24px',
              }}
            />
          </div>

          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to skip the queue?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
              Join residents already using Barangay Bakilid&apos;s digital portal for faster, transparent government services.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition-all hover:bg-slate-100"
              >
                Create account / Sign in
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                Register as resident
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-slate-200/80 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
                  <img src={bakilidLogo} alt="Bakilid Logo" className="h-full w-full object-contain" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Barangay Bakilid</p>
                  <p className="text-xs text-slate-500">Smart Document System</p>
                </div>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
                Serving the community with efficient, transparent digital services—making barangay transactions accessible for every resident.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">Quick links</p>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="transition-colors hover:text-slate-900">
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <button onClick={() => navigate('/login')} className="transition-colors hover:text-slate-900">
                    Sign in
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">Contact</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                  (123) 456-7890
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                  bakilid@barangay.gov.ph
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  Barangay Bakilid, City Hall
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-8 sm:flex-row">
            <p className="text-sm text-slate-500">&copy; 2026 Barangay Bakilid. All rights reserved.</p>
            <p className="text-xs text-slate-400">Built for transparent, citizen-first governance</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
