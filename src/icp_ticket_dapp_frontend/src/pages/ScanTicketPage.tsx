import React, { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { motion } from "framer-motion";
import { icp_ticket_dapp_backend } from "../../../declarations/icp_ticket_dapp_backend";

const ScanTicketPage: React.FC = () => {
  const [scanning, setScanning] = useState<boolean>(true);
  const [ticketId, setTicketId] = useState<string>("");
  const [qrCode, setQrCode] = useState<string>("");
  const [validating, setValidating] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<{ success: boolean; message: string } | null>(null);

  const webcamRef = useRef<Webcam>(null);

  // This is a mock function as we don't have actual QR scanning in this demo
  // In a real app, you would use a library like jsQR to decode QR codes from webcam frames
  const handleScan = useCallback(() => {
    setScanning(false);
    // Just for demo, let the user input the ticket ID and QR code manually
  }, []);

  const handleValidateTicket = async () => {
    if (!ticketId || !qrCode) return;

    setValidating(true);
    setValidationResult(null);

    try {
      const result = await icp_ticket_dapp_backend.validate_ticket(BigInt(ticketId), qrCode);

      if ("Err" in result) {
        let errorMessage = "Validation failed";
        switch (result.Err) {
          case "TicketNotFound":
            errorMessage = "Ticket not found";
            break;
          case "Unauthorized":
            errorMessage = "You are not authorized to validate this ticket";
            break;
          case "TicketAlreadyUsed":
            errorMessage = "This ticket has already been used";
            break;
          case "InvalidQRCode":
            errorMessage = "Invalid QR code";
            break;
          case "EventNotFound":
            errorMessage = "Event not found";
            break;
        }
        setValidationResult({ success: false, message: errorMessage });
      } else if ("Ok" in result && result.Ok) {
        setValidationResult({ success: true, message: "Ticket successfully validated!" });
      } else {
        setValidationResult({ success: false, message: "Validation failed" });
      }
    } catch (err) {
      console.error("Error validating ticket:", err);
      setValidationResult({ success: false, message: "Error validating ticket" });
    } finally {
      setValidating(false);
    }
  };

  const resetScan = () => {
    setScanning(true);
    setTicketId("");
    setQrCode("");
    setValidationResult(null);
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl md:text-4xl font-display font-bold mb-8">Scan Ticket QR Code</h1>

      <div className="bg-surface rounded-xl p-6 md:p-8 max-w-2xl mx-auto">
        {scanning ? (
          <div className="flex flex-col items-center">
            <div className="bg-black rounded-xl overflow-hidden mb-6 relative">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{ facingMode: "environment" }}
                className="w-full"
              />
              <div className="absolute inset-0 border-2 border-accent rounded-xl pointer-events-none"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-primary rounded-lg pointer-events-none"></div>
            </div>
            <p className="text-gray-300 mb-6 text-center">
              Position the QR code within the frame to scan
            </p>
            <button
              onClick={handleScan}
              className="btn btn-primary py-2 px-6"
            >
              Capture
            </button>
          </div>
        ) : validationResult ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center text-center"
          >
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                validationResult.success ? "bg-green-900/30" : "bg-red-900/30"
              }`}
            >
              {validationResult.success ? (
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              ) : (
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
            </div>
            <h2
              className={`text-2xl font-display font-semibold mb-2 ${
                validationResult.success ? "text-green-500" : "text-red-500"
              }`}
            >
              {validationResult.success ? "Success" : "Failed"}
            </h2>
            <p className="text-gray-300 mb-8">{validationResult.message}</p>
            <button onClick={resetScan} className="btn btn-primary py-2 px-6">
              Scan Another Ticket
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col">
            <p className="text-gray-300 mb-6">
              Enter the ticket ID and QR code to validate:
            </p>
            
            <div className="space-y-4 mb-8">
              <div>
                <label htmlFor="ticketId" className="block text-sm font-medium text-gray-300 mb-1">
                  Ticket ID
                </label>
                <input
                  type="text"
                  id="ticketId"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-md w-full px-4 py-2 text-white focus:ring-primary focus:border-primary"
                  placeholder="Enter ticket ID"
                />
              </div>
              
              <div>
                <label htmlFor="qrCode" className="block text-sm font-medium text-gray-300 mb-1">
                  QR Code
                </label>
                <input
                  type="text"
                  id="qrCode"
                  value={qrCode}
                  onChange={(e) => setQrCode(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-md w-full px-4 py-2 text-white focus:ring-primary focus:border-primary"
                  placeholder="Enter QR code value"
                />
              </div>
            </div>
            
            <div className="flex justify-between">
              <button onClick={resetScan} className="btn bg-gray-700 hover:bg-gray-600 text-white py-2 px-4">
                Cancel
              </button>
              <button
                onClick={handleValidateTicket}
                disabled={!ticketId || !qrCode || validating}
                className={`btn btn-primary py-2 px-6 ${
                  !ticketId || !qrCode || validating ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {validating ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Validating...
                  </span>
                ) : (
                  "Validate Ticket"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanTicketPage; 