import { useState, useEffect } from "react";

const useShiftStatus = (employeeName) => {
  const [buttonsEnabled, setButtonsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkShiftStatus = async () => {
      if (!employeeName) return;
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/posreports?employeeName=${employeeName}&status=active`
        );
        if (!response.ok) throw new Error("Failed to fetch POS reports");
        const posReports = await response.json();
        const today = new Date().toISOString().split("T")[0];

        if (posReports.length === 0 || posReports[0].currentDate !== today) {
          setButtonsEnabled(true);
        } else {
          const startTime = new Date(`${posReports[0].currentDate}T${posReports[0].startingTime}`);
          const elapsedHours = (new Date() - startTime) / (1000 * 60 * 60);
          setButtonsEnabled(elapsedHours >= 5);
        }
      } catch (error) {
        console.error("Shift status error:", error);
        setButtonsEnabled(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkShiftStatus();
    const interval = setInterval(checkShiftStatus, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, [employeeName]);

  return { buttonsEnabled, isLoading };
};

export default useShiftStatus;