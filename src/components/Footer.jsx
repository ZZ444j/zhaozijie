import { FaHeart } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-primary/10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
        <p>© {new Date().getFullYear()} Portfolio. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Built with <FaHeart className="text-red-400" size={12} /> using React & Framer Motion
        </p>
      </div>
    </footer>
  )
}
