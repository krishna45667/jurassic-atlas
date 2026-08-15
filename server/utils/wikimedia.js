const USER_AGENT =
  "JurassicPark/1.0 (student-project; contact@example.com)";

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const BAD_IMAGE_KEYWORDS = [
  "map",
  "range",
  "distribution",
  "location",

  "diagram",
  "chart",
  "graph",
  "cladogram",
  "phylogen",
  "stratigraph",
  "geological",
  "geologic",

  // Size comparison diagrams
  "size_comparison",
  "size comparison",
  "scale diagram",
  "scale_diagram",

  // Anatomical comparison / diagrams
  "skull",
  "skulls",
  "anatomy",
  "anatomical",
  "comparative",
  "comparison",
  "multiple views",
  "multiple_view",
  "cross section",
  "cross-section",
];

const GOOD_KEYWORDS = [
  "life restoration",
  "life reconstruction",
  "restoration",
  "reconstruction",
  "reconstructed",
  "illustration",
  "artwork",
  "artist impression",
  "artist's impression",
  "paleoart",
];
const SPECIMEN_KEYWORDS = [
  "fossil",
  "holotype",
  "specimen",
  "bone",
  "vertebra",
  "vertebrae",
  "skeleton",
];

const cleanText = (text = "") => {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
};

const normalizeName = (name = "") => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const escapeRegex = (text = "") => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const hasExactNameMatch = (dinosaurName, text) => {
  const normalizedName =
    normalizeName(dinosaurName);

  const normalizedText =
    normalizeName(text);

  if (!normalizedName) {
    return false;
  }

  const regex = new RegExp(
    `\\b${escapeRegex(normalizedName)}\\b`,
    "i"
  );

  return regex.test(normalizedText);
};

const hasGenusMatch = (dinosaurName, text) => {
  const normalizedName =
    normalizeName(dinosaurName);

  const normalizedText =
    normalizeName(text);

  const genus =
    normalizedName.split(" ")[0];

  if (!genus) {
    return false;
  }

  const regex = new RegExp(
    `\\b${escapeRegex(genus)}\\b`,
    "i"
  );

  return regex.test(normalizedText);
};

const containsBadKeyword = (searchText) => {
  return BAD_IMAGE_KEYWORDS.some(
    (keyword) =>
      searchText.includes(keyword)
  );
};

const containsGoodKeyword = (searchText) => {
  return GOOD_KEYWORDS.some(
    (keyword) =>
      searchText.includes(keyword)
  );
};

const scoreCandidate = (
  dinosaurName,
  page
) => {
  const imageInfo =
    page.imageinfo?.[0];

  if (!imageInfo) {
    return null;
  }

  const metadata =
    imageInfo.extmetadata || {};

  const title =
    cleanText(page.title || "");

  const description =
    cleanText(
      metadata.ImageDescription?.value || ""
    );

  const categories =
    cleanText(
      metadata.Categories?.value || ""
    );

  const objectName =
    cleanText(
      metadata.ObjectName?.value || ""
    );

  const searchText = [
    title,
    description,
    categories,
    objectName,
  ].join(" ");

  if (containsBadKeyword(searchText)) {
    return null;
  }

  const normalizedName =
    normalizeName(dinosaurName);

  const nameParts =
    normalizedName.split(" ");

  const isBinomial =
    nameParts.length >= 2;

  const exactNameMatch =
    hasExactNameMatch(
      dinosaurName,
      searchText
    );

  const genusMatch =
    hasGenusMatch(
      dinosaurName,
      searchText
    );

  if (!exactNameMatch && !genusMatch) {
    return null;
  }

  const hasGoodImageKeyword =
    containsGoodKeyword(searchText);

  let score = 0;

  if (exactNameMatch) {
    score += 100;
  }

  if (genusMatch) {
    score += 10;
  }

  if (hasGoodImageKeyword) {
    score += 40;
  }

  GOOD_KEYWORDS.forEach(
    (keyword) => {
      if (
        searchText.includes(keyword)
      ) {
        score += 5;
      }
    }
  );

  if (!isBinomial) {
    if (!hasGoodImageKeyword) {
      return null;
    }

    score += 20;
  }

  if (
    isBinomial &&
    !exactNameMatch &&
    genusMatch &&
    hasGoodImageKeyword
  ) {
    score += 5;
  }

  SPECIMEN_KEYWORDS.forEach(
    (keyword) => {
      if (
        searchText.includes(keyword)
      ) {
        score -= 3;
      }
    }
  );

  if (
    imageInfo.mime &&
    imageInfo.mime.startsWith("image/")
  ) {
    score += 5;
  }

  return {
    score,
    imageInfo,
    metadata,
    title,
    description,
    exactNameMatch,
    genusMatch,
    hasGoodImageKeyword,
  };
};

