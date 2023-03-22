import { SpotifyWebApi } from "spotify-web-api-ts";
import dotenv from "dotenv";
import axios from "axios";
import qs from "qs";

dotenv.config();

const getToken = async (
  client_id = process.env.SPOTIFY_CLIENT_ID,
  client_secret = process.env.SPOTIFY_CLIENT_SECRET
) => {
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

export default spotify; // export the spotify object so we can use it in other files