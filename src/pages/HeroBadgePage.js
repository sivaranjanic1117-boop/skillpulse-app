import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";
import quizDatabase from "../data/quizDatabase";
import "./HeroBadgePage.css";

const LEVELS = ["beginner", "intermediate", "advanced"];

const levelToBadge = {
    beginner: "bronze",
    intermediate: "silver",
    advanced: "gold",
};

const prettyLevel = (level) => {
    if (!level || level === "none") return "Not Available";
    return `${level.charAt(0).toUpperCase()}${level.slice(1)}`;
};

const prettyBadge = (badge) => {
    if (!badge) return "Not Awarded";
    return `${badge.charAt(0).toUpperCase()}${badge.slice(1)}`;
};

const escapeHtml = (value) =>
    String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

const getBadgeTheme = (badgeLabel) => {
    if (badgeLabel === "gold") {
        return {
            className: "gold",
            main: "#f6c94c",
            deep: "#b7791f",
            light: "#fff1a8",
            ring: "#fff0b3",
            ribbon: "#d4a63a",
            ribbonDeep: "#9a6710",
        };
    }

    if (badgeLabel === "silver") {
        return {
            className: "silver",
            main: "#d7dbe1",
            deep: "#7a7f87",
            light: "#fbfdff",
            ring: "#eef2f7",
            ribbon: "#c1c7cf",
            ribbonDeep: "#8d939b",
        };
    }

    return {
        className: "bronze",
        main: "#d7a06e",
        deep: "#9c5b2f",
        light: "#f8d2b1",
        ring: "#ffe2cc",
        ribbon: "#d9905d",
        ribbonDeep: "#a95f34",
    };
};

const playCelebration = () => {
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) {
            const ctx = new Ctx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.35);
            gain.gain.setValueAtTime(0.001, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.45);
        }
    } catch {
        // Audio is optional.
    }

    if (window.speechSynthesis) {
        const msg = new SpeechSynthesisUtterance("Cheers! Yay! Hero badge unlocked!");
        msg.rate = 1.05;
        window.speechSynthesis.speak(msg);
    }
};

