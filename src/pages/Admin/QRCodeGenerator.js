import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JSZip from 'jszip';
import CONFIG from '../../Config';

const QRCodeGenerator = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateQRCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${CONFIG.URL}/api/qr/generate`, {}, {
        responseType: 'arraybuffer',
      });

      const zip = new JSZip();
      const contents = await zip.loadAsync(response.data);
      const imageFiles = [];

      for (const fileName of Object.keys(contents.files)) {
        const file = contents.files[fileName];
        if (!file.dir) {
          const fileData = await file.async('blob');
          const fileURL = URL.createObjectURL(fileData);
          imageFiles.push({ fileURL, fileName });
        }
      }

      setImages(imageFiles);
    } catch (error) {
      console.error('Error generating QR codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    const csvRows = [
      ['S.No', 'File Name', 'QR Code URL'],
      ...images.map((image, index) => [
        index + 1,
        image.fileName,
        image.fileURL,
      ]),
    ];

    const csvContent = csvRows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "qrcodes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <button onClick={generateQRCode} disabled={loading} className='filter-select'>
        {loading ? 'Generating...' : 'Generate QR Codes'}
      </button>
      <button onClick={downloadCSV} disabled={images.length === 0} className='download-btn' title='Download QR Code'>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><defs><linearGradient id="vscodeIconsFileTypeExcel0" x1="4.494" x2="13.832" y1="-2092.086" y2="-2075.914" gradientTransform="translate(0 2100)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#18884f" /><stop offset=".5" stop-color="#117e43" /><stop offset="1" stop-color="#0b6631" /></linearGradient></defs><path fill="#185c37" d="M19.581 15.35L8.512 13.4v14.409A1.19 1.19 0 0 0 9.705 29h19.1A1.19 1.19 0 0 0 30 27.809V22.5Z" /><path fill="#21a366" d="M19.581 3H9.705a1.19 1.19 0 0 0-1.193 1.191V9.5L19.581 16l5.861 1.95L30 16V9.5Z" /><path fill="#107c41" d="M8.512 9.5h11.069V16H8.512Z" /><path d="M16.434 8.2H8.512v16.25h7.922a1.2 1.2 0 0 0 1.194-1.191V9.391A1.2 1.2 0 0 0 16.434 8.2" opacity=".1" /><path d="M15.783 8.85H8.512V25.1h7.271a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191" opacity=".2" /><path d="M15.783 8.85H8.512V23.8h7.271a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191" opacity=".2" /><path d="M15.132 8.85h-6.62V23.8h6.62a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191" opacity=".2" /><path fill="url(#vscodeIconsFileTypeExcel0)" d="M3.194 8.85h11.938a1.193 1.193 0 0 1 1.194 1.191v11.918a1.193 1.193 0 0 1-1.194 1.191H3.194A1.19 1.19 0 0 1 2 21.959V10.041A1.19 1.19 0 0 1 3.194 8.85" /><path fill="#fff" d="m5.7 19.873l2.511-3.884l-2.3-3.862h1.847L9.013 14.6c.116.234.2.408.238.524h.017q.123-.281.26-.546l1.342-2.447h1.7l-2.359 3.84l2.419 3.905h-1.809l-1.45-2.711A2.4 2.4 0 0 1 9.2 16.8h-.024a1.7 1.7 0 0 1-.168.351l-1.493 2.722Z" /><path fill="#33c481" d="M28.806 3h-9.225v6.5H30V4.191A1.19 1.19 0 0 0 28.806 3" /><path fill="#107c41" d="M19.581 16H30v6.5H19.581Z" /></svg>
      </button>
      <div>
        {images.map((image, index) => (
          <img key={index} src={image.fileURL} alt={`QR Code ${index + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default QRCodeGenerator;
