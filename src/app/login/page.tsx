import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <form>
      <label htmlFor="email">メールアドレス:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">パスワード:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login}>ログイン</button>
      <button formAction={signup}>新規登録</button>
    </form>
  );
}
