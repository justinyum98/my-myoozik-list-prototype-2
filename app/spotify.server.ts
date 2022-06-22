import invariant from "tiny-invariant";

interface AccessTokenData {
    access_token: string;
    token_type: 'Bearer';
    expires_in: number;
}

invariant(process.env.SPOTIFY_CLIENT_ID, "SPOTIFY_CLIENT_ID must be set");
invariant(process.env.SPOTIFY_CLIENT_SECRET, "SPOTIFY_CLIENT_SECRET must be set");

export async function requestSpotifyAccessToken(): Promise<string> {
    const res = await fetch('https://accounts.spotify.com/api/token?grant_type=client_credentials', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    return ((res.json() as unknown) as AccessTokenData).access_token;
}

export async function getSpotifyAccessToken(): Promise<string> {
    if (process.env.SPOTIFY_ACCESS_TOKEN === undefined) {
        process.env.SPOTIFY_ACCESS_TOKEN = await requestSpotifyAccessToken();
    }
    return process.env.SPOTIFY_ACCESS_TOKEN;
}
