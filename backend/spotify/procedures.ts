import { os } from "@orpc/server";
import { StatusCodes } from "http-status-codes";
import {
  buildSpotifyAuthUrl,
  exchangeCodeForTokens,
  getAccessToken,
} from "./helpers";
import {
  AuthUrlOutputSchema,
  CallbackInputSchema,
  CallbackOutputSchema,
  CurrentlyPlayingOutputSchema,
  TopTracksOutputSchema,
  type TSpotifyArtistApi,
  type TSpotifyTrackApi,
} from "./types";

export const getCurrentlyPlayingTrack = os
  .output(CurrentlyPlayingOutputSchema)
  .handler(async () => {
    const accessToken = await getAccessToken();
    const response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (response.status === StatusCodes.NO_CONTENT) {
      return { isPlaying: false, track: null };
    }

    if (!response.ok) {
      throw new Error(`Failed to get current track: ${response.status}`);
    }

    const currentTrack = await response.json();

    if (!currentTrack?.item) {
      return { isPlaying: false, track: null };
    }

    if (currentTrack.currently_playing_type === "track") {
      const trackItem = currentTrack.item;
      return {
        isPlaying: currentTrack.is_playing,
        track: {
          name: trackItem.name,
          artists: trackItem.artists.map((artist: TSpotifyArtistApi) => ({
            name: artist.name,
            url: artist.external_urls.spotify,
          })),
          album: {
            name: trackItem.album.name,
            image: trackItem.album.images?.[0]?.url ?? null,
          },
          url: trackItem.external_urls.spotify,
          previewUrl: trackItem.preview_url,
          isPlaying: currentTrack.is_playing,
          progress: currentTrack.progress_ms,
          type: "track",
        },
      };
    }

    if (currentTrack.currently_playing_type === "episode") {
      const episodeItem = currentTrack.item;
      return {
        isPlaying: currentTrack.is_playing,
        episode: {
          name: episodeItem.name,
          description: episodeItem.description,
          show: {
            name: episodeItem.show.name,
            publisher: episodeItem.show.publisher,
            image: episodeItem.show.images?.[0]?.url ?? null,
          },
          image: episodeItem.images?.[0]?.url ?? null,
          url: episodeItem.external_urls.spotify,
          duration: episodeItem.duration_ms,
          isPlaying: currentTrack.is_playing,
          progress: currentTrack.progress_ms,
          type: "episode",
          releaseDate: episodeItem.release_date,
          resumePoint: episodeItem.resume_point,
        },
      };
    }

    return {
      isPlaying: currentTrack.is_playing,
      currentlyPlayingType: currentTrack.currently_playing_type,
      track: null,
    };
  });

export const getUserTopTracks = os
  .output(TopTracksOutputSchema)
  .handler(async () => {
    const accessToken = await getAccessToken();
    const response = await fetch(
      "https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=5",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get top tracks: ${response.status}`);
    }

    const topTracksResponse = await response.json();
    const topTracks = topTracksResponse.items.map(
      (track: TSpotifyTrackApi) => ({
        name: track.name,
        artists: track.artists.map((artist: TSpotifyArtistApi) => ({
          name: artist.name,
          url: artist.external_urls.spotify,
        })),
        album: {
          name: track.album.name,
          image: track.album.images?.[0]?.url ?? null,
        },
        url: track.external_urls.spotify,
        previewUrl: track.preview_url,
        isPlaying: false,
        progress: null,
        type: "track" as const,
        popularity: track.popularity,
        explicit: track.explicit,
        id: track.id,
      })
    );

    return {
      tracks: topTracks,
      total: topTracksResponse.total,
    };
  });

export const generateSpotifyAuthUrl = os
  .output(AuthUrlOutputSchema)
  .handler(() => {
    const url = buildSpotifyAuthUrl();
    return { url };
  });

export const handleSpotifyCallback = os
  .input(CallbackInputSchema)
  .output(CallbackOutputSchema)
  .handler(async ({ input }) => {
    const tokens = await exchangeCodeForTokens(input.code);

    return {
      message:
        "Authorization successful! Copy the refresh_token to your .env file as SPOTIFY_REFRESH_TOKEN",
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
    };
  });