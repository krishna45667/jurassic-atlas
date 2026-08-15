import { useEffect, useState } from "react";

const useDinosaurs = () => {
  const [dinosaurs, setDinosaurs] = useState([]);

  useEffect(() => {
    const fetchDinosaurs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/dinosaurs");

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