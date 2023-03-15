import { SpotifyWebApi } from 'spotify-web-api-ts';
import axios from 'axios';
import qs from 'qs';

const getToken = async (client_id = 'c3e248a6801a43adbbe6960ed4af9903', client_secret = '2e299f92f1204086bc9ae545b95a20b5') => {
const headers = {
    headers: {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
    },
    auth: {
    username: client_id,
    password: client_secret,
    },
};
const data = {
    grant_type: "client_credentials",
};
try {
    const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    qs.stringify(data),
    headers
    );
return response.data.access_token;
} catch (err) {
    console.log(err);
}
};

const access_token = await getToken();

const spotify = new SpotifyWebApi({ accessToken: access_token });
const { artists } = await spotify.albums.getAlbum('1uzfGk9vxMXfaZ2avqwxod');
console.log(artists.map(artist => artist.name));