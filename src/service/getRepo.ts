import axios from 'axios';

export async function getRepo() {
    const now = new Date();
    now.setDate(now.getDate() - 7);
    const [lastWeek] = now.toISOString().split('T')
    return await axios.get(`https://api.github.com/search/repositories?q=created:%3E${lastWeek}&sort=stars&order=desc`);
}
