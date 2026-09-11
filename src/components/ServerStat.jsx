import { useEffect, useRef, useState } from 'react'
import useJsonc from '../hooks/useJsonc'
import { copyText, useToast } from './Toast'
import { motdToHtml } from '../utils/motd'

const AUTO_REFRESH_SECONDS = 10

export default function ServerStat() {
  const config = useJsonc('/data/config.jsonc')
  const [inputValue, setInputValue] = useState('mc.ttfl.net')
  const [lastQuery, setLastQuery] = useState('')
  const [info, setInfo] = useState(null)
  const [fetchError, setFetchError] = useState(false)
  const [list, setList] = useState([])
  const [listDenied, setListDenied] = useState(false)
  const [countdown, setCountdown] = useState(AUTO_REFRESH_SECONDS)
  const showToast = useToast()

  // 输入框内容与上次实际查询的地址不一致时，说明用户修改了但还没点刷新，自动刷新暂停
  const paused = lastQuery !== '' && inputValue !== lastQuery

  const loadingRef = useRef(false)
  const pausedRef = useRef(paused)
  pausedRef.current = paused
  const lastQueryRef = useRef(lastQuery)
  lastQueryRef.current = lastQuery

  const getInfo = async (address) => {
    if (!address || loadingRef.current) return
    loadingRef.current = true
    try {
      const res = await fetch('https://eu.mc-api.net/v3/server/ping/' + encodeURIComponent(address))
      const data = await res.json()
      setInfo(data)
      setFetchError(false)

      const sample = data.players?.sample ?? []
      const clean = sample
        .filter((p) => !p.name.includes('§'))
        .map((p) => ({ name: p.name, uuid: p.id }))
      setList(clean)
      setListDenied(sample.length > 0 && clean.length === 0)
    } catch {
      setFetchError(true)
    } finally {
      loadingRef.current = false
      setCountdown(AUTO_REFRESH_SECONDS)
    }
  }

  // 配置加载完成后设置默认查询地址（含首次查询）
  useEffect(() => {
    if (config?.serverAddress && lastQuery === '') {
      setInputValue(config.serverAddress)
      setLastQuery(config.serverAddress)
    }
  }, [config?.serverAddress, lastQuery])

  // 查询地址变化时立即获取
  useEffect(() => {
    if (lastQuery) {
      getInfo(lastQuery)
    }
  }, [lastQuery])

  // 每 10 秒自动重新获取"上次查询的地址"；输入被修改且未点刷新时暂停
  useEffect(() => {
    const timer = setInterval(() => {
      if (pausedRef.current) return
      setCountdown((c) => {
        if (c <= 1) {
          getInfo(lastQueryRef.current)
          return AUTO_REFRESH_SECONDS
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const clickName = (player) => {
    copyText(player.name).then(() => {
      showToast('玩家名称已复制', 'success')
    })
    window.open('https://namemc.com/search?q=' + player.name)
  }

  const thClass = 'text-center whitespace-nowrap w-28 sm:w-1/5'

  return (
    <div>
      <div className="flex justify-end mb-3">
        <div className="flex items-center gap-2">
          <span className="badge badge-ghost badge-lg whitespace-nowrap">
            {paused ? '已暂停' : `${countdown}s 后刷新`}
          </span>
          <input
            type="text"
            className="input input-bordered input-lg text-base sm:text-xl w-52 sm:w-72"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setLastQuery(inputValue.trim())}
          />
          <button className="btn btn-primary btn-md whitespace-nowrap" onClick={() => setLastQuery(inputValue.trim())}>
            刷新
          </button>
        </div>
      </div>

      {fetchError ? (
        <div className="alert alert-warning">
          <span>! 无法从接口获取服务器数据, 可能是您的网络状况较差</span>
        </div>
      ) : info == null ? (
        <div className="flex justify-center py-6">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-300">
          <table className="table text-sm sm:text-base sm:table-fixed">
            <tbody>
              <tr>
                <th className={thClass}>服务器状态</th>
                <td>
                  {info.online ? (
                    <span className="badge badge-success badge-lg">在线</span>
                  ) : (
                    <span className="badge badge-error badge-lg">服务器离线</span>
                  )}
                </td>
              </tr>

              {info.online && (
                <tr>
                  <th className={thClass}>MOTD</th>
                  <td>
                    <div className="flex items-center gap-3">
                      {(info.favicon_base64 || info.favicon) && (
                        <img src={info.favicon_base64 ?? info.favicon} alt="icon" className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
                      )}
                      <span
                        className="whitespace-pre-wrap break-words text-left font-mono"
                        dangerouslySetInnerHTML={{ __html: motdToHtml(info.description ?? '') }}
                      />
                    </div>
                  </td>
                </tr>
              )}

              {info.online && (
                <tr>
                  <th className={thClass}>版本号</th>
                  <td>{info.version?.name}</td>
                </tr>
              )}

              {info.online && (
                <tr>
                  <th className={thClass}>检测玩家数</th>
                  <td>
                    {info.players?.online} / {info.players?.max}
                  </td>
                </tr>
              )}

              {info.online && (
                <tr>
                  <th className={thClass}>部分在线玩家</th>
                  <td>
                    {listDenied ? (
                      <span className="badge badge-error">
                        无法从第三方接口获取数据, 正在重试... (这不是服务器原因!)
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {list.map((player) => (
                          <button
                            key={player.name}
                            className="badge badge-outline badge-lg cursor-pointer hover:scale-110 transition-transform"
                            title={player.uuid ? `UUID: ${player.uuid}` : undefined}
                            onClick={() => clickName(player)}
                          >
                            {player.name}
                          </button>
                        ))}
                        {info.players && list.length < info.players.online && (
                          <span className="badge badge-ghost badge-lg">......</span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
