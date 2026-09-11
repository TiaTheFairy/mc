import { useState } from 'react'
import useJsonc from '../hooks/useJsonc'

function ChaptersCard({ title, data }) {
  const [openIndex, setOpenIndex] = useState(null)
  if (!data) return null

  return (
    <div className="card bg-base-100/80 backdrop-blur shadow-xl border border-base-content/10 rounded-[32px]">
      <div className="card-body p-4 sm:p-8">
        <h2 className="card-title text-2xl justify-start">
          <span className="text-gradient">{title ?? data.title}</span>
        </h2>
        <div className="w-full flex flex-col gap-1">
          {data.chapter?.map((chapter) => (
            <div
              key={chapter.index}
              className="collapse collapse-arrow bg-base-100 border border-base-content/10"
            >
              <input
                type="checkbox"
                checked={openIndex === chapter.index}
                onChange={(e) => setOpenIndex(e.target.checked ? chapter.index : null)}
              />
              <div className="collapse-title text-left text-sm sm:text-base">
                {chapter.index} 、 {chapter.name}
              </div>
              <div className="collapse-content">
                {chapter.item?.map((rule, i) => (
                  <p key={i} className="py-1 text-left">{rule}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function HistoryCard({ data }) {
  if (!data) return null

  return (
    <div className="card bg-base-100/80 backdrop-blur shadow-xl border border-base-content/10 rounded-[32px]">
      <div className="card-body p-4 sm:p-8">
        <h2 className="card-title text-2xl justify-start">
          <span className="text-gradient">{data.title}</span>
        </h2>
        {data.note && <p className="text-left text-sm opacity-70">{data.note}</p>}
        <div className="overflow-x-auto rounded-box border border-base-300">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>日期</th>
                <th>名称</th>
                <th>类型</th>
                <th>时间</th>
                <th>原因</th>
              </tr>
            </thead>
            <tbody>
              {data.data?.map((row) => (
                <tr key={row.name + row.date}>
                  <td>{row.date}</td>
                  <td>{row.name}</td>
                  <td>
                    <span className={`badge ${row.type === '封禁' ? 'badge-error' : 'badge-warning'}`}>
                      {row.type}
                    </span>
                  </td>
                  <td>{row.time}</td>
                  <td className="min-w-[150px]">{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function RulePage() {
  const ruleData = useJsonc('/data/rule.jsonc')
  const announcementData = useJsonc('/data/announcement.jsonc')
  const historyData = useJsonc('/data/history.jsonc')

  return (
    <div className="flex flex-col gap-6 mb-8 -mt-16">
      <ChaptersCard data={ruleData} />
      <ChaptersCard data={announcementData} />
      <HistoryCard data={historyData} />
    </div>
  )
}
