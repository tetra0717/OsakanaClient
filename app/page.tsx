import { InputForm } from "./_components/InputForm";
import { SearchParams } from "nuqs/server";
import { loadSearchParams } from "./process/search-params";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

function StatusMessage({ status, error }: { status?: string; error?: string }) {
  if (status === "success") {
    return (
      <p style={{ color: "green", border: "1px solid green", padding: "1rem" }}>
        NFC連携処理が正常に完了しました！
      </p>
    );
  }
  if (error) {
    const errorMessage =
      error === "session_expired"
        ? "セッションが切れました。再度入力してください。"
        : "処理に失敗しました。";
    return (
      <p style={{ color: "red", border: "1px solid red", padding: "1rem" }}>
        {errorMessage}
      </p>
    );
  }
  return null;
}

export default async function HomePage({ searchParams }: PageProps) {
  const { name, status, error } = await loadSearchParams(searchParams);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>情報入力</h1>

      <StatusMessage status={status as string} error={error as string} />

      <InputForm initialName={name as string | undefined} />
    </main>
  );
}
