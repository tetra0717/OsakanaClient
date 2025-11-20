import { cookies } from "next/headers";
import { SearchParams } from "nuqs/server";
import { loadSearchParams } from "./search-params";
import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

// サーバーで外部APIにデータを送信するなどの処理を行う関数のダミー
async function sendDataToServer(combinedData: any) {
  console.log("--- [サーバー] 外部APIへHTTPリクエストを送信 ---");
  console.log("送信データ:", combinedData);
  // ここに実際の fetch API を使ったリクエスト処理を記述します
  // const response = await fetch('https://api.example.com/endpoint', { ... });
  return {
    success: true,
    message: "サーバーへのデータ送信が完了しました（シミュレーション）。",
  };
}

// このコンポーネントはサーバーサイドでレンダリングされます
export default async function ProcessPage({ searchParams }: PageProps) {
  console.log("\n--- ページB (サーバーコンポーネント) 処理開始 ---");

  const { nfcId } = await loadSearchParams(searchParams);

  console.log(`[サーバー] URLクエリからNFC IDを読み取りました: ${nfcId}`);

  // 2. Cookieからユーザーデータを読み取り
  const cookieStore = await cookies();
  const userDataCookie = cookieStore.get("userData");

  if (!userDataCookie) {
    console.log(
      "[サーバー] Cookieデータがないため、入力ページにリダイレクトします。",
    );
    redirect("/?error=session_expired");
  }

  let userData;
  try {
    // ★★★ tryブロックは、エラーの可能性があるJSONパースだけを囲む ★★★
    userData = JSON.parse(userDataCookie.value);
  } catch (e) {
    console.error("[サーバー] Cookieの解析に失敗しました。", e);
    redirect("/?error=cookie_error");
  }

  console.log("[サーバー] Cookieからユーザーデータを読み取りました:", userData);

  // ★★★ sendDataToServerもエラーの可能性があるのでtry...catchで囲むのが丁寧 ★★★
  try {
    await sendDataToServer({ nfcId, ...userData });
  } catch (apiError) {
    console.error("[サーバー] APIへのデータ送信に失敗しました。", apiError);
    redirect("/?error=api_failed");
  }

  // 処理が完了したら不要なCookieを削除
  console.log("[サーバー] 処理完了。成功ページにリダイレクトします。");

  // ★★★ redirect() は tryブロックの外で呼び出す ★★★
  const nameParam = encodeURIComponent(userData.name);
  redirect(`/?status=success&name=${nameParam}`);

  // redirectが実行されるため、この下のコードは実行されない
  return null;
}
