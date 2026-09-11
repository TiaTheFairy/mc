import { useCallback, useEffect, useRef, useState } from 'react'
import { parse } from 'jsonc-parser'

const cache = new Map()

/**
 * 运行时加载 public/data 下的 jsonc 配置文件。
 * 因为文件是构建后原样发布的静态资源，直接修改 dist/data 下的文件
 * 并刷新页面即可生效，无需重新构建（热修改）。
 */
export default function useJsonc(path) {
  const [data, setData] = useState(cache.get(path) ?? null)
  const mounted = useRef(true)

  const load = useCallback(() => {
    fetch(path, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.text()
      })
      .then((text) => {
        const parsed = parse(text)
        if (parsed === undefined) throw new Error('jsonc 解析失败')
        cache.set(path, parsed)
        if (mounted.current) setData(parsed)
      })
      .catch((err) => {
        console.error(`加载 ${path} 失败:`, err)
      })
  }, [path])

  useEffect(() => {
    mounted.current = true
    load()
    return () => {
      mounted.current = false
    }
  }, [load])

  return data
}
