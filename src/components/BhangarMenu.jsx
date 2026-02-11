import { motion } from "framer-motion";
import "./BhangarMenu.css";

function BhangarMenu({ setSelectedType }) {
  const bhangarTypes = [
    { label: "Plastic Bottle", value: "Bhangar - Plastic Bottle", emoji: "🥤" },
    { label: "Steel", value: "Bhangar - Steel", emoji: "🔩" },
    { label: "Aluminium", value: "Bhangar - Aluminium", emoji: "🥫" },
    { label: "Paper / Cardboard", value: "Bhangar - Paper", emoji: "📦" },
    { label: "E-Waste", value: "Bhangar - E-Waste", emoji: "💻" },
    { label: "Glass", value: "Bhangar - Glass", emoji: "🥛" },
  ];

  return (
    <motion.div
      className="bhangar-wrapper"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="bhangar-title">♻ Select Bhangar Type</h2>

      <div className="bhangar-grid">
        {bhangarTypes.map((item, i) => (
          <motion.div
            key={i}
            className="bhangar-card"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedType(item.value)}
          >
            <div className="bhangar-emoji">{item.emoji}</div>
            <span>{item.label}</span>
          </motion.div>
        ))}
      </div>

      <button className="back-btn" onClick={() => setSelectedType("")}>
        ⬅ Back
      </button>
    </motion.div>
  );
}

export default BhangarMenu;
