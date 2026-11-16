/* Shared content for all three fanpage concepts. Paths are relative to the site folder (assets/...). */
window.FAN = {
  handle: "hania_heartbeat",
  name: "Hania Aamir",
  instagram: "https://www.instagram.com/hania_heartbeat",
  tagline: "Every frame, a heartbeat.",
  /* 13 edited reels. ar = width/height of the video. cap = short display title. */
  reels: [
    { id: "r01", cap: "May You Always Be Protected", sub: "a prayer, in motion", ar: 720/1280 },
    { id: "r02", cap: "Misse Misse", sub: "nazron ki aadat", ar: 1 },
    { id: "r03", cap: "Bhula Vi Chode", sub: "te masla koi ni", ar: 1 },
    { id: "r04", cap: "Cast Them In A Rom-Com", sub: "with Bilal Abbas Khan", ar: 0.75 },
    { id: "r05", cap: "Kamyar Beta, Bahir Milo", sub: "chaos, but make it cute", ar: 480/360 },
    { id: "r06", cap: "Loved The Audio", sub: "so I had to make this", ar: 0.75 },
    { id: "r07", cap: "Hasti Khelti Hania", sub: "untouched by the harshness of the world", ar: 1 },
    { id: "r08", cap: "Mashallah", sub: "oh my girl is so pretty", ar: 0.75 },
    { id: "r09", cap: "The Legacy", sub: "the career, the woman you are", ar: 960/720 },
    { id: "r10", cap: "The Noise Doesn't Reach Up Here", sub: "never in their league", ar: 720/1280 },
    { id: "r11", cap: "10 Years Of Janaan", sub: "from where it all began", ar: 1 },
    { id: "r12", cap: "Dream Girl", sub: "the kind of beauty poets write about", ar: 1 },
    { id: "r13", cap: "If Grace Had A Face", sub: "it would be hers", ar: 0.75 }
  ].map(r => ({ ...r, src: "assets/reels/" + r.id + ".mp4", poster: "assets/posters/" + r.id + ".jpg" })),
  /* 28 edited stills, p01..p28, all portrait. ar = width/height. */
  photos: [
    [736,1262],[736,1064],[720,1262],[736,1055],[736,1307],[735,1307],[736,1308],
    [474,592],[474,843],[736,1308],[736,1308],[736,1308],[736,1308],[736,1104],[736,1279],
    [564,867],[474,680],[474,711],[736,1292],[474,842],[676,1200],[474,592],[736,1308],
    [474,842],[676,1200],[564,705],[700,1322],[735,1035]
  ].map((d, i) => {
    const id = "p" + String(i + 1).padStart(2, "0");
    return { id, src: "assets/img/" + id + ".jpg", w: d[0], h: d[1], ar: d[0] / d[1] };
  }),
  /* best portraits for hero / big moments (sharpest, highest-res) */
  heroPicks: ["p05", "p07", "p04", "p06", "p02", "p13", "p11"],
  quotes: [
    "The kind of beauty poets write about.",
    "If grace had a face, it would be hers.",
    "Your name is always in their mouths and never in their league.",
    "May this hasti khelti Hania always stay untouched by the harshness of the world.",
    "The noise doesn't reach up here.",
    "She is the soft in a loud world.",
    "A smile that rewrites the whole room.",
    "Not just seen. Remembered."
  ]
};
