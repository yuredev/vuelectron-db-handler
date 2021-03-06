module.exports = class KnexUserMusicsDAO {
    
    /**
     * Data Access Object to manipulate the table of UserMusics of the database
     * 
     * @param {Object} connection the connection object 
     */
    constructor(connection) {
        if (connection) {
            this.connection = connection;
        } else {
            throw new Error('missing parameters');
        }
    }
    /**
     * insert a new register in the user_musics table of the database
     * 
     * @param {String} musicId  The id of the music that will be inserted in user_musics table.
     * @param {String} userId   The id of the user that will be inserted in user_musics table. 
     * 
     * @returns {Promise<String>} returns a String confirming that the music was created
     */
    async insert(userId, musicId) {
        if (musicId && userId) {
            try {
                await this.connection('user_musics').insert({
                    user_id: userId,
                    music_id: musicId
                });
                return 'created';
            } catch (error) {
                throw error;
            }
        } else {
            throw new Error('missing arguments in parameters');
        }
    }
    /**
     * Select all registers from user_musics table
     * 
     * @returns {Promise<Array>} Return all of the user_musics table registers
     */
    async selectAll() {
        return await this.connection('user_musics')
            .join('users', 'users.id', '=', 'user_musics.user_id')
            .join('musics', 'musics.id', '=', 'user_musics.music_id')
            .select([
                'users.name as user_name', 
                'musics.name as music_name', 
                'musics.artist', 
                'user_id', 
                'music_id'
            ]);
    }
    /**
     * Select a only music in the user_musics table
     * 
     * @param {String} musicId  The id of the music that will be searched in user_musics table.
     * @param {String} userId   The id of the user that will be searched in user_musics table. 
     * 
     * @returns {Promise<Object>} Return one of the user_musics table registers
     */
    async select(musicId, userId) {
        if (musicId && userId) {
            return await this.connection('user_musics')
                .where('music_id', musicId)
                .andWhere('user_id', userId)
                .select('*')
                .first();
        } else {
            throw new Error('missing arguments in parameters');
        }
    }
    /**
     * Delete a specific music of the user_musics table
     * 
     * @param {String} userId The id of the user to determinate which user_music instance will be deleted 
     * @param {String} musicId The id of the music to determinate which user_music instance will be deleted
     * 
     * @returns {Promise<String} returns a String confirming that the instance was deleted
     */
    async delete(userId, musicId) {
        try {
            await this.connection('user_musics')
                .where('music_id', musicId)
                .andWhere('user_id', userId)
                .delete();
            return 'deleted';
        } catch (error) {
            throw error;
        }
    }
    /**
     * Delete all the user_musics instances in the database 
     */
    async deleteAll() {
        try {
            await this.connection('user_musics').delete();
        } catch (error) {
            throw error;
        }
    }
    /**
     * return all musics from a specific user of the database 
     * 
     * @param {String} userId 
     * @returns {Promise<Array>} returns an array containing the musics of an user
     */
    async selectMusicsFromUser(userId) {
        return await this.connection('user_musics')
            .join('musics', 'musics.id', 'user_musics.music_id')
            .join('users', 'users.id', '=', 'user_musics.user_id')
            .where('user_id', userId)
            .select('users.name as owner',
                'musics.name as music_name', 
                'musics.artist', 
                'musics.lyrics', 
                'musics.id'
            );
    }
}