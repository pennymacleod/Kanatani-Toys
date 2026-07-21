// pages/api/youtube-latest.js
// Reads the channel's public RSS feed (no API key needed) to find the most
// recent video, since the /embed/videoseries widget errors with "video
// unavailable" when a channel has zero uploads.
const CHANNEL_ID = 'UCRGN4sLH2nYJVIsZAAlNQ5Q'; // Kanatani Toys — @KANATANITOYS-g6q

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');

  try {
    const r = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`);
    const xml = await r.text();
    const match = xml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
    const titleMatch = xml.match(/<entry>[\s\S]*?<title>([^<]+)<\/title>/);
    return res.status(200).json({
      videoId: match ? match[1] : null,
      title: titleMatch ? titleMatch[1] : null,
    });
  } catch (e) {
    return res.status(200).json({ videoId: null, title: null });
  }
}
