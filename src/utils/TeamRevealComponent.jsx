import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Users } from "lucide-react";
import { parseGroupsFromText, getShuffledTeams } from "./teamUtils";

export default function TeamReveal() {
  const [step, setStep] = useState(0);
  const [revealing, setRevealing] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [teams, setTeams] = useState([]);
  const [fileLoaded, setFileLoaded] = useState(false);

  // ⏱ 타이머 관련 상태
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20분(초)
  const [isPaused, setIsPaused] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(20); // 사용자가 설정할 분 단위 시간

  // ⏱ 타이머 시작/정지 효과
  useEffect(() => {
    if (!showFinal) return;

    const timer = setInterval(() => {
      if (!isPaused) {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [showFinal, isPaused]);

  // ⏱ 시간을 MM:SS 형식으로 변환
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const { aGroup, bGroup, cGroup } = parseGroupsFromText(text);
      const generatedTeams = getShuffledTeams(aGroup, bGroup, cGroup);
      setTeams(generatedTeams);
      setFileLoaded(true);
    };
    reader.readAsText(file);
  };

  const handleRevealNext = async () => {
    setRevealing(true);
    await new Promise((res) => setTimeout(res, 1000));
    setRevealing(false);
    if (step < teams.length) setStep((prev) => prev + 1);
    else setShowFinal(true);
  };

  const handleSetTimer = () => {
    const seconds = customMinutes * 60;
    setTimeLeft(seconds);
    setIsPaused(false);
  };

  return (
    <div className="container">
      <h1>⭐ 홀리씨드 조 발표 ⭐</h1>

      {!fileLoaded && (
        <div className="upload-section">
          <p>텍스트 파일을 업로드해 주세요.</p>
          <input type="file" accept=".txt" onChange={handleFileUpload} />
        </div>
      )}

      {fileLoaded && step === 0 && !revealing && (
        <button onClick={handleRevealNext}>팀 발표 시작하기</button>
      )}

      {revealing && (
        <div className="loading">
          <Loader2 className="loading-icon" />
          <p style={{ marginLeft: "1rem" }}>팀을 뽑는 중...</p>
        </div>
      )}

      {!revealing && step > 0 && !showFinal && (
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="current-team"
        >
          <div className="single-team-card">
            <h2>
              <Users style={{ marginRight: "0.5rem" }} />
              {step}조
            </h2>
            <ul className="team-member-list">
              {teams[step - 1].map((member, idx) => (
                <li key={idx}>{member}</li>
              ))}
            </ul>
          </div>
          <button onClick={handleRevealNext}>다음 조 보기</button>
        </motion.div>
      )}

      {showFinal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="final-teams"
        >
          <h2>🎉 최종 팀 결과 🎉</h2>

          {/* ⏱ 타이머 UI */}
          <div className="timer">
            ⏰ 남은 시간: <strong>{formatTime(timeLeft)}</strong>
            <div style={{ marginTop: "0.5rem" }}>
              <button onClick={() => setIsPaused((prev) => !prev)}>
                {isPaused ? "▶️ 다시 시작" : "⏸ 일시정지"}
              </button>
              <button
                onClick={() => {
                  setTimeLeft(customMinutes * 60);
                  setIsPaused(true);
                }}
                style={{ marginLeft: "1rem" }}
              >
                🔄 리셋
              </button>
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <input
                type="number"
                min="1"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(Number(e.target.value))}
              />
              <span> 분으로 설정</span>
              <button onClick={handleSetTimer} style={{ marginLeft: "1rem" }}>
                ⏱ 적용
              </button>
            </div>
          </div>

          <div className="grid-container">
            {teams.map((team, i) => (
              <div key={i} className="team-card">
                <h3>{i + 1}조</h3>
                {team.map((member, idx) => (
                  <p key={idx}>{member}</p>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
