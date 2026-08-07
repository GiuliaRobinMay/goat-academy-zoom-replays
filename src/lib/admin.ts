/**
 * Who is allowed to see the admin zone.
 *
 * There is no login in this app yet, so admin is granted by visiting the page
 * once with `?admin=1` and revoked with `?admin=0`. That is a placeholder, not
 * security — anyone who knows the parameter can grant it to themselves.
 *
 * When the app is embedded and members are actually identified, replace the
 * body of `isAdmin()` with the real check — the host's member role, a claim on
 * the session token, or an endpoint on our own backend. Nothing else in the UI
 * needs to change; every admin control is already behind this one function.
 */

const KEY = 'goat.replays.admin'

function readFlag(): boolean {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

/** Applies `?admin=1` / `?admin=0` from the URL, then cleans it off. */
export function syncAdminFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search)
    if (!params.has('admin')) return
    const on = params.get('admin') !== '0'
    localStorage.setItem(KEY, on ? '1' : '0')
    params.delete('admin')
    const q = params.toString()
    window.history.replaceState({}, '', window.location.pathname + (q ? `?${q}` : ''))
  } catch {
    /* ignore */
  }
}

export const isAdmin = (): boolean => readFlag()
