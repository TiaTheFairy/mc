import { Link } from 'react-router-dom'
import useJsonc from '../hooks/useJsonc'
import ServerStat from '../components/ServerStat'
import { copyText, useToast } from '../components/Toast'

function SectionHeading({ title, subtitle }) {
  return (
    <div className="text-left mb-6">
      <h2 className="text-2xl sm:text-3xl font-bold">
        <span className="text-gradient">{title}</span>
      </h2>
      {subtitle && <p className="opacity-60 mt-1 text-sm sm:text-base">{subtitle}</p>}
    </div>
  )
}

function ActionCard({ icon, title, desc, onClick, to }) {
  const body = (
    <>
      <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
        <img src={icon} alt={title} className="w-9 h-9 sm:w-11 sm:h-11 drop-shadow" />
      </div>
      <div className="text-left min-w-0">
        <h3 className="font-bold text-base sm:text-lg leading-tight">{title}</h3>
        <p className="text-xs sm:text-sm opacity-60 mt-1 truncate">{desc}</p>
      </div>
    </>
  )

  const cls =
    'group card-lift flex items-center gap-4 rounded-2xl border border-base-content/10 bg-base-200/70 px-5 py-4 cursor-pointer text-left w-full'

  if (to) {
    return (
      <Link to={to} className={cls}>
        {body}
      </Link>
    )
  }
  return (
    <div className={cls} onClick={onClick} role="button">
      {body}
    </div>
  )
}

export default function MainContent() {
  const config = useJsonc('/data/config.jsonc')
  const showToast = useToast()
  const links = config?.links ?? {}
  const serverAddress = config?.serverAddress ?? 'mc.ttfl.net'

  const copyMC = () => {
    copyText(serverAddress).then(() => {
      showToast('服务器地址已复制', 'success')
    })
  }

  const openLink = (link) => {
    if (!link) {
      showToast('该网站还未做解析呢', 'warning')
    } else {
      window.open(link)
    }
  }

  const joinCards = [
    {
      icon: '/images/minecraft.png',
      title: '直接连接服务器',
      desc: `点击复制地址 ${serverAddress}`,
      onClick: copyMC,
    },
    {
      icon: '/images/qq.png',
      title: 'QQ交流群',
      desc: '加入社区，一起开黑',
      onClick: () => openLink(config?.qqJoinLink),
    },
    {
      icon: '/images/bilibili.png',
      title: 'Bilibili',
      desc: '观看服务器精彩视频',
      onClick: () => openLink(links.bilibili),
    },
  ]

  const infoCards = [
    {
      icon: '/images/wiki.png',
      title: '服务器百科',
      desc: '查阅服务器资料与教程',
      onClick: () => openLink(links.wiki),
    },
    {
      icon: '/images/rule.png',
      title: '服务器守则',
      desc: '游玩前请先阅读规范',
      to: '/rule',
    },
    {
      icon: '/images/donate.png',
      title: '服务器赞助',
      desc: '支持服务器持续运营',
      onClick: () => openLink(links.donate),
    },
    {
      icon: '/images/map.png',
      title: '服务器地图',
      desc: '浏览世界在线地图',
      onClick: () => openLink(links.map),
    },
  ]

  const features = [
    { icon: '/images/minecraft.png', label: '正版验证' },
    { icon: '/images/free.png', label: '公益免费' },
    { icon: '/images/java.png', label: 'Java 1.20' },
  ]

  return (
    <div className="card bg-base-100/80 backdrop-blur shadow-xl mb-8 -mt-16 rounded-[32px] p-4 sm:p-8 border border-base-content/10">
      {/* 关于 */}
      <section id="about" className="flex flex-col md:flex-row items-center gap-8 py-6">
        <div className="flex-1 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-3 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-[36px] blur-xl" />
            <img
              src="/images/logoicon.png"
              alt="logo"
              className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-[28px] border border-primary/20"
            />
          </div>
        </div>

        <div className="flex-1 text-left w-full">
          <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
            <span className="text-gradient">Fairy Land</span>
            <span className="opacity-80"> | Minecraft服务器</span>
          </h1>
          <p className="text-base sm:text-xl mt-3 opacity-70">优质正版公益服务器</p>

          <div className="flex flex-wrap gap-3 mt-6">
            {features.map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-3 rounded-xl bg-base-200 border border-base-content/10 px-4 py-3"
              >
                <img src={f.icon} alt={f.label} className="w-8 h-8" />
                <span className="font-semibold text-sm sm:text-base whitespace-nowrap">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider opacity-40" />

      {/* 游玩 */}
      <section id="play" className="py-4">
        <SectionHeading title="服务器状态" subtitle="实时查询服务器在线情况" />
        <ServerStat />
      </section>

      <div className="divider opacity-40" />

      {/* 加入 */}
      <section id="join" className="py-4">
        <SectionHeading title="立即加入" subtitle="三种方式开启你的冒险" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {joinCards.map((card) => (
            <ActionCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      <div className="divider opacity-40" />

      {/* 资讯 */}
      <section id="info" className="py-4">
        <SectionHeading title="了解更多" subtitle="百科、守则、赞助与地图" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {infoCards.map((card) => (
            <ActionCard key={card.title} {...card} />
          ))}
        </div>
      </section>
    </div>
  )
}
