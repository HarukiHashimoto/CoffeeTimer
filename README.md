# Coffee Timer

コーヒーを美味しく淹れるためのレシピ管理＆抽出タイマーアプリ

## 主な機能

- コーヒー抽出レシピの一覧表示・詳細閲覧
- レシピごとの抽出タイマー機能
- オリジナル（カスタム）レシピの作成・編集・削除
- 「4:6メソッド」レシピのカスタマイズ
- ライト／ダークテーマ切り替え

## インストール・起動方法

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3333](http://localhost:3333) を開いてください。

## 使い方

### レシピを見る

- トップページの「Recipes」から、用意されたコーヒーレシピを一覧で確認できます。
- レシピをクリックすると、詳細や手順を確認できます。

### タイマー機能

- 「Timer」ページで、選択したレシピの手順に沿ってタイマーを進行できます。
- 各ステップの進行状況やお湯の量なども表示されます。

### カスタムレシピ

1. 「Recipes」ページの「カスタムレシピを追加」ボタンから、自分だけのレシピを作成できます。
2. 抽出量・豆量・手順（ステップ）・攪拌や注湯のタイミングなどを自由に設定できます。
3. 作成したレシピは一覧に追加され、編集・削除も可能です。
4. カスタムレシピもタイマーで利用できます。

### 4:6メソッドのカスタマイズ

- 「4:6メソッド」レシピは、抽出比率や注湯配分などをカスタマイズしてタイマーに反映できます。

### テーマ切り替え

- 画面右上のボタンで、ライト／ダークテーマを切り替えられます。

## 技術スタック

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
