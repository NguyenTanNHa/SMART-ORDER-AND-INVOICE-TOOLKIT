import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'

export default function Layout() {
  const location = useLocation()

  return (
    <div className="flex bg-[#f8fafc] min-h-screen font-sans text-slate-900">
      <Sidebar />
      <main className="ml-[250px] flex-1 w-full min-h-screen relative overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-8 w-full h-full max-w-6xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
