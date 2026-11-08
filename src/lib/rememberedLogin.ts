// Desktop app: code + password are encrypted by Electron (OS keychain).
// Plain browser: only the code is kept; a password is never stored unencrypted.
const CODE_KEY = "billo-remembered-code";

export interface RememberedLogin {
  identificationCode: string;
  password: string;
}

function readCode(): string {
  try {
    return window.localStorage.getItem(CODE_KEY) ?? "";
  } catch {
    return "";
  }
}

export async function loadRememberedLogin(): Promise<RememberedLogin | null> {
  const saved = await window.electron?.loadLogin().catch(() => null);
  if (saved) return { identificationCode: saved.code, password: saved.password };
  const code = readCode();
  return code ? { identificationCode: code, password: "" } : null;
}

export async function rememberLogin({ identificationCode, password }: RememberedLogin) {
  try {
    window.localStorage.setItem(CODE_KEY, identificationCode);
  } catch {
    // Storage unavailable: nothing to remember.
  }
  await window.electron?.saveLogin(identificationCode, password).catch(() => undefined);
}

export async function forgetLogin() {
  try {
    window.localStorage.removeItem(CODE_KEY);
  } catch {
    // Storage unavailable: nothing to clear.
  }
  await window.electron?.clearLogin().catch(() => undefined);
}
