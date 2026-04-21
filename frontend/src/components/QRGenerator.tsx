import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { useTranslation } from "../contexts/AuthContext";
import { QrCode, Download, RefreshCw } from "lucide-react";

interface QRGeneratorProps { url: string; linkId?: number; color?: string; logo?: string; className?: string; }

export const QRGenerator: React.FC<QRGeneratorProps> = ({ url, color = "#000000", logo, className = "" }) => {
  const t = useTranslation();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const generateQR = async () => {
      if (!url) { setQrCodeUrl(""); return; }
      setIsGenerating(true);
      try {
        const qrDataUrl = await QRCode.toDataURL(url, {
          width: 800, margin: 2, color: { dark: color, light: "#ffffff" },
          errorCorrectionLevel: "H",
        });
        
        if (logo) {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const img = new Image();
          img.crossOrigin = "Anonymous";
          
          await new Promise((resolve, reject) => {
            img.onload = resolve; img.onerror = reject; img.src = qrDataUrl;
          });
          
          canvas.width = img.width; canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          
          const logoImg = new Image();
          logoImg.crossOrigin = "Anonymous";
          await new Promise((resolve, reject) => {
            logoImg.onload = resolve; logoImg.onerror = reject; logoImg.src = logo;
          });
          
          const logoSize = canvas.width * 0.2;
          const logoX = (canvas.width - logoSize) / 2;
          const logoY = (canvas.height - logoSize) / 2;
          
          ctx?.beginPath();
          ctx?.arc(canvas.width / 2, canvas.height / 2, logoSize / 2 + 10, 0, 2 * Math.PI);
          ctx!.fillStyle = "#ffffff";
          ctx?.fill();
          ctx?.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
          
          setQrCodeUrl(canvas.toDataURL("image/png"));
        } else {
          setQrCodeUrl(qrDataUrl);
        }
      } catch (err) { console.error("Error generating QR code:", err); }
      finally { setIsGenerating(false); }
    };

    generateQR();
  }, [url, color, logo]);

  const handleDownload = () => {
    if (!qrCodeUrl) return;
    const a = document.createElement("a");
    a.href = qrCodeUrl;
    a.download = `qr-code-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      {isGenerating ? (
        <div className="w-40 h-40 flex flex-col items-center justify-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <RefreshCw size={24} className="text-slate-400 animate-spin" />
          <span className="text-xs font-medium text-slate-500">{t.qr.generating}</span>
        </div>
      ) : qrCodeUrl ? (
        <div className="relative group">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-transform duration-300 group-hover:scale-105">
            <img src={qrCodeUrl} alt="QR Code" className="w-40 h-40 object-contain" />
          </div>
          <button onClick={handleDownload} className="absolute -bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold rounded-full shadow-lg hover:bg-slate-800 dark:hover:bg-slate-700">
            <Download size={14} />{t.qr.downloadPNG}
          </button>
        </div>
      ) : (
        <div className="w-40 h-40 flex flex-col items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
          <QrCode size={32} className="text-slate-300 dark:text-slate-600" />
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{t.qr.preview}</span>
        </div>
      )}
    </div>
  );
};
