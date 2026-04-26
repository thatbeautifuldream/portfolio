import { os } from "@orpc/server"
import { getContributions } from "./github/procedures"
import {
  createGuestbookEntry,
  deleteGuestbookEntry,
  listGuestbookEntries,
  updateGuestbookEntry,
} from "./guestbook/procedures"
import { detailedHealthCheck, healthCheck } from "./health/procedures"
import {
  generateSpotifyAuthUrl,
  getCurrentlyPlayingTrack,
  getUserTopTracks,
  handleSpotifyCallback,
} from "./spotify/procedures"

export const router = os.router({
  health: {
    check: healthCheck,
    detailed: detailedHealthCheck,
  },
  github: {
    contributions: getContributions,
  },
  guestbook: {
    list: listGuestbookEntries,
    create: createGuestbookEntry,
    update: updateGuestbookEntry,
    remove: deleteGuestbookEntry,
  },
  spotify: {
    "currently-playing": getCurrentlyPlayingTrack,
    "top-tracks": getUserTopTracks,
    "auth-url": generateSpotifyAuthUrl,
    callback: handleSpotifyCallback,
  },
})
