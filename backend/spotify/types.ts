import { z } from "zod";

export const SpotifyArtistSchema = z.object({
  name: z.string(),
  url: z.string(),
});

export const SpotifyAlbumSchema = z.object({
  name: z.string(),
  image: z.string().nullable().optional(),
});

export const SpotifyTrackSchema = z.object({
  name: z.string(),
  artists: z.array(SpotifyArtistSchema),
  album: SpotifyAlbumSchema,
  url: z.string(),
  previewUrl: z.string().nullable(),
  isPlaying: z.boolean(),
  progress: z.number().nullable().optional(),
  type: z.literal("track"),
});

export const SpotifyEpisodeSchema = z.object({
  name: z.string(),
  description: z.string(),
  show: z.object({
    name: z.string(),
    publisher: z.string(),
    image: z.string().nullable().optional(),
  }),
  image: z.string().nullable().optional(),
  url: z.string(),
  duration: z.number(),
  isPlaying: z.boolean(),
  progress: z.number().nullable().optional(),
  type: z.literal("episode"),
  releaseDate: z.string(),
  resumePoint: z.any().optional(),
});

export const CurrentlyPlayingOutputSchema = z.object({
  isPlaying: z.boolean(),
  track: SpotifyTrackSchema.nullable().optional(),
  episode: SpotifyEpisodeSchema.nullable().optional(),
  currentlyPlayingType: z.string().optional(),
});

export const TopTracksOutputSchema = z.object({
  tracks: z.array(
    SpotifyTrackSchema.extend({
      popularity: z.number(),
      explicit: z.boolean(),
      id: z.string(),
    })
  ),
  total: z.number(),
});

export const AuthUrlOutputSchema = z.object({
  url: z.string(),
});

export const CallbackInputSchema = z.object({
  code: z.string(),
});

export const CallbackOutputSchema = z.object({
  message: z.string(),
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(),
});

export type TSpotifyArtistApi = {
  name: string;
  external_urls: {
    spotify: string;
  };
};

export type TSpotifyAlbumApi = {
  name: string;
  images?: Array<{ url: string }>;
};

export type TSpotifyTrackApi = {
  name: string;
  artists: TSpotifyArtistApi[];
  album: TSpotifyAlbumApi;
  external_urls: {
    spotify: string;
  };
  preview_url: string | null;
  popularity: number;
  explicit: boolean;
  id: string;
};