export const getAlbum = async (spotify, albumId) => {
  const album = await spotify.albums.getAlbum(albumId);
  return album;
};

export const searchAlbum = async (spotify, albumName) => {
  const items = await spotify.search.searchAlbums(albumName);
  return items;
};