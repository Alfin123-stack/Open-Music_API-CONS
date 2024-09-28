const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongsFromPlaylist(playlistId) {
    const query = {
      text: `SELECT 
        playlists.id, 
        playlists.name, 
        playlists.owner, 
        songs.id as song_id, 
        songs.title, 
        songs.performer
        FROM playlists
        LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
        LEFT JOIN songs ON playlist_songs.song_id = songs.id
        WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    const playlistData = {
      id: result.rows[0].id,
      name: result.rows[0].name,
      songs: result.rows.map((songRow) => ({
        id: songRow.song_id,
        title: songRow.title,
        performer: songRow.performer,
      })),
    };

    return {
      playlist: playlistData,
    };
  }
}

module.exports = PlaylistsService;
