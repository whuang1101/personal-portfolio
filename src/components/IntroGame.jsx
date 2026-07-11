import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const positions = [{ left: "18%", top: "23%" }, { left: "70%", top: "18%" }, { left: "74%", top: "66%" }];

// eslint-disable-next-line react/prop-types
const IntroGame = ({ onEnter }) => {
  const [score, setScore] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    targetRef.current?.focus();
    return () => { document.body.style.overflow = ""; };
  }, []);

  const catchSignal = () => {
    if (score === 2) {
      setScore(3);
      setUnlocked(true);
      window.setTimeout(onEnter, 850);
      return;
    }
    setScore((value) => value + 1);
    window.setTimeout(() => targetRef.current?.focus(), 50);
  };

  return (
    <motion.div className="intro-game" exit={{ opacity: 0, scale: 1.04, filter: "blur(16px)" }} transition={{ duration: .65 }}>
      <div className="game-grid" />
      <header className="game-header"><span className="game-brand">WH / PORTFOLIO</span><button type="button" onClick={onEnter}>Skip intro ↗</button></header>
      <div className="game-copy">
        <span className="game-label">Interactive entry sequence</span>
        <h1>{unlocked ? "Signal acquired." : <>Catch the <em>signal.</em></>}</h1>
        <p>{unlocked ? "Welcome in." : "Tap the moving node three times to unlock the experience."}</p>
      </div>
      <div className="game-field" aria-label="Signal catching game">
        <AnimatePresence mode="wait">
          {!unlocked && <motion.button ref={targetRef} key={score} className="signal-target" type="button" aria-label={`Catch signal ${score + 1} of 3`} style={positions[score]} initial={{ opacity: 0, scale: .3 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.8 }} whileHover={{ scale: 1.16 }} whileTap={{ scale: .84 }} onClick={catchSignal}><span /><i /></motion.button>}
        </AnimatePresence>
        {unlocked && <motion.div className="unlock-ring" initial={{ scale: 0, opacity: 1 }} animate={{ scale: 18, opacity: 0 }} transition={{ duration: 1 }} />}
      </div>
      <div className="game-progress"><span>Signal strength</span><div>{[0, 1, 2].map((step) => <i key={step} className={score > step ? "filled" : ""} />)}</div><strong>{score}/3</strong></div>
      <span className="game-hint">Mouse / touch / Enter key</span>
    </motion.div>
  );
};

export default IntroGame;
