import React, { useEffect, useRef } from "react";
import { drawLogoQRCode } from "qrcode-with-logos";

const QRCodeWithLogo = ({ value, logoUrl, size = 200 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!value || !canvasRef.current) return;

        drawLogoQRCode({
            canvas: canvasRef.current,
            content: value,
            width: size,
            logo: {
                src: logoUrl,
                logoSize: 0.2,       // 20% от размера QR
                borderRadius: 8,     // скругление
                borderColor: "#ffffff",
                borderSize: 4
            },
            nodeQrCodeOptions: {
                errorCorrectionLevel: "H",
            },
        });
    }, [value, logoUrl, size]);

    return (
        <div style={{ display: "inline-block" }}>
            <canvas ref={canvasRef} width={size} height={size} />
        </div>
    );
};

export default QRCodeWithLogo;