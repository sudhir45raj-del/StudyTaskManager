function Header() {
  return (
    <header className="border-b border-slate-700 bg-slate-900 px-5 py-4 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        {/* App name */}
        <a
          href="#dashboard"
          className="text-xl font-bold tracking-wide text-white transition hover:text-cyan-400"
        >
          Study<span className="text-cyan-400">Task</span>
        </a>

        {/* Navigation */}
        <nav className="flex items-center gap-5 text-sm font-medium">
          <a
            href="#dashboard"
            className="text-slate-300 transition hover:text-cyan-400"
          >
            Dashboard
          </a>

          <a
            href="#tasks"
            className="text-slate-300 transition hover:text-cyan-400"
          >
            My Tasks
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header;