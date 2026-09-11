import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import HeaderBar from './components/HeaderBar'
import FooterBar from './components/FooterBar'
import { ToastProvider } from './components/Toast'
import MainContent from './pages/MainContent'
import RulePage from './pages/RulePage'

const NAV_ITEMS = [
  { label: '关于', id: 'about' },
  { label: '游玩', id: 'about' },
  { label: '加入', id: 'join' },
  { label: '资讯', id: 'info' },
]

function Welcome() {
  const location = useLocation()
  const navigate = useNavigate()

  const scrollTo = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const jumpTo = (id) => {
    if (location.pathname === '/') {
      scrollTo(id)
    } else {
      navigate('/')
      // 等首页渲染出锚点元素后再滚动
      setTimeout(() => scrollTo(id), 100)
    }
  }

  return (
    <div className="relative pt-[140px] sm:pt-[180px] pb-[90px] bg-cover bg-center bg-no-repeat">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/background.png')" }}
      />
      {/* 渐变遮罩：保证文字可读，并与下方内容自然衔接 */}
      <div className="absolute inset-0 bg-gradient-to-b from-base-100/70 via-base-100/20 to-base-100" />

      <div className="relative">
        <h1
          className="font-bold text-[rgb(194,255,182)] leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)] text-[clamp(2.5rem,9vw,6.25rem)]"
          style={{ fontFamily: "'blankspot-owlw4'" }}
        >
          Tia The Fairy Land
        </h1>

        <div className="mt-6 font-extrabold text-[rgb(115,250,227)] drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] text-lg sm:text-2xl md:text-3xl">
          <p>Fairy Land</p>
          <p>Gaming &amp; Coding</p>
        </div>

        <nav className="mt-10 flex flex-wrap justify-center gap-x-4 gap-y-2 sm:gap-x-8">
          {NAV_ITEMS.map((item) => (
            <span
              key={item.label}
              className="text-base sm:text-xl md:text-[23px] text-sky-300 cursor-pointer hover:text-blue-500 hover:underline hover:font-bold transition-colors"
              onClick={() => jumpTo(item.id)}
            >
              {item.label}
            </span>
          ))}
        </nav>
      </div>
    </div>
  )
}

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderBar />
      <Welcome />
      <div className="flex-1 w-full max-w-5xl mx-auto px-4">
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/rule" element={<RulePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <FooterBar />
    </div>
  )
}

export default function App() {
  useEffect(() => {
    document.title = 'FairyLand -- 欢迎来到我的世界'
  }, [])

  return (
    <ToastProvider>
      <Layout />
    </ToastProvider>
  )
}
