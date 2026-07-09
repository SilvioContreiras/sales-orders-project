import { Link, Outlet } from '@tanstack/react-router';
import { navSections } from '@/app/router/navigation';
import { Toaster } from '@/shared/components/Toaster';

export function RootLayout() {
  return (
    <div className="flex min-h-full">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            OV
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-900">OVGS</p>
            <p className="text-xs text-slate-500">Ordens de Venda</p>
          </div>
        </div>

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
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                      activeProps={{
                        className: 'bg-brand-50 text-brand-700 hover:bg-brand-50',
                      }}
                    >
                      <item.icon className="size-4" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <h1 className="text-base font-semibold text-slate-900">
            Sistema de Gestão de Ordens de Venda
          </h1>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      <Toaster />
    </div>
  );
}
