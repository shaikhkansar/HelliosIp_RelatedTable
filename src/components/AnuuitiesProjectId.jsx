import React, { useState, useEffect } from "react";
import "./App.css";

const AnuuitiesProjectId = ({ chatid }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        const encodedData = encodeURIComponent(chatid);
        const modifiedEncodedData = encodedData.replace(/%3A/g, "%3a");
        const apiUrl =
          "https://prod-06.centralindia.logic.azure.com:443/workflows/007a40f3f0b64dd481f455a120c965d5/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=MTBv22mvAZWPl0fU4nZ4L4EcID8yBlT7EvugRcuSE0k";

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatid: modifiedEncodedData,
          }),
        });

        const result = await response.json();

        if (isMounted) {
          setData(result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      // Cleanup function to set isMounted to false when the component is unmounted
      isMounted = false;
    };
  }, [chatid]);

  return (
    <div className="hding">
      {data && data.length > 0 ? (
        <div>
          {data && data.length > 0 ? (
            <div>
              {Object.keys(data[0]).map(
                (property, index) =>
                  typeof data[0][property] !== "object" &&
                  property === "InstructionType" && (
                    <div key={index}>
                      <strong>{property}:</strong> {data[0][property]}
                    </div>
                  )
              )}
            </div>
          ) : (
            <div></div>
          )}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default AnuuitiesProjectId;