const certificateHtml = (certificate, badgeLabel, highestLevelPassed, profileImageFallback) => {
    const theme = getBadgeTheme(badgeLabel);
    const profileImage = (certificate.profileImage || profileImageFallback)
        ? `<div class="avatar-frame"><img src="${escapeHtml(certificate.profileImage || profileImageFallback)}" alt="Profile image" /></div>`
        : `<div class="avatar-frame placeholder">${escapeHtml((certificate.learnerName || "L").slice(0, 1).toUpperCase())}</div>`;

    return `<!doctype html>
<html><head><meta charset="utf-8" /><title>SkillPulse Badge</title>
<style>
body{margin:0;background:#e5e7eb;padding:20px;font-family:Georgia,serif;color:#0f3558}
.frame{position:relative;max-width:1100px;min-height:760px;margin:0 auto;background:linear-gradient(180deg,#fffdf7 0%,#f7f1df 100%);overflow:hidden;border:1px solid rgba(120,53,15,.14);box-shadow:0 30px 60px rgba(15,23,42,.2)}
.corner{position:absolute;width:360px;height:180px;background:linear-gradient(135deg,#0f766e,#0e7490,#155e75);opacity:.95}
.corner.tl{top:0;left:0;clip-path:polygon(0 0,100% 0,70% 22%,0 22%)}
.corner.br{bottom:0;right:0;clip-path:polygon(30% 78%,100% 78%,100% 100%,0 100%)}
.corner.tr{top:0;right:0;clip-path:polygon(30% 0,100% 0,100% 100%,70% 78%)}
.corner.bl{bottom:0;left:0;clip-path:polygon(0 0,30% 22%,70% 100%,0 100%)}
.content{position:relative;z-index:2;padding:72px 72px 60px;text-align:center}
.title{font-size:92px;line-height:1;color:#0b3f67;font-weight:700;letter-spacing:1px;margin:0}
.subtitle{margin:0 auto 24px;display:inline-block;padding:8px 18px;border-top:4px solid #0b3f67;border-bottom:4px solid #0b3f67;color:#1ea6a7;font-size:42px;letter-spacing:5px}
.lead{font-size:42px;color:#19a9ae;font-family:"Brush Script MT",cursive;margin:10px 0 10px}
.divider{width:72%;margin:8px auto 16px;border-top:4px solid #86a2b7}
.body{font-size:36px;line-height:1.55;color:#1f4e70;max-width:76%;margin:0 auto}
.profile-row{display:flex;justify-content:center;align-items:center;gap:18px;margin:18px 0 10px}
.avatar-frame{width:100px;height:100px;border-radius:50%;overflow:hidden;border:5px solid ${theme.ring};box-shadow:0 12px 24px rgba(15,23,42,.18),inset 0 0 0 8px rgba(255,255,255,.35);background:radial-gradient(circle at 30% 25%,${theme.light},${theme.main})}
.avatar-frame.placeholder{display:grid;place-items:center;font-size:42px;font-weight:700;color:#0f3558}
.avatar-frame img{width:100%;height:100%;object-fit:cover}
.meta{margin:24px auto 0;max-width:78%;display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:26px;color:#0f3558;text-align:left}
.meta p{margin:0;padding:14px 16px;border-radius:12px;background:rgba(255,255,255,.72);border:1px solid rgba(15,23,42,.08)}
.seal{margin-top:26px;font-size:48px;color:#0f3558}
.footer{margin-top:14px;font-size:24px;color:#45657e}
</style></head>
<body>
<div class="frame">
  <div class="corner tl"></div><div class="corner tr"></div><div class="corner bl"></div><div class="corner br"></div>
  <div class="content">
    <h1 class="title">Certificate</h1>
    <div class="subtitle">OF COMPLETION</div>
    <p class="body">This certificate is awarded to:</p>
        <div class="profile-row">
            ${profileImage}
            <p class="lead">${escapeHtml(certificate.learnerName)}</p>
        </div>
    <div class="divider"></div>
        <p class="body">For successfully completing the <strong>${escapeHtml(certificate.roleName)}</strong> learning pathway in SkillPulse.</p>
    <div class="meta">
            <p><strong>Badge Received:</strong> ${escapeHtml(prettyBadge(badgeLabel))}</p>
            <p><strong>Highest Level Passed:</strong> ${escapeHtml(prettyLevel(highestLevelPassed))}</p>
            <p><strong>Certificate ID:</strong> ${escapeHtml(certificate.id)}</p>
            <p><strong>Issued On:</strong> ${escapeHtml(new Date(certificate.issuedAt).toLocaleDateString())}</p>
    </div>
    <div class="seal">✓</div>
    <p class="footer">SkillPulse Professional Credential</p>
  </div>
</div>
</body></html>`;
};

const badgeHtml = (roleName, badgeLabel, highestLevelPassed, profileImage) => {
    const theme = getBadgeTheme(badgeLabel);
    const avatarMarkup = profileImage
        ? `<div class="profile-avatar"><img src="${escapeHtml(profileImage)}" alt="Profile image" /></div>`
        : `<div class="profile-avatar placeholder">${escapeHtml((roleName || "S").slice(0, 1).toUpperCase())}</div>`;

    return `<!doctype html>
<html><head><meta charset="utf-8" /><title>SkillPulse Badge</title>
<style>
body{display:grid;place-items:center;min-height:100vh;background:radial-gradient(circle at top,#1f2937,#020617 70%);color:#e2e8f0;font-family:Arial,sans-serif;margin:0;padding:28px}
.wrap{display:grid;gap:18px;justify-items:center;max-width:520px;width:100%}
.medal-rack{position:relative;width:390px;height:470px;display:grid;place-items:start center;padding-top:18px}
.ribbon{position:absolute;bottom:42px;width:82px;height:170px;background:linear-gradient(180deg,${theme.light},${theme.ribbon},${theme.ribbonDeep});clip-path:polygon(18% 0,82% 0,100% 100%,50% 84%,0 100%);box-shadow:0 14px 18px rgba(0,0,0,.25)}
.ribbon.left{left:80px;transform:rotate(2deg)}
.ribbon.right{right:80px;transform:rotate(-2deg)}
.ribbon.left::after,.ribbon.right::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.18),transparent 55%)}
.medal{position:relative;width:300px;height:300px;border-radius:50%;display:grid;place-items:center;text-align:center;padding:18px;margin-top:10px;z-index:2;
background:
    radial-gradient(circle at 30% 22%, rgba(255,255,255,.72), rgba(255,255,255,0) 38%),
    radial-gradient(circle at 50% 55%, ${theme.light} 0%, ${theme.main} 60%, ${theme.deep} 100%);
box-shadow:0 22px 34px rgba(0,0,0,.38), inset 0 0 0 12px rgba(255,255,255,.18), inset 0 0 0 26px rgba(255,255,255,.08)}
.medal::before{content:"";position:absolute;inset:-18px;border-radius:50%;background:repeating-conic-gradient(from 0deg, ${theme.ring} 0 10deg, ${theme.main} 10deg 20deg);mask:radial-gradient(circle, transparent 0 79%, #000 79% 100%);box-shadow:0 0 0 6px rgba(255,255,255,.18)}
.medal::after{content:"";position:absolute;inset:14px;border-radius:50%;border:3px dashed rgba(255,255,255,.55);box-shadow:inset 0 0 0 8px rgba(255,255,255,.08)}
.medal-inner{position:relative;z-index:1;display:grid;justify-items:center;gap:8px;padding:24px;width:100%}
.profile-avatar{width:88px;height:88px;border-radius:50%;overflow:hidden;border:5px solid rgba(255,255,255,.75);box-shadow:0 10px 18px rgba(0,0,0,.24);background:radial-gradient(circle at 30% 20%,#ffffff,#cbd5e1)}
.profile-avatar.placeholder{display:grid;place-items:center;font-size:34px;font-weight:700;color:#1f2937}
.profile-avatar img{width:100%;height:100%;object-fit:cover}
h1{margin:0;font-size:30px;text-transform:uppercase;letter-spacing:1.4px;color:#1f2937;text-shadow:0 1px 0 rgba(255,255,255,.55)}
p{margin:4px 0 0;font-size:18px;color:#1f2937;font-weight:700}
.meta{background:rgba(15,23,42,.72);border:1px solid rgba(148,163,184,.2);border-radius:16px;padding:16px 18px;min-width:min(420px,100%);backdrop-filter:blur(10px);box-shadow:0 18px 36px rgba(0,0,0,.25)}
.meta p{margin:8px 0;color:#cbd5e1;font-size:16px;font-weight:600}
.meta strong{color:#f8fafc}
</style></head>
<body>
<div class="wrap">
    <div class="medal-rack ${theme.className}">
        <div class="ribbon left"></div>
        <div class="ribbon right"></div>
        <div class="medal">
            <div class="medal-inner">
                ${avatarMarkup}
                <h1>${escapeHtml(prettyBadge(badgeLabel))}</h1>
                <p>${escapeHtml(roleName)}</p>
            </div>
        </div>
  </div>
  <div class="meta">
        <p><strong>Badge Received:</strong> ${escapeHtml(prettyBadge(badgeLabel))}</p>
        <p><strong>Highest Level Passed:</strong> ${escapeHtml(prettyLevel(highestLevelPassed))}</p>
  </div>
</div>
</body></html>`;
};

export default function HeroBadgePage() {
    const navigate = useNavigate();
    const {
        user,
        roleName,
        dreamJob,
        allSkillQuizzesPassed,
        assessmentResults,
        completeAssessment,
        canAttemptHeroLevel,
        canIssueCertificate,
        heroBadgeLevel,
        tapTreasure,
        treasureState,
        issueCertificate,
        certificate,
    } = useApp();

    const normalizedRole = useMemo(() => {
        const role = roleName || dreamJob || "AI Engineer";
        const keys = Object.keys(quizDatabase);
        const found = keys.find((k) => k.toLowerCase() === role.toLowerCase());
        return found || role;
    }, [roleName, dreamJob]);

    const [activeLevel, setActiveLevel] = useState("beginner");
    const [idx, setIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    const questions = quizDatabase?.[normalizedRole]?.[activeLevel] || [];

    const resetRun = () => {
        setIdx(0);
        setScore(0);
        setFinished(false);
    };

    const handleLevelChange = (level) => {
        if (!canAttemptHeroLevel(assessmentResults, level)) {
            alert("Complete the previous level first.");
            return;
        }
        setActiveLevel(level);
        resetRun();
    };

    const handleAnswer = (option) => {
        if (!questions.length) return;

        let nextScore = score;
        if (option === questions[idx].answer) {
            nextScore += 1;
            setScore(nextScore);
        }

        const next = idx + 1;
        if (next < questions.length) {
            setIdx(next);
            return;
        }

        completeAssessment(activeLevel, nextScore, questions.length);
        setFinished(true);
    };

    const passedCurrent = finished && score / (questions.length || 1) >= 0.7;

    const handleGoNextLevel = () => {
        const currentIdx = LEVELS.indexOf(activeLevel);
        if (currentIdx >= LEVELS.length - 1) return;

        const next = LEVELS[currentIdx + 1];
        if (canAttemptHeroLevel(assessmentResults, next)) {
            handleLevelChange(next);
        }
    };

    const handleGenerateCertificate = () => {
        const res = issueCertificate();
        if (!res.ok) {
            alert(res.msg);
            return;
        }
        alert("Professional certificate generated.");
    };

    const handleTreasureTap = () => {
        const result = tapTreasure();
        if (result.opened && !treasureState.opened) {
            playCelebration();
        }
    };

    const downloadFile = (content, fileName) => {
        const blob = new Blob([content], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (!allSkillQuizzesPassed) {
        return (
            <div className="hero-page"><div className="hero-card"><h2>Hero challenge is locked</h2><button onClick={() => navigate("/roadmap")}>Back to Roadmap</button></div></div>
        );
    }

    if (!questions.length) {
        return (
            <div className="hero-page"><div className="hero-card"><h2>No final quiz found for {normalizedRole}</h2></div></div>
        );
    }

    const badgeLabel = certificate?.badgeAwarded || heroBadgeLevel || levelToBadge[activeLevel];
    const highestLevelPassed = certificate?.highestLevelPassed || (heroBadgeLevel === "gold" ? "advanced" : heroBadgeLevel === "silver" ? "intermediate" : heroBadgeLevel === "bronze" ? "beginner" : "none");
    const profileImage = certificate?.profileImage || user?.profileImage || null;

    return (
        <div className="hero-page">
            <div className="hero-card">
                <h1>Hero Badge Challenge</h1>
                <p>Complete quizzes in order. You can claim a certificate and badge at your current completed level any time.</p>

                <div className="hero-levels">
                    {LEVELS.map((level) => (
                        <button key={level} onClick={() => handleLevelChange(level)} disabled={!canAttemptHeroLevel(assessmentResults, level)}>
                            {level}
                        </button>
                    ))}
                </div>

                <div className="hero-quiz">
                    {!finished ? (
                        <>
                            <p>Question {idx + 1} / {questions.length}</p>
                            <h3>{questions[idx].question}</h3>
                            <div className="hero-options">
                                {questions[idx].options.map((opt) => (
                                    <button key={opt} onClick={() => handleAnswer(opt)}>{opt}</button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <p>Score: {score}/{questions.length}</p>
                            <p>{passedCurrent ? "Passed." : "Retry required for 70%+"}</p>
                            <div className="hero-result-actions">
                                <button onClick={resetRun}>Retry Level</button>
                                {passedCurrent && (
                                    <>
                                        {activeLevel !== "advanced" && (
                                            <button onClick={handleGoNextLevel}>Go to Next Level</button>
                                        )}
                                        <button onClick={handleGenerateCertificate}>Generate Certificate</button>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {(canIssueCertificate || certificate) && (
                    <div className="treasure-wrap">
                        <button className={`treasure ${treasureState.opened ? "opened" : ""}`} onClick={handleTreasureTap}>
                            {treasureState.opened ? "🎉 Opened" : "🧰 Tap Treasure Box"}
                        </button>
                        <p>Tap twice to open treasure and reveal your level-based badge.</p>
                    </div>
                )}

                {treasureState.opened && (
                    <div className="badge-reveal">
                        <h3>{badgeLabel?.toUpperCase()} Hero Badge - {normalizedRole}</h3>
                        <p>Badge Received: {prettyBadge(badgeLabel)} | Highest Level Passed: {prettyLevel(highestLevelPassed)}</p>
                        <div className="hero-result-actions">
                            <button onClick={() => downloadFile(badgeHtml(normalizedRole, badgeLabel, highestLevelPassed, profileImage), `${normalizedRole.replace(/[^a-z0-9]/gi, "_")}_${badgeLabel}_badge.html`)}>
                                Download Badge
                            </button>
                            {certificate && (
                                <button onClick={() => downloadFile(certificateHtml(certificate, badgeLabel, highestLevelPassed, user?.profileImage || null), `${normalizedRole.replace(/[^a-z0-9]/gi, "_")}_certificate.html`)}>
                                    Download Certificate
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {certificate && (
                    <section className="certificate-preview-shell" aria-label="Certificate preview">
                        <div className="certificate-preview-head">
                            <div>
                                <span className="preview-kicker">Certificate Preview</span>
                                <h2>Printable A4 landscape layout</h2>
                                <p>Review the issued credential before downloading a copy.</p>
                            </div>
                            <div className="hero-result-actions">
                                <button onClick={() => downloadFile(certificateHtml(certificate, badgeLabel, highestLevelPassed, profileImage), `${normalizedRole.replace(/[^a-z0-9]/gi, "_")}_certificate.html`)}>
                                    Download Certificate
                                </button>
                            </div>
                        </div>

                        <div className="certificate-preview-card">
                            <div className="certificate-border">
                                <div className="certificate-topline">
                                    <span>SkillPulse Academy</span>
                                    <span>Certificate ID: {certificate.id}</span>
                                </div>

                                <div className="certificate-main">
                                    <div className="certificate-ribbon">Professional Certificate</div>
                                    <h3>Certificate of Completion</h3>
                                    <p className="certificate-body-copy">This certifies that</p>
                                    <div className="certificate-student">
                                        {profileImage ? (
                                            <div className="certificate-avatar"><img src={profileImage} alt="Student portrait" /></div>
                                        ) : (
                                            <div className="certificate-avatar">{(certificate.learnerName || "L").slice(0, 1).toUpperCase()}</div>
                                        )}
                                        <strong>{certificate.learnerName}</strong>
                                    </div>
                                    <p className="certificate-course">has successfully completed the <strong>{certificate.roleName}</strong> learning pathway.</p>

                                    <div className="certificate-meta-grid">
                                        <div className="certificate-meta-item">
                                            <span>Course / Track</span>
                                            <strong>{certificate.roleName}</strong>
                                        </div>
                                        <div className="certificate-meta-item">
                                            <span>Completion Date</span>
                                            <strong>{new Date(certificate.issuedAt).toLocaleDateString()}</strong>
                                        </div>
                                        <div className="certificate-meta-item">
                                            <span>Badge Level</span>
                                            <strong>{prettyBadge(badgeLabel)}</strong>
                                        </div>
                                        <div className="certificate-meta-item">
                                            <span>Highest Level Passed</span>
                                            <strong>{prettyLevel(highestLevelPassed)}</strong>
                                        </div>
                                    </div>

                                    <div className="certificate-footer">
                                        <div className="signature-block">
                                            <div className="signature-line" />
                                            <span>Authorized Signature</span>
                                            <strong>Academic Director</strong>
                                        </div>

                                        <div className="qr-block">
                                            <div className="qr-box">QR Area</div>
                                            <span>Verification Area</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
