import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useJsonc from '../hooks/useJsonc'
import { useToast } from './Toast'

export default function HeaderBar() {
  const config = useJsonc('/data/config.jsonc')
  const [headerHeight, setHeaderHeight] = useState(70)
  const showToast = useToast()

  useEffect(() => {
    const headerScroll = () => {
      const scrollTop = window.scrollY
      if (scrollTop <= 200) {
        setHeaderHeight(70)
      } else if (scrollTop > 200 && scrollTop < 400) {
        setHeaderHeight(48)
      } else {
        setHeaderHeight(0)
      }
    }
    window.addEventListener('scroll', headerScroll)
    return () => window.removeEventListener('scroll', headerScroll)
  }, [])

  const gotoLink = (target) => {
    if (!target) {
      showToast('该网站还未做解析呢', 'warning')
    } else {
      window.open(target)
    }
  }

  const links = config?.links ?? {}

  const linkItemClass =
    'cursor-pointer text-sm sm:text-lg hover:underline hover:font-bold px-2 whitespace-nowrap'

  const navEntries = [
    { label: '地图', target: links.map },
    { label: '文档', target: links.wiki },
    { label: 'NameMC', target: links.namemc, inDropdownOnly: false },
    { label: 'Minecraft', target: links.minecraft },
    { label: '个人主页', target: links.personalHomepage },
  ]

  return (
    <div
      className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 sm:px-5 bg-base-300/90 backdrop-blur-md border-b border-base-content/10 transition-[height] duration-300 overflow-visible"
      style={{ height: headerHeight + 'px', display: headerHeight === 0 ? 'none' : 'flex' }}
    >
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <img src="/images/logoicon.png" alt="logo" className="w-[30px] h-[30px]" />
        <span className="text-lg font-bold">TTFL</span>
      </Link>

      {/* 桌面端导航 */}
      <nav className="hidden md:flex items-center">
        <span className={linkItemClass} onClick={() => gotoLink(links.map)}>地图</span>
        <span className={linkItemClass} onClick={() => gotoLink(links.wiki)}>文档</span>

        <div className="dropdown dropdown-end dropdown-hover">
          <div tabIndex={0} role="button" className={`${linkItemClass} flex items-center gap-1`}>
            相关链接
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <ul tabIndex={0} className="dropdown-content menu bg-base-200 rounded-box shadow-lg w-40 mt-1 border border-base-content/10">
            <li onClick={() => gotoLink(links.namemc)}><a>NameMC</a></li>
            <li onClick={() => gotoLink(links.minecraft)}><a>Minecraft</a></li>
          </ul>
        </div>

        <span className={linkItemClass} onClick={() => gotoLink(links.personalHomepage)}>
          个人主页
        </span>
      </nav>

      {/* 移动端汉堡菜单 */}
      <div className="md:hidden dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
        <ul tabIndex={0} className="dropdown-content menu bg-base-200 rounded-box shadow-lg w-48 mt-2 border border-base-content/10 z-50">
          {navEntries.map((entry) => (
            <li key={entry.label} onClick={() => gotoLink(entry.target)}>
              <a>{entry.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
