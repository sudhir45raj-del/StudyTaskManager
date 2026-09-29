import React from "react";

function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-3 border-t border-slate-700 bg-slate-900 px-6 py-5 text-center text-sm text-slate-400 sm:flex-row sm:text-left">
      <p>
        © {new Date().getFullYear()} Study Task Manager
      </p>

      <p className="text-slate-500">
        Plan your work. Track your progress. Stay focused.
      </p>
    </footer>
  );
}

export default Footer;