import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPhoneCall, FiMail } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const Emergency = () => {
    const navigate = useNavigate();

    const helpers = [
        {
            name: "AASRA",
            phone: "+912227546669",
            whatsapp: "9191227546669",
            email: "aasrahelpline@gmail.com"
        },
        {
            name: "Vandrevala Foundation",
            phone: "+9118602662345",
            whatsapp: "918602662345",
            email: "support@vandrevalafoundation.com"
        },
        {
            name: "iCall",
            phone: "+912225521111",
            whatsapp: null,
            email: "icall@tiss.edu"
        }
    ];

    return (
        <div className="emergency-screen fade-in">
            <button className="back-btn" onClick={() => navigate('/')}>&larr; Back</button>
            <div className="card-elevated">
                <div className="text-center mb-l">
                    <h1>You Don't Have to Face This Alone</h1>
                    <p className="text-muted">Please reach out to someone who can help:</p>
                </div>
                <div className="divider mb-l"></div>
                <h3 className="mb-m">Crisis Helplines (24/7)</h3>
                {helpers.map((helper, index) => (
                    <div
                        key={index}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "12px 14px",
                            borderRadius: "10px",
                            border: "1px solid #ccc",
                            marginBottom: "10px"
                        }}
                    >
                        {/* Left: Name */}
                        <span style={{ fontWeight: 600, fontSize: "16px" }}>
                            {helper.name}
                        </span>

                        {/* Right: Actions */}
                        <div style={{ display: "flex", gap: "10px" }}>

                            {/* Call */}
                            <a
                                href={`tel:${helper.phone}`}
                                style={{
                                    width: "38px",
                                    height: "38px",
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "2px solid #0d6efd",
                                    color: "#0d6efd",
                                    background: "transparent",
                                    transition: "all 0.2s ease",
                                    textDecoration: "none"
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = "#0d6efd"
                                    e.currentTarget.style.color = "#fff"
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = "transparent"
                                    e.currentTarget.style.color = "#0d6efd"
                                }}
                            >
                                <FiPhoneCall />
                            </a>

                            {/* WhatsApp (only if exists) */}
                            {helper.whatsapp && (
                                <a
                                    href={`https://wa.me/${helper.whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        width: "38px",
                                        height: "38px",
                                        borderRadius: "8px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: "2px solid #25d366",
                                        color: "#25d366",
                                        background: "transparent",
                                        transition: "all 0.2s ease",
                                        textDecoration: "none"
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = "#25d366"
                                        e.currentTarget.style.color = "#fff"
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = "transparent"
                                        e.currentTarget.style.color = "#25d366"
                                    }}
                                >
                                    <FaWhatsapp />
                                </a>
                            )}

                            {/* Mail */}
                            <a
                                href={`mailto:${helper.email}`}
                                style={{
                                    width: "38px",
                                    height: "38px",
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "2px solid #6c757d",
                                    color: "#6c757d",
                                    background: "transparent",
                                    transition: "all 0.2s ease",
                                    textDecoration: "none"
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = "#6c757d"
                                    e.currentTarget.style.color = "#fff"
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = "transparent"
                                    e.currentTarget.style.color = "#6c757d"
                                }}
                            >
                                <FiMail />
                            </a>

                        </div>
                    </div>
                ))}
                <div className="divider mb-l"></div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        I'm Safe Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Emergency;
