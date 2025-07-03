// QRCodeWithLogo.jsx
import React, { useEffect, useRef } from "react";
import QRCodeWithLogo from "qrcode-with-logos";

const QRCodeWithLogoComponent = ({ value, logoUrl, size = 400 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!value || !logoUrl || !canvasRef.current) return;

        const qr = new QRCodeWithLogo({
            canvas: canvasRef.current,
            content: value,
            width: size,
            logo: {
                src: logoUrl,
                // logoSize: 1,
                // borderRadius: 8,
                // borderColor: "#ffffff",
                // borderSize: 1,

                // logoRadius: 50,
                // bgColor: 'green',
                // crossOrigin: string
                // borderWidth: number;
            },
            dotsOptions: {
                type: 'dot',
            },
            cornersOptions: {
                type: 'circle',
            },
            nodeQrCodeOptions: {
                errorCorrectionLevel: "H",
            },
        });
    }, [value, logoUrl, size]);

    // Безопасный рендер — только если всё есть
    if (!value || !logoUrl) return null;

    return <canvas ref={canvasRef} width={size} height={size} style={{ width:'100%' }}/>;
};

export default QRCodeWithLogoComponent;