# 勤務表入力ウィザード

tokyoobs-office.jp への日次勤怠入力を、スマホでステップ形式で楽にするためのアプリ。

## 構成

- `index.html` — ウィザード本体（単一HTMLファイル、`localStorage`にデータを保存）
- `bookmarklet.js` — 実際の勤怠ページ（`kinmu.php`）で今日の現場名を自動抽出し、ウィザードへ渡すブックマークレット（コメント付き・可読版）
- `bookmarklet.min.txt` — 上記を1行に圧縮した `javascript:...` 形式（ブックマーク登録用）

## 今回のスコープ

- ✅ 日付・現場（自動プリセット）→ 開始/終了時間 → 電車/TAXI/泊 をステップ形式で入力し、端末内に保存・一覧・編集・削除・コピー(エクスポート)
- ❌ tokyoobs-office.jp への自動保存（自動送信）は未実装。次のステップとして、まずは今回の内容をもとにユーザーが手動でサイトに反映する運用

## セットアップ手順

### 1. GitHub Pagesで公開する

このマシンには `gh` コマンドが入っていなかったため、以下は手動で行ってください（このリポジトリはあなたのGitHubアカウントに紐づくため、認証が必要な操作は代行できません）。

```bash
cd "勤務表入力アプリ"
git init
git add index.html bookmarklet.js bookmarklet.min.txt README.md
git commit -m "勤務表入力ウィザードアプリを追加"
```

その後、GitHub上で新しい空リポジトリを作成し（例: `kinmu-wizard`）、表示される案内に従って:

```bash
git remote add origin https://github.com/<あなたのユーザー名>/<リポジトリ名>.git
git branch -M main
git push -u origin main
```

GitHubのリポジトリ設定 → Pages で、公開ブランチを `main` / `/ (root)` に設定すると、
`https://<あなたのユーザー名>.github.io/<リポジトリ名>/` でアプリにアクセスできるようになります。

### 2. ブックマークレットを設定する

1. `bookmarklet.js` の `WIZARD_URL` を、上で取得した実際のURLに書き換える
2. `bookmarklet.min.txt` を再生成する（下記コマンド、またはClaudeに依頼）
3. スマホのブラウザで新しいブックマークを作成し、URL欄に `bookmarklet.min.txt` の中身をそのまま貼り付けて保存する

再生成コマンド:
```bash
python3 -c "
with open('bookmarklet.js') as f:
    src = f.read()
lines = [l for l in src.split(chr(10)) if not l.strip().startswith('//') and l.strip() != '']
code = ' '.join(l.strip() for l in lines)
with open('bookmarklet.min.txt', 'w') as f:
    f.write('javascript:' + code)
"
```

### 3. 毎日の使い方

1. スマホで `tokyoobs-office.jp/time_card/kinmu.php` を開く（ログイン済みの状態）
2. 保存したブックマークレットをタップ → 今日の現場名を自動抽出してウィザードへ移動
3. 開始/終了時間・電車/TAXI/泊を選んで保存
4. 実際にサイトへ反映する際は、ウィザードの「履歴」タブの内容を見ながら手動でkinmu.phpに入力する（自動送信は次のステップで対応）

## 既知の注意点

- `bookmarklet.js` の現場名抽出ロジックは、テーブルの1列目=日付・2列目=業務名という前提。実際の`kinmu.php`のDOM構造で動作しない場合は調整が必要（未確認のため、`kinmu.php`のHTMLソースが確認でき次第、精度を上げられます）
- ウィザードのデータは端末の`localStorage`に保存されるため、ブラウザのデータを消去すると記録も消える
