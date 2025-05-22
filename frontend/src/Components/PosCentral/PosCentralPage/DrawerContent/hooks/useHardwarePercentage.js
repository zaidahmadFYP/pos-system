import { useState, useEffect } from "react";

const useHardwarePercentage = () => {
  const [hardwarePercentage, setHardwarePercentage] = useState(null);

  const generateHardwarePercentage = () => Math.floor(Math.random() * (100 - 75 + 1)) + 75;

  useEffect(() => {
    setHardwarePercentage(generateHardwarePercentage());
    const interval = setInterval(() => setHardwarePercentage(generateHardwarePercentage()), 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  return hardwarePercentage;
};

export default useHardwarePercentage;