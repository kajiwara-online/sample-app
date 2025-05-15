import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <main className="bg-gray-100 min-h-screen flex items-center justify-center px-4">
      <form className="bg-white p-6 rounded-md shadow-sm w-full max-w-md space-y-4 border">
        <h1 className="text-lg font-semibold text-center border-b pb-2">
          ログイン / 新規登録
        </h1>

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium">
            メールアドレス
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium">
            パスワード
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            formAction={login}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-md text-sm"
          >
            ログイン
          </button>
          <button
            formAction={signup}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 rounded-md text-sm"
          >
            新規登録
          </button>
        </div>
      </form>
    </main>
  );
}
