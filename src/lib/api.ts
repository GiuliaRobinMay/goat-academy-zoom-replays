import type { Replay } from '../types'
import { buildReplays } from '../data/replays'

/**
 * The single seam between the UI and where replays actually come from.
 *
 * Right now it resolves the generated placeholder archive. To go live, replace
 * the body of `fetchReplays` with a call to our own backend — the backend lists
 * recordings per host via `GET /v2/users/{userId}/recordings` and returns the
 * same `Replay` shape, with `videoUrl` pointing at our streaming proxy.
 *
 * Why a proxy and not the Zoom URL directly: since Feb 2023 Zoom requires the
 * OAuth token in an `Authorization` header, and a <video> tag cannot send
 * headers. The backend attaches the header, forwards Range requests so seeking
 * works, and streams the MP4 back.
 */

export interface ReplaySource {
  fetchReplays(): Promise<Replay[]>
}

export const mockSource: ReplaySource = {
  async fetchReplays() {
    return buildReplays()
  },
}

/** Swap this for a live implementation once the backend exists. */
export const source: ReplaySource = mockSource

export async function fetchReplays(): Promise<Replay[]> {
  return source.fetchReplays()
}
