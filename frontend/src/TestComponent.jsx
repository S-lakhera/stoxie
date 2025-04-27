import React, { useEffect } from "react";

const TestComponent = () => {
  useEffect(() => {
    console.log("import.meta.env:", import.meta.env); // Log the environment variables
    console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL); // Log your specific variable
  }, []);

  return (
    <div>
      <h1>Test Component</h1>
    </div>
  );
};

export default TestComponent;
