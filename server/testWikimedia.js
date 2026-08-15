const dinosaurName = "Caudipteryx zoui";

const url =
  `https://commons.wikimedia.org/w/api.php` +
  `?action=query` +
  `&generator=search` +
  `&gsrsearch=${encodeURIComponent(dinosaurName)}` +
  `&gsrnamespace=6` +
  `&prop=imageinfo` +
  `&iiprop=url%7Cextmetadata` +
  `&format=json` +
  `&origin=*`;

const getImage = async () => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Wikimedia request failed: ${response.status}`);
    }

    const data = await response.json();

    const pages = Object.values(data.query?.pages || {});

    if (pages.length === 0) {
      console.log("❌ No image found");
      return;
    }

    const page =
    pages.find((page) => {
    const metadata = page.imageinfo?.[0]?.extmetadata || {};

    const categories =
      metadata.Categories?.value?.toLowerCase() || "";

    const description =
      metadata.ImageDescription?.value?.toLowerCase() || "";

    return (
      categories.includes("life restorations") ||
      categories.includes("life restoration") ||
      description.includes("life restoration") ||
      description.includes("reconstruction")
    );
  }) || pages[0];
    const imageInfo = page.imageinfo?.[0];

    if (!imageInfo) {
      console.log("❌ No image information found");
      return;
    }

    const metadata = imageInfo.extmetadata || {};

    console.log("🦖 Dinosaur:", dinosaurName);
    console.log("🖼️ Image:", imageInfo.url);
    console.log("🔗 Source:", imageInfo.descriptionurl);
    console.log(
      "👤 Artist:",
      metadata.Artist?.value || "Unknown"
    );
    console.log(
      "📜 License:",
      metadata.LicenseShortName?.value || "Unknown"
    );
  } catch (error) {
    console.error("❌ Wikimedia request failed:", error.message);
  }
};

getImage();