"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// フォームの入力データを検証し、Cookieに保存するServer Action
export async function saveDataToCookie(formData: FormData) {
  const name = formData.get("name") as string;
  const quantity = formData.get("quantity") as string;

  if (!name || !quantity) {
    // この例ではエラー処理を簡略化していますが、実際には状態管理ライブラリなどでエラーメッセージを返すと良いでしょう
    throw new Error("名前と数字の両方を入力してください。");
  }

  const dataToSave = {
    name,
    quantity: parseInt(quantity, 10),
  };

  const cookieStore = await cookies();

  // CookieにデータをJSON形式で保存
  cookieStore.set("userData", JSON.stringify(dataToSave), {
    httpOnly: true, // JavaScriptからのアクセスを防ぎ、セキュリティを高める
    secure: process.env.NODE_ENV === "production", // 本番環境ではHTTPS接続時のみCookieを送信
    maxAge: 60 * 5, // 5分間有効
    path: "/",
  });

  // 保存が完了したことをユーザーに知らせるため、リダイレクトやメッセージ表示が考えられますが、
  // 今回はクライアント側でメッセージを表示するため、ここでは何もしません。
  // または redirect('/save-success'); のようにページ遷移させることも可能です。
}
