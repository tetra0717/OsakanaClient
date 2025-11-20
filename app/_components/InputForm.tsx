"use client";

import { useState } from "react";
import { saveDataToCookie } from "@/app/actions";

type InputFormProps = {
  initialName?: string;
};

export function InputForm({ initialName }: InputFormProps) {
  const [name, setName] = useState(initialName || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const formData = new FormData(event.currentTarget);

    try {
      await saveDataToCookie(formData);
      setMessage("データを保存しました。NFCタグをスキャンしてください。");
    } catch (error) {
      setMessage(`エラー: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: "400px",
      }}
    >
      <div>
        <label
          htmlFor="name"
          style={{ display: "block", marginBottom: "0.5rem" }}
        >
          名前:
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>
      <div>
        <label
          htmlFor="quantity"
          style={{ display: "block", marginBottom: "0.5rem" }}
        >
          数字:
        </label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          required
          style={{ width: "100%", padding: "8px" }}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{ padding: "10px", cursor: "pointer" }}
      >
        {loading ? "保存中..." : "保存してNFCスキャン準備"}
      </button>
      {message && (
        <p style={{ color: loading ? "blue" : "green" }}>{message}</p>
      )}
    </form>
  );
}
