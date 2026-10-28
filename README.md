# Vital Dog

愛犬の健康データを家族で見守るノート。PWA対応のWebアプリです。

## 主な画面・機能

- **オンボーディング / 犬の登録** — 愛犬のプロフィールを登録（写真が未登録の場合は頭文字や犬のシルエットで表示）
- **ようす** — 愛犬の様子を確認する画面
- **きろく** — 健康に関する記録をつける画面
- **おもいで** — 思い出の記録（詳細表示・編集・削除に対応）
- **せってい** — 各種設定とヘルプページ
- ナビゲーションから犬を切り替えて表示できます

## 技術スタック

- React 19 + TypeScript
- Vite 8
- vite-plugin-pwa（PWA対応）
- ESLint

## セットアップ

```bash
npm install
npm run dev
```

> `vite-plugin-pwa` との互換性のため、`.npmrc` で `legacy-peer-deps` を有効にしています。

## スクリプト

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 型チェック（`tsc -b`）＋本番ビルド |
| `npm run preview` | ビルド結果をプレビュー |
| `npm run lint` | ESLintを実行 |

## ディレクトリ構成

```
src/
├── App.tsx
├── main.tsx
├── screens/      # ようす / きろく / おもいで / せってい / ヘルプ など
├── components/
├── hooks/
├── types/
└── utils/
```

## ブランチについて

デフォルトブランチは `master` です。かつて `main` にのみ入っていた最新コミット（nav dog icon with selector）は、PR #1 で `master` に統合済みです。
