const DB_URL = 'https://movie-5345b-default-rtdb.firebaseio.com';
const AUTH_TOKEN = 'AAAApXlxv74:APA91bHu2KoHnTXBGGNTSGbmb8KIQNkVo_3tyhNSlAnVzeiA3jIU7Fc1wgewKedbNm_5e-7dlEUUeM5QB7TOWqFAGwJBpCtVt_GSxuRP45bQW5J-skSvNWNC8MoXGd5K9XjU3QqVStbF';

// Firebase keys cannot contain '.', '#', '$', '[', or ']'
const encodeKey = (email: string) => email.replace(/\./g, ',');

export const firebaseService = {
  async getUser(email: string) {
    const key = encodeKey(email);
    const response = await fetch(`${DB_URL}/users/${key}.json?auth=${AUTH_TOKEN}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  async createUser(email: string, data: any) {
    const key = encodeKey(email);
    const response = await fetch(`${DB_URL}/users/${key}.json?auth=${AUTH_TOKEN}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  async updateUserStats(email: string, stats: any) {
    const key = encodeKey(email);
    const response = await fetch(`${DB_URL}/users/${key}/stats.json?auth=${AUTH_TOKEN}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stats),
    });
    if (!response.ok) throw new Error('Failed to update stats');
    return response.json();
  }
};
