export default function FooterBar() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer footer-center bg-base-300/80 text-base-content p-6 border-t border-base-content/10">
      <div>
        <img src="/images/logoicon.png" alt="logo" className="w-[30px] h-[30px] inline-block" />
      </div>
      <div>
        <p className="text-sm opacity-70">版权所有: © 2016-{currentYear} ttfl.net 版权所有</p>
      </div>
    </footer>
  )
}
