import { useState, useEffect } from "react";

const PARAM_NAME = "text";

export const useTextParam = () => {
  const [text, setText] = useState(null);

  useEffect(() => {
    const handleChange = () => {
      const queryParams = new URLSearchParams(window.location.search);
      const fragmentParams = new URLSearchParams(
        window.location.hash.replace(/^#/, "?"),
      );

      if (queryParams.get(PARAM_NAME)?.length > 0) {
        setText(queryParams.get(PARAM_NAME));
      } else if (fragmentParams.get(PARAM_NAME)?.length > 0) {
        setText(fragmentParams.get(PARAM_NAME));
      } else {
        setText(null);
      }
    };

    // Initial page load
    handleChange();

    // If the user navigates within the opened page
    window.addEventListener("popstate", handleChange);

    return () => {
      window.removeEventListener("popstate", handleChange);
    };
  }, []);

  return text;
};
