const url =
  "https://paleobiodb.org/data1.2/occs/list.json?base_name=Dinosauria&show=coords,loc,strat&limit=5";
  console.log("Requesting:", url);
const testPBDB = async () => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`PBDB request failed: ${response.status}`);
    }

    const data = await response.json();

    console.log("🦖 PBDB records received:", data.records.length);

    console.log("\nFirst record:");
    console.log(data.records[0]);
  } catch (error) {
    console.error("PBDB request failed:", error.message);
  }
};

testPBDB();