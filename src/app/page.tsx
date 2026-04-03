import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-full flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(160deg, #2E7D32 0%, #4CAF50 40%, #8BC34A 100%)" }}>
        <div className="max-w-4xl mx-auto px-6 py-20 text-center relative z-10">
          <span
            className="inline-block text-xs font-extrabold tracking-widest mb-4 px-5 py-2 rounded-full shadow-md"
            style={{ background: "#F5C518", color: "#1B3A1B" }}
          >
            GROUP CONSULTING
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4" style={{ color: "#ffffff" }}>
            グループコンサルで
            <br />
            ビジネスを加速させよう
          </h1>
          <p className="text-lg mb-8 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.9)" }}>
            仲間と一緒に学び、プロの講師からフィードバックを受けて、あなたのビジネスを次のステージへ。
          </p>
          <div className="flex flex-col gap-4 sm:flex-row justify-center">
            <Link
              href="/booking"
              className="flex h-14 items-center justify-center rounded-full px-10 font-extrabold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              style={{ background: "#F5C518", color: "#1B3A1B" }}
            >
              予約する
            </Link>
            <Link
              href="/booking/my-bookings"
              className="flex h-14 items-center justify-center rounded-full px-10 font-extrabold text-lg transition-all hover:scale-105"
              style={{ background: "rgba(255,255,255,0.2)", color: "#ffffff", border: "2px solid rgba(255,255,255,0.5)" }}
            >
              予約を確認する
            </Link>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10" style={{ background: "#ffffff" }} />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-10" style={{ background: "#ffffff" }} />
      </section>

      {/* Features Section */}
      <section className="py-16 px-6" style={{ background: "var(--bg)" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-center mb-12" style={{ color: "var(--text)" }}>
            グループコンサルの
            <span style={{ color: "var(--primary)" }}>3つの特徴</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-all" style={{ border: "3px solid var(--border)" }}>
              <div className="text-5xl mb-4">&#128101;</div>
              <h3 className="font-extrabold text-lg mb-2" style={{ color: "var(--text)" }}>少人数制</h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                1枠最大12名の少人数制。一人ひとりに寄り添ったアドバイスが受けられます。
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-all" style={{ border: "3px solid var(--border)" }}>
              <div className="text-5xl mb-4">&#128218;</div>
              <h3 className="font-extrabold text-lg mb-2" style={{ color: "var(--text)" }}>隔週開催</h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                第2週・第4週に開催。継続的に学び、実践を繰り返すことで成長を実感。
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-lg transition-all" style={{ border: "3px solid var(--border)" }}>
              <div className="text-5xl mb-4">&#128640;</div>
              <h3 className="font-extrabold text-lg mb-2" style={{ color: "var(--text)" }}>即実践</h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                その場で課題を解決し、すぐにビジネスに活かせるアクションプランを策定。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6" style={{ background: "var(--bg2)" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-center mb-12" style={{ color: "var(--text)" }}>
            予約の
            <span style={{ color: "var(--primary)" }}>流れ</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-4">
            {[
              { step: "1", icon: "&#128197;", title: "枠を選ぶ", desc: "空いている日時を選択" },
              { step: "2", icon: "&#9997;", title: "情報を入力", desc: "名前・メール・部屋名" },
              { step: "3", icon: "&#9989;", title: "予約完了", desc: "Zoomリンクを受け取る" },
              { step: "4", icon: "&#127912;", title: "参加！", desc: "当日Zoomで参加" },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md text-3xl"
                  style={{ background: "var(--primary)", color: "#ffffff" }}
                  dangerouslySetInnerHTML={{ __html: icon }}
                />
                <div className="text-xs font-extrabold mb-1 px-2 py-0.5 rounded-full inline-block" style={{ background: "var(--accent)", color: "var(--text)" }}>
                  STEP {step}
                </div>
                <h3 className="font-extrabold mt-1" style={{ color: "var(--text)" }}>{title}</h3>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center" style={{ background: "linear-gradient(135deg, #388E3C, #4CAF50)" }}>
        <div className="max-w-lg mx-auto">
          <h2 className="text-3xl font-extrabold mb-4" style={{ color: "#ffffff" }}>
            さあ、予約しよう！
          </h2>
          <p className="mb-8" style={{ color: "rgba(255,255,255,0.9)" }}>
            次のグループコンサルに参加して、あなたのビジネスを一歩前へ進めましょう。
          </p>
          <Link
            href="/booking"
            className="inline-flex h-14 items-center justify-center rounded-full px-12 font-extrabold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            style={{ background: "#F5C518", color: "#1B3A1B" }}
          >
            予約ページへ
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 text-center" style={{ background: "#1B3A1B" }}>
        <Link href="/admin" className="text-sm hover:underline" style={{ color: "rgba(255,255,255,0.5)" }}>
          管理者ログイン
        </Link>
      </footer>
    </div>
  );
}
