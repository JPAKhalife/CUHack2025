import { useState, useEffect } from "react";
import { api } from "../api";

/**
 * InsultGenerator component provides a UI for generating and displaying insults
 * using the Gadget AI session and insult endpoint.
 */
const InsultGenerator: React.FC = () => {
  // State for tracking the client ID, session ID, and generated insult
  const [clientId, setClientId] = useState<string>("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [insult, setInsult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);

  // Generate a client ID and initialize AI session on component mount
  useEffect(() => {
    const generateClientId = () => {
      // Generate a random string for client ID
      return Math.random().toString(36).substring(2, 15) + 
             Math.random().toString(36).substring(2, 15);
    };

    const initializeSession = async () => {
      try {
        setInitializing(true);
        const newClientId = generateClientId();
        setClientId(newClientId);
        
        // Call the global action to initialize an AI session
        const result = await api.initializeAISession({ clientId: newClientId });
        
        if (result?.id) {
          setSessionId(result.id);
          setError(null);
        } else {
          setError("Failed to initialize AI session");
        }
      } catch (err) {
        setError(`Error initializing AI session: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setInitializing(false);
      }
    };

    initializeSession();
  }, []);

  // Function to fetch an insult from the backend
  const fetchInsult = async () => {
    if (!sessionId) {
      setError("No active session. Please refresh the page.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Call the insult endpoint with the session ID
      const response = await fetch(`/insult?sessionId=${sessionId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.insult) {
        setInsult(data.insult);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError(`Error fetching insult: ${err instanceof Error ? err.message : String(err)}`);
      setInsult("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="insult-generator">
      <h2>Insult Generator</h2>
      
      {initializing ? (
        <p>Initializing AI session...</p>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      ) : (
        <>
          <button 
            onClick={fetchInsult} 
            disabled={loading || !sessionId}
            className="insult-button"
          >
            {loading ? "Generating..." : "Generate Insult"}
          </button>
          
          {insult && (
            <div className="insult-display">
              <p>{insult}</p>
            </div>
          )}
        </>
      )}
      
      <style jsx>{`
        .insult-generator {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          background-color: #fff;
        }
        
        h2 {
          text-align: center;
          color: #333;
        }
        
        .insult-button {
          display: block;
          margin: 20px auto;
          padding: 10px 20px;
          background-color: #4a4a4a;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .insult-button:hover:not(:disabled) {
          background-color: #333;
        }
        
        .insult-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        
        .insult-display {
          margin-top: 20px;
          padding: 15px;
          border-radius: 4px;
          background-color: #f5f5f5;
          font-style: italic;
          text-align: center;
        }
        
        .error-message {
          color: #d9534f;
          margin: 20px 0;
          padding: 10px;
          border: 1px solid #d9534f;
          border-radius: 4px;
          background-color: #f9f2f4;
        }
      `}</style>
    </div>
  );
};

export { InsultGenerator };
export default InsultGenerator;