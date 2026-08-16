import { useEffect, useState } from "react";

const useDinosaurs = () => {
  const [dinosaurs, setDinosaurs] = useState([]);

  useEffect(() => {
    const fetchDinosaurs = async () => {
      try {
        const API_URL = (import.meta.env.VITE_API_URL || "https://jurassic-atlas.onrender.com").replace(/\/+$/, "");
        const response = await fetch(`${API_URL}/api/dinosaurs`);
        if (!response.ok) {
          throw new Error("Failed to fetch dinosaurs");
        }

        const data = await response.json();

        setDinosaurs(data);
      } catch (error) {
        console.error("Error fetching dinosaurs:", error);
      }
    };

    fetchDinosaurs();
  }, []);

  return dinosaurs;
};

export default useDinosaurs;