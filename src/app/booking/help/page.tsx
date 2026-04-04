export default function HelpPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">&#128218;&#10068;</div>
        <h1 className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>ヘルプ・よくある質問</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>予約に関する疑問はこちらで解決！</p>
      </div>

      <div className="space-y-4">
        {/* 予約について */}
        <section className="bg-white rounded-2xl p-6 shadow-md" style={{ border: "3px solid var(--border)" }}>
          <h2 className="font-extrabold text-lg mb-4 flex items-center gap-2" style={{ color: "var(--primary-dark)" }}>
            <span className="text-2xl">&#128197;</span> 予約について
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-extrabold mb-1" style={{ color: "var(--text)" }}>Q. 何回まで予約できますか？</h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                1ヶ月に最大2回まで予約できます。1回目の枠から1つ、2回目の枠から1つ、それぞれ予約が可能です。
              </p>
            </div>
            <div>
              <h3 className="font-extrabold mb-1" style={{ color: "var(--text)" }}>Q. 1枠の定員は何名ですか？</h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                1枠あたり最大12名です。定員に達した枠は「満席」と表示され、予約できなくなります。
              </p>
            </div>
            <div>
              <h3 className="font-extrabold mb-1" style={{ color: "var(--text)" }}>Q. 予約に必要な情報は？</h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                メールアドレス、名前、部屋名（所属グループ名）の3つが必要です。
              </p>
            </div>
          </div>
        </section>

        {/* キャンセル・変更 */}
        <section className="bg-white rounded-2xl p-6 shadow-md" style={{ border: "3px solid var(--border)" }}>
          <h2 className="font-extrabold text-lg mb-4 flex items-center gap-2" style={{ color: "var(--primary-dark)" }}>
            <span className="text-2xl">&#128260;</span> キャンセル・変更
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-extrabold mb-1" style={{ color: "var(--text)" }}>Q. キャンセルはいつまでできますか？</h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                開催日の前日まで（前日の24時まで）キャンセル可能です。当日のキャンセルはできません。
              </p>
            </div>
            <div>
              <h3 className="font-extrabold mb-1" style={{ color: "var(--text)" }}>Q. キャンセル後に再予約できますか？</h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                はい、できます。キャンセル後、同じ回（1回目 or 2回目）の別の枠に空きがあれば再予約可能です。
              </p>
            </div>
            <div>
              <h3 className="font-extrabold mb-1" style={{ color: "var(--text)" }}>Q. 予約した枠の変更はできますか？</h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                直接の変更はできません。一度キャンセルしてから、別の枠に再予約してください。
              </p>
            </div>
          </div>
        </section>

        {/* 予約確認・参加 */}
        <section className="bg-white rounded-2xl p-6 shadow-md" style={{ border: "3px solid var(--border)" }}>
          <h2 className="font-extrabold text-lg mb-4 flex items-center gap-2" style={{ color: "var(--primary-dark)" }}>
            <span className="text-2xl">&#128187;</span> 予約確認・参加
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-extrabold mb-1" style={{ color: "var(--text)" }}>Q. Zoomリンクはどこで確認できますか？</h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                予約完了時に表示されます。また、ヘッダーの「予約確認」からメールアドレスを入力すると、いつでもZoomリンク・ID・パスコードを確認できます。
              </p>
            </div>
            <div>
              <h3 className="font-extrabold mb-1" style={{ color: "var(--text)" }}>Q. 予約したのに枠が表示されません</h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                開催日時を過ぎた枠は一覧から非表示になります。予約確認ページからはメールアドレスで過去の予約も確認できます。
              </p>
            </div>
            <div>
              <h3 className="font-extrabold mb-1" style={{ color: "var(--text)" }}>Q. 当日の参加方法は？</h3>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                予約確認ページの「ここから参加する」ボタンをクリックするか、表示されているZoom IDとパスコードを使ってZoomに参加してください。
              </p>
            </div>
          </div>
        </section>

        {/* お問い合わせ */}
        <section className="rounded-2xl p-6 shadow-md" style={{ background: "var(--accent-light)", border: "3px solid var(--accent)" }}>
          <h2 className="font-extrabold text-lg mb-2 flex items-center gap-2" style={{ color: "var(--text)" }}>
            <span className="text-2xl">&#128172;</span> その他のお問い合わせ
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            上記で解決しない場合は、LINEオープンチャットまたは担当講師にお問い合わせください。
          </p>
        </section>
      </div>
    </div>
  );
}
