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
                月2回開催。継続的に学び、実践を繰り返すことで成長を実感。
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

      {/* 予約・キャンセルの注意点 */}
      <section className="py-16 px-6" style={{ background: "#ffffff" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-center mb-12" style={{ color: "var(--text)" }}>
            予約・キャンセルの
            <span style={{ color: "var(--primary)" }}>ルール</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl p-6 shadow-md" style={{ background: "var(--bg)", border: "3px solid var(--border)" }}>
              <h3 className="font-extrabold text-lg mb-4 flex items-center gap-2" style={{ color: "var(--primary-dark)" }}>
                <span className="text-2xl">&#128197;</span> 予約について
              </h3>
              <ul className="space-y-3 text-sm" style={{ color: "var(--text-muted)" }}>
                <li className="flex items-start gap-2">
                  <span className="font-extrabold text-lg" style={{ color: "var(--accent)" }}>&#10003;</span>
                  <span>1回目・2回目からそれぞれ<strong className="font-extrabold" style={{ color: "var(--text)" }}>1人1枠まで</strong>予約OK</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-extrabold text-lg" style={{ color: "var(--accent)" }}>&#10003;</span>
                  <span>1枠の定員は<strong className="font-extrabold" style={{ color: "var(--text)" }}>最大12名</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-extrabold text-lg" style={{ color: "var(--accent)" }}>&#10003;</span>
                  <span>メールアドレス・名前・部屋名を入力するだけ</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-extrabold text-lg" style={{ color: "var(--accent)" }}>&#10003;</span>
                  <span>予約後すぐに<strong className="font-extrabold" style={{ color: "var(--text)" }}>Zoomリンク</strong>が表示されます</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl p-6 shadow-md" style={{ background: "var(--bg)", border: "3px solid var(--border)" }}>
              <h3 className="font-extrabold text-lg mb-4 flex items-center gap-2" style={{ color: "var(--primary-dark)" }}>
                <span className="text-2xl">&#128260;</span> キャンセルについて
              </h3>
              <ul className="space-y-3 text-sm" style={{ color: "var(--text-muted)" }}>
                <li className="flex items-start gap-2">
                  <span className="font-extrabold text-lg" style={{ color: "var(--accent)" }}>&#10003;</span>
                  <span>キャンセルは<strong className="font-extrabold" style={{ color: "var(--text)" }}>開催前日まで</strong>可能</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-extrabold text-lg" style={{ color: "var(--accent)" }}>&#10003;</span>
                  <span><strong className="font-extrabold" style={{ color: "var(--text)" }}>当日のキャンセルは不可</strong>です</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-extrabold text-lg" style={{ color: "var(--accent)" }}>&#10003;</span>
                  <span>キャンセル後は別の枠に<strong className="font-extrabold" style={{ color: "var(--text)" }}>再予約OK</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-extrabold text-lg" style={{ color: "var(--accent)" }}>&#10003;</span>
                  <span>「予約確認」ページからいつでもキャンセルできます</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Zoomリンク確認方法 */}
          <div className="mt-6 rounded-2xl p-6 shadow-md" style={{ background: "var(--accent-light)", border: "3px solid var(--accent)" }}>
            <h3 className="font-extrabold text-lg mb-4 flex items-center gap-2" style={{ color: "var(--text)" }}>
              <span className="text-2xl">&#128187;</span> 参加Zoomリンクの確認方法
            </h3>
            <div className="grid gap-4 sm:grid-cols-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="font-extrabold text-xl rounded-full w-8 h-8 flex items-center justify-center shrink-0" style={{ background: "var(--primary)", color: "#ffffff" }}>1</span>
                <div>
                  <p className="font-extrabold" style={{ color: "var(--text)" }}>予約完了時</p>
                  <p style={{ color: "var(--text-muted)" }}>予約後の完了画面にZoomリンク・ID・パスコードが表示されます</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-extrabold text-xl rounded-full w-8 h-8 flex items-center justify-center shrink-0" style={{ background: "var(--primary)", color: "#ffffff" }}>2</span>
                <div>
                  <p className="font-extrabold" style={{ color: "var(--text)" }}>予約確認ページ</p>
                  <p style={{ color: "var(--text-muted)" }}>メールアドレスを入力すると、いつでもZoomリンクを再確認できます</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-extrabold text-xl rounded-full w-8 h-8 flex items-center justify-center shrink-0" style={{ background: "var(--primary)", color: "#ffffff" }}>3</span>
                <div>
                  <p className="font-extrabold" style={{ color: "var(--text)" }}>ワンクリック参加</p>
                  <p style={{ color: "var(--text-muted)" }}>「ここから参加する」ボタンで直接Zoomに入れます</p>
                </div>
              </div>
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
          <div className="grid gap-6 sm:grid-cols-5">
            {[
              { step: "1", icon: "&#128197;", title: "枠を選ぶ", desc: "空いている日時を選択" },
              { step: "2", icon: "&#9997;", title: "情報を入力", desc: "名前・メール・部屋名" },
              { step: "3", icon: "&#9989;", title: "予約完了", desc: "Zoomリンクを受け取る" },
              { step: "4", icon: "&#128187;", title: "参加！", desc: "当日Zoomで参加" },
              { step: "5", icon: "&#128221;", title: "アンケート回答", desc: "参加後にアンケートに回答" },
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
      <footer className="py-6 px-6 text-center flex justify-center gap-6" style={{ background: "#1B3A1B" }}>
        <Link href="/booking/help" className="text-sm hover:underline" style={{ color: "rgba(255,255,255,0.7)" }}>
          ヘルプ
        </Link>
        <Link href="/admin" className="text-sm hover:underline" style={{ color: "rgba(255,255,255,0.5)" }}>
          管理者ログイン
        </Link>
      </footer>
    </div>
  );
}
