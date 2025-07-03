// QRCodeWithLogo.jsx
import React, { useEffect, useRef } from "react";
import QRCodeWithLogo from "qrcode-with-logos";

const QRCodeWithLogoComponent = ({ value, logoUrl, size = 200 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!value || !logoUrl || !canvasRef.current) return;

        const qr = new QRCodeWithLogo({
            canvas: canvasRef.current,
            content: value,
            width: size,
            logo: {
                src: logoUrl,
                logoSize: 0.2,
                borderRadius: 8,
                borderColor: "#ffffff",
                borderSize: 4,
            },
            nodeQrCodeOptions: {
                errorCorrectionLevel: "H",
            },
        });

        qr.draw().catch(console.error);
    }, [value, logoUrl, size]);

    // Безопасный рендер — только если всё есть
    if (!value || !logoUrl) return null;

    return <canvas ref={canvasRef} width={size} height={size} />;
};

export default QRCodeWithLogoComponent;