import scrape from "torrent-search-api";

scrape.enableProvider("1337x");
scrape.enableProvider("Yts");

declare module "torrent-search-api" {
  interface Torrent {
    title: string;
    time: string;
    size: string;
    seeds: string;
    peers: string;
    provider: string;
    desc: string;
    magnet: string;
    torrent: string;
  }
}

function torrentFriendlyName(name: string) {
  return name.replace(/ /g, ".").replace(/[^a-zA-Z0-9.]/g, "");
}

export async function searchMovietorrents(title: string) {
  const torrents = (
    await scrape.search(torrentFriendlyName(title), "Movies", 20)
  ).sort((a, b) => +b.seeds - +a.seeds);
  const torrentsWithMagnets = await Promise.all(
    torrents.map(async (torrent) => {
      try {
        const magnet = await scrape.getMagnet(torrent);
        return { ...torrent, magnet };
      } catch (error) {
        return { ...torrent, magnet: "" };
      }
    })
  );
  return torrentsWithMagnets;
}

export async function searchTvShowTorrents(title: string) {
  return await scrape.search(title, "TV", 20);
}
