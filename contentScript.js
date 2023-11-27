const scrapPlaylist = function (exportType) {
  let arrayVideos = [];
  const links = document.querySelectorAll(".style-scope.ytd-playlist-video-renderer");

  for (const videoElement of links) {
    if (videoElement.id === "container") {
      const videoTitleElement = videoElement.querySelector("a#video-title");
      const title = videoTitleElement.textContent.trim();

      const videoLengthElement = videoElement.querySelector("ytd-thumbnail-overlay-time-status-renderer span#text");
      const length = videoLengthElement.textContent.trim();

      const thumbnailElement = videoElement.querySelector("yt-image img");
      const thumbnailUrl = thumbnailElement.getAttribute("src");

      const authorElement = videoElement.querySelector("ytd-channel-name yt-formatted-string a");
      const author = authorElement.textContent.trim();

      const publishedDateElement = videoElement.querySelector("yt-formatted-string#video-info span:nth-child(3)");
      const publishedDate = publishedDateElement.textContent.trim();

      const viewCountElement = videoElement.querySelector("yt-formatted-string#video-info span:nth-child(1)");
      const viewCount = viewCountElement.textContent.trim();

      const url = videoTitleElement.getAttribute("href");

      if (url && url.startsWith("/watch")) {
        const absoluteUrl = window.location.origin + url;
        const videoId = new URL(absoluteUrl).searchParams.get("v");
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

        arrayVideos.push({ title, viewCount, publishedDate, author, length, videoId, videoUrl, thumbnailUrl });
      }
    }
  }

  let blob;

  if (exportType === "json") {
    const data = JSON.stringify(arrayVideos, null, 2);
    blob = new Blob([data], { type: "application/json" });
  } else if (exportType === "csv") {
    const data = "data:text/csv;charset=utf-8," + arrayVideos.map((video) => Object.values(video).join(",")).join("\n");
    blob = new Blob([data], { type: "text/csv" });
  } else {
    function generateTextContent(video) {
      const keys = Object.keys(video);
      return keys.map((key) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${video[key]}`).join("\n") + "\n\n";
    }

    const data = arrayVideos.map((video) => generateTextContent(video)).join("");

    blob = new Blob([data], { type: "text/plain" });
  }

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `playlistExport.${exportType}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

chrome.runtime.onMessage.addListener(function (request) {
  if (request.action === "scrapPlaylistJson") {
    scrapPlaylist("json");
  } else if (request.action === "scrapPlaylistCsv") {
    scrapPlaylist("csv");
  } else {
    scrapPlaylist("txt");
  }
});
