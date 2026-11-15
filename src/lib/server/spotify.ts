import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$app/env/private';

const BASE = 'https://api.spotify.com/v1';
const TOKEN_URL = 'https://accounts.spotify.com/api/token';

// ── Types ──────────────────────────────────────────────────────────────────

export type SpotifyArtist = {
	id: string;
	name: string;
	imageUrl: string | null;
};

export type SpotifyAlbum = {
	id: string;
	title: string;
	artist: string;
	artistId: string;
	releaseDate: string;   // ISO e.g. '2015-03-15'
	coverUrl: string | null;
	totalTracks: number;
	isNew: boolean;
};

export type SpotifyTrack = {
	number: number;
	name: string;
	durationMs: number;
};

// ── Token cache ────────────────────────────────────────────────────────────

let _token: string | null = null;
let _tokenExpiresAt = 0;

async function getToken(): Promise<string> {
	if (_token && Date.now() < _tokenExpiresAt) return _token;

	const credentials = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
	const res = await fetch(TOKEN_URL, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${credentials}`,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: 'grant_type=client_credentials',
	});

	if (!res.ok) throw new Error(`Spotify token request failed: ${res.status}`);

	const data = await res.json();
	_token = data.access_token;
	// Refresh 60 s before actual expiry
	_tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
	return _token!;
}

async function spotifyFetch(path: string): Promise<unknown> {
	const token = await getToken();
	const res = await fetch(`${BASE}${path}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!res.ok) throw new Error(`Spotify API error ${res.status}: ${path}`);
	return res.json();
}

// ── Helpers ────────────────────────────────────────────────────────────────

function pickImage(images: { url: string; width: number }[]): string | null {
	if (!images?.length) return null;
	// Prefer the image closest to 300px wide
	const sorted = [...images].sort((a, b) =>
		Math.abs(a.width - 300) - Math.abs(b.width - 300)
	);
	return sorted[0].url;
}

function isNew(releaseDate: string): boolean {
	const released = new Date(releaseDate).getTime();
	return Date.now() - released < 30 * 24 * 60 * 60 * 1000;
}

function normaliseDate(date: string, precision: string): string {
	if (precision === 'year')  return `${date}-01-01`;
	if (precision === 'month') return `${date}-01`;
	return date;
}

// ── Public API ─────────────────────────────────────────────────────────────

export async function searchArtists(query: string): Promise<SpotifyArtist[]> {
	const q = encodeURIComponent(query);
	const data = await spotifyFetch(`/search?q=${q}&type=artist&limit=10`) as {
		artists: { items: { id: string; name: string; images: { url: string; width: number }[] }[] };
	};
	return data.artists.items.map((a) => ({
		id: a.id,
		name: a.name,
		imageUrl: pickImage(a.images),
	}));
}

export async function getArtistLatestRelease(spotifyId: string): Promise<SpotifyAlbum | null> {
	const data = await spotifyFetch(
		`/artists/${spotifyId}/albums?include_groups=album,single&limit=5&market=US`
	) as {
		items: {
			id: string;
			name: string;
			release_date: string;
			release_date_precision: string;
			total_tracks: number;
			images: { url: string; width: number }[];
			artists: { id: string; name: string }[];
		}[];
	};

	if (!data.items.length) return null;

	// Items are ordered newest-first by Spotify
	const album = data.items[0];
	const releaseDate = normaliseDate(album.release_date, album.release_date_precision);

	return {
		id: album.id,
		title: album.name,
		artist: album.artists[0]?.name ?? '',
		artistId: album.artists[0]?.id ?? spotifyId,
		releaseDate,
		coverUrl: pickImage(album.images),
		totalTracks: album.total_tracks,
		isNew: isNew(releaseDate),
	};
}

export async function getAlbum(albumId: string): Promise<{
	album: SpotifyAlbum;
	tracks: SpotifyTrack[];
} | null> {
	const data = await spotifyFetch(`/albums/${albumId}`) as {
		id: string;
		name: string;
		release_date: string;
		release_date_precision: string;
		total_tracks: number;
		images: { url: string; width: number }[];
		artists: { id: string; name: string }[];
		label: string;
		tracks: {
			items: { track_number: number; name: string; duration_ms: number }[];
		};
	};

	const releaseDate = normaliseDate(data.release_date, data.release_date_precision);

	return {
		album: {
			id: data.id,
			title: data.name,
			artist: data.artists[0]?.name ?? '',
			artistId: data.artists[0]?.id ?? '',
			releaseDate,
			coverUrl: pickImage(data.images),
			totalTracks: data.total_tracks,
			isNew: isNew(releaseDate),
		},
		tracks: data.tracks.items.map((t) => ({
			number: t.track_number,
			name: t.name,
			durationMs: t.duration_ms,
		})),
	};
}
