import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Users } from "lucide-react";
import { parseGroupsFromText, getShuffledTeams } from "./teamUtils";

export default function TeamReveal() {
  const [step, setStep] = useState(0);
  const [revealing, setRevealing] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [teams, setTeams] = useState([]);
  const [fileLoaded, setFileLoaded] = useState(false);

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
    await new Promise((res) => setTimeout(res, 2000));
    setRevealing(false);
    if (step < teams.length) setStep((prev) => prev + 1);
    else setShowFinal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-8 text-center">
      <h1 className="text-4xl font-bold mb-8">⭐ 밀알 조 발표 ⭐</h1>

      {!fileLoaded && (
        <div className="space-y-4">
          <p className="text-lg">텍스트 파일을 업로드해 주세요.</p>
          <input type="file" accept=".txt" onChange={handleFileUpload} />
        </div>
      )}

      {fileLoaded && step === 0 && !revealing && (
        <button onClick={handleRevealNext} className="mt-6 px-6 py-3 text-xl bg-purple-500 text-white rounded-xl">
          팀 발표 시작하기
        </button>
      )}

      {revealing && (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="animate-spin w-12 h-12 text-purple-700" />
          <p className="ml-4 text-xl">팀을 뽑는 중...</p>
        </div>
      )}

      {!revealing && step > 0 && !showFinal && (
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4 flex items-center justify-center">
              <Users className="mr-2" /> {step} 조
            </h2>
            <ul className="team-member-list">
              {teams[step - 1].map((member, idx) => (
                <li key={idx}>{member}</li>
              ))}
            </ul>
          </div>
          <button onClick={handleRevealNext} className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-xl">
            다음 조 보기
          </button>
        </motion.div>
      )}

{showFinal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="final-teams"
        >
          <h2>🎉 최종 팀 결과 🎉</h2>

          <div className="grid-container">
            {teams.map((team, i) => (
              <div key={i} className="team-card">
                <h3>{i + 1} 조</h3>
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
