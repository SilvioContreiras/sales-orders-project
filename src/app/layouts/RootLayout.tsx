import { useEffect, useState } from 'react';
import { Link, Outlet } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { navSections } from '@/app/router/navigation';
import { Toaster } from '@/shared/components/Toaster';
import { cn } from '@/shared/lib/cn';

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
      {navSections.map((section) => (
        <div key={section.title}>
          <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === '/' }}
                  onClick={onNavigate}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                  activeProps={{
                    className: 'bg-brand-50 text-brand-700 hover:bg-brand-50',
                  }}
                >
                  <item.icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
        OV
      </span>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-slate-900">OVGS</p>
        <p className="text-xs text-slate-500">Ordens de Venda</p>
      </div>
    </div>
  );
}

export function RootLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileNavOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileNavOpen]);

  const closeMobileNav = () => setMobileNavOpen(false);

  return (
    <div className="flex min-h-full">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <Brand />
        </div>
        <Navigation />
      </aside>

      <div
        className={cn(
          'fixed inset-0 z-40 md:hidden',
          mobileNavOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!mobileNavOpen}
        inert={!mobileNavOpen ? true : undefined}
      >
        <div
          className={cn(
            'absolute inset-0 bg-slate-900/40 transition-opacity duration-300 ease-out',
            mobileNavOpen ? 'opacity-100' : 'opacity-0',
          )}
          onClick={closeMobileNav}
        />
        <aside
          className={cn(
            'absolute inset-y-0 left-0 flex w-[min(18rem,85vw)] flex-col bg-white shadow-xl transition-transform duration-300 ease-out',
            mobileNavOpen ? 'translate-x-0' : '-translate-x-full',
          )}
          role="dialog"
          aria-modal={mobileNavOpen}
          aria-label="Menu de navegação"
        >
          <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
            <Brand />
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={closeMobileNav}
              className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100"
            >
              <X className="size-5" />
            </button>
          </div>
          <Navigation onNavigate={closeMobileNav} />
        </aside>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:h-16 sm:px-6">
          <button
            type="button"
            aria-label="Abrir menu"
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen(true)}
            className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 md:hidden"
          >
            <Menu className="size-5" />
          </button>
          <h1 className="min-w-0 truncate text-sm font-semibold text-slate-900 sm:text-base">
            <span className="sm:hidden">OVGS</span>
            <span className="hidden sm:inline">Sistema de Gestão de Ordens de Venda</span>
          </h1>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      <Toaster />
    </div>
  );
}
