import React, { useRef } from 'react';
import { Printer, X } from 'lucide-react';
import QRCode from 'qrcode';

type TicketPreviewProps = {
  isOpen: boolean;
  onClose: () => void;
  ticketData: {
    eventName: string;
    ticketType: string;
    customerName: string;
    ticketId: string;
    date: string;
    time: string;
    location: string;
    seatNumber: string;
    ticketNumber: string;
  };
};

const TicketPreview: React.FC<TicketPreviewProps> = ({ isOpen, onClose, ticketData }) => {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [qrCode, setQrCode] = React.useState<string>('');

  React.useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(ticketData.ticketId, {
        width: 150,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).then(setQrCode);
    }
  }, [isOpen, ticketData.ticketId]);

  const handlePrint = () => {
    const content = ticketRef.current;
    if (!content) return;

    const printWindow = window.open('', '', 'width=140mm,height=76mm');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <style>
            @page {
              size: 140mm 76mm;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              width: 140mm;
              height: 76mm;
            }
            .ticket {
              width: 100%;
              height: 100%;
            }
          </style>
        </head>
        <body>
          ${content.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 backdrop-blur-sm z-50">
      <div className="bg-white rounded-xl shadow-xl w-full min-w-[600px] max-w-[800px] mx-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Ticket Preview</h2>
            <p className="text-sm text-gray-500">Ticket {ticketData.ticketNumber}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div 
            ref={ticketRef}
            className="ticket relative bg-white rounded-xl overflow-hidden shadow-2xl"
            style={{ width: '140mm', height: '76mm' }}
          >
            {/* Background Image with Gradient Overlay */}
            <div 
              className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop')] bg-cover bg-center opacity-15"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-white/50" />

            {/* Ticket Content */}
            <div className="relative flex h-full">
              {/* Left Section - Event Details */}
              <div className="flex-[3] p-6 flex flex-col justify-between border-r border-gray-200">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-starbucks-green mb-1">{ticketData.eventName}</h3>
                      <div className="flex gap-2">
                        <span className="inline-block px-3 py-1 bg-starbucks-green/10 text-starbucks-green rounded-full text-sm font-medium">
                          {ticketData.ticketType}
                        </span>
                        <span className="inline-block px-3 py-1 bg-starbucks-gold/10 text-starbucks-gold rounded-full text-sm font-medium">
                          {ticketData.seatNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-gray-700">
                    <div>
                      <p className="text-sm text-gray-500">Attendee</p>
                      <p className="font-semibold">{ticketData.customerName}</p>
                    </div>
                    <div className="flex gap-6">
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-semibold">{ticketData.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-semibold">{ticketData.time}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold">{ticketData.location}</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-400">
                  Ticket ID: {ticketData.ticketId}
                </div>
              </div>

              {/* Right Section - QR Code */}
              <div className="flex-[2] bg-white flex flex-col items-center justify-center p-6 relative">
                <div className="bg-white p-3 rounded-xl shadow-lg">
                  {qrCode && (
                    <img 
                      src={qrCode} 
                      alt="Ticket QR Code"
                      className="w-[150px] h-[150px]"
                    />
                  )}
                </div>
                <p className="text-sm text-center mt-4 text-gray-500 font-medium">Scan for entry</p>
              </div>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="mt-6 w-full bg-starbucks-green hover:bg-starbucks-green-light text-white py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg font-semibold"
          >
            <Printer className="h-6 w-6" />
            Print Ticket {ticketData.ticketNumber}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketPreview;