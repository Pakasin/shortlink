import { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import { QrCode, Download, RefreshCw } from "lucide-react";

// ─── Design Tokens (Dark Theme) ─────────────────
const C = {
  surface: "rgba(255,255,255,0.06)",
  surfaceHigh: "rgba(255,255,255,0.1)",
  border: "rgba(255,255,255,0.08)",
  text: "#ffffff",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  primary: "#3b82f6",
  primaryGradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
};

interface QRGeneratorProps {
  url?: string;
  linkId?: number;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({ url: externalUrl, linkId }) => {
  const [url, setUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [color, setColor] = useState("#3b82f6");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (externalUrl) {
      setUrl(externalUrl);
      generateQR(externalUrl);
    }
  }, [externalUrl]);

  useEffect(() => {
    if (externalUrl && qrDataUrl) {
      generateQR(externalUrl);
    }
  }, [color]);

  const generateQR = async (urlToGenerate?: string) => {
    const urlToUse = urlToGenerate || url;
    if (!urlToUse) return;

    setIsLoading(true);
    try {
      const dataUrl = await QRCode.toDataURL(urlToUse, {
        width: 400,
        margin: 2,
        color: {
          dark: color,
          light: "#ffffff",
        },
      });
      setQrDataUrl(dataUrl);
    } catch (error) {
      console.error("Failed to generate QR:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `qr-code-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const colors = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#22c55e" },
    { name: "Red", value: "#ef4444" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Black", value: "#000000" },
  ];

  // If externalUrl is provided, show simplified view (preview only)
  if (externalUrl) {
    return (
      <div
        className="rounded-2xl p-6"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "20px",
          padding: "24px",
        }}
      >
        <h2
          className="font-headline text-xl font-bold mb-5 flex items-center gap-2"
          style={{ fontFamily: "'Manrope', sans-serif", color: C.text }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(59,130,246,0.15)" }}
          >
            <QrCode className="w-5 h-5" style={{ color: C.primary }} />
          </div>
          QR Code
        </h2>
        <div className="flex flex-col items-center">
          {qrDataUrl ? (
            <div className="text-center">
              <img
                src={qrDataUrl}
                alt="QR Code"
                className="w-48 h-48 mx-auto mb-4 rounded-xl shadow-lg"
                style={{ background: "#ffffff" }}
              />
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white transition-all hover:scale-105"
                style={{
                  background: C.primaryGradient,
                  fontFamily: "'Manrope', sans-serif",
                  boxShadow: "0 6px 20px rgba(59,130,246,0.3)",
                }}
              >
                <Download className="w-4 h-4" />
                Download PNG
              </button>
            </div>
          ) : (
            <div
              className="w-48 h-48 rounded-xl flex items-center justify-center"
              style={{ background: C.surface }}
            >
              <div className="text-center" style={{ color: C.textMuted }}>
                <RefreshCw className="w-16 h-16 mx-auto mb-2 animate-spin" />
                <p className="text-sm">Generating...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-6 mt-8"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "20px",
        padding: "24px",
      }}
    >
      <h2
        className="font-headline text-xl font-bold mb-5 flex items-center gap-2"
        style={{ fontFamily: "'Manrope', sans-serif", color: C.text }}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(59,130,246,0.15)" }}
        >
          <QrCode className="w-5 h-5" style={{ color: C.primary }} />
        </div>
        Generate QR Code
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: C.textMuted }}>
              URL or Text *
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com or any text"
              className="w-full rounded-xl outline-none transition-all"
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                color: C.text,
                fontFamily: "'Inter', sans-serif",
                padding: "14px 16px",
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: C.textMuted }}>
              QR Color
            </label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className="w-10 h-10 rounded-xl border-2 transition-all hover:scale-110"
                  style={{
                    backgroundColor: c.value,
                    borderColor: color === c.value ? "white" : "transparent",
                  }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <button
            onClick={generateQR}
            disabled={!url || isLoading}
            className="w-full py-3.5 rounded-xl font-bold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              background: C.primaryGradient,
              fontFamily: "'Manrope', sans-serif",
              boxShadow: "0 6px 20px rgba(59,130,246,0.3)",
            }}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate QR Code"
            )}
          </button>
        </div>

        {/* Preview Section */}
        <div className="flex flex-col items-center justify-center">
          {qrDataUrl ? (
            <div className="text-center">
              <img
                src={qrDataUrl}
                alt="Generated QR Code"
                className="w-48 h-48 mx-auto mb-4 rounded-xl shadow-lg"
                style={{ background: "#ffffff" }}
              />
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white transition-all hover:scale-105"
                style={{
                  background: C.primaryGradient,
                  fontFamily: "'Manrope', sans-serif",
                  boxShadow: "0 6px 20px rgba(59,130,246,0.3)",
                }}
              >
                <Download className="w-4 h-4" />
                Download PNG
              </button>
            </div>
          ) : (
            <div
              className="w-48 h-48 rounded-xl flex items-center justify-center"
              style={{ background: C.surface }}
            >
              <div className="text-center" style={{ color: C.textDim }}>
                <QrCode className="w-16 h-16 mx-auto mb-2" style={{ opacity: 0.3 }} />
                <p className="text-sm">QR preview</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