const getWikimediaImage = async (
  dinosaurName,
  retryCount = 0
) => {
  try {
    console.log(
      `🔎 Searching Wikimedia for: ${dinosaurName}`
    );

    const url =
      `https://commons.wikimedia.org/w/api.php` +
      `?action=query` +
      `&generator=search` +
      `&gsrsearch=${encodeURIComponent(
        dinosaurName
      )}` +
      `&gsrnamespace=6` +
      `&gsrlimit=20` +
      `&prop=imageinfo` +
      `&iiprop=url%7Cextmetadata` +
      `&format=json` +
      `&origin=*`;


    const response =
      await fetch(url, {
        headers: {
          "User-Agent":
            USER_AGENT,
        },
      });

    if (response.status === 429) {
      if (retryCount >= 3) {
        console.log(
          `⚠️ Wikimedia rate limit persisted for ${dinosaurName}`
        );

        return null;
      }

      const retryAfter =
        response.headers.get(
          "retry-after"
        );

      let retrySeconds =
        Number(retryAfter);

      if (
        !retrySeconds ||
        Number.isNaN(retrySeconds)
      ) {
        retrySeconds =
          15 * (retryCount + 1);
      }

      console.log(
        `⏳ Wikimedia rate limited us. Waiting ${retrySeconds}s...`
      );

      await sleep(
        retrySeconds * 1000
      );

      return getWikimediaImage(
        dinosaurName,
        retryCount + 1
      );
    }

    if (!response.ok) {
      throw new Error(
        `Wikimedia request failed: ${response.status}`
      );
    }

    const data =
      await response.json();

    const pages =
      Object.values(
        data.query?.pages || {}
      );


    if (pages.length === 0) {
      console.log(
        `⚠️ No Wikimedia results for ${dinosaurName}`
      );

      return null;
    }

    const candidates =
      pages
        .map((page) =>
          scoreCandidate(
            dinosaurName,
            page
          )
        )
        .filter(Boolean)
        .sort(
          (a, b) =>
            b.score - a.score
        );


    if (
      candidates.length === 0
    ) {
      console.log(
        `⚠️ No reliable Wikimedia match for ${dinosaurName}`
      );

      return null;
    }

    const best =
      candidates[0];


    console.log(
      `🧠 Best Wikimedia score for ${dinosaurName}: ${best.score}`
    );

    console.log(
      `   Exact match: ${
        best.exactNameMatch
          ? "YES"
          : "NO"
      }`
    );

    console.log(
      `   Genus match: ${
        best.genusMatch
          ? "YES"
          : "NO"
      }`
    );

    if (best.score < 50) {
      console.log(
        `⚠️ Wikimedia match too uncertain for ${dinosaurName}`
      );

      return null;
    }


    const imageInfo =
      best.imageInfo;

    const metadata =
      best.metadata;

    const image = {
      url:
        imageInfo.url || "",

      source:
        imageInfo.descriptionurl ||
        "",

      attribution:
        metadata.Artist?.value ||
        "Unknown",

      license:
        metadata.LicenseShortName?.value ||
        "Unknown",
    };

    if (!image.url) {
      console.log(
        `⚠️ Wikimedia returned no usable URL for ${dinosaurName}`
      );

      return null;
    }


    console.log(
      `✅ Selected Wikimedia image for ${dinosaurName}`
    );

    console.log(
      `   ${best.exactNameMatch
        ? "🎯 Exact taxon match"
        : "🧬 Genus-level fallback"}`
    );


    return image;
  } catch (error) {
    console.error(
      `❌ Wikimedia error for ${dinosaurName}:`,
      error.message
    );

    return null;
  }
};

export default getWikimediaImage;