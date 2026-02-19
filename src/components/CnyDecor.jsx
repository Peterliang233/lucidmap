import { CNY_THEME_ENABLED } from "../config/theme.js";

export default function CnyDecor() {
  if (!CNY_THEME_ENABLED) return null;

  return (
    <div className="cny-decor" aria-hidden="true">
      <div className="cny-lantern cny-lantern--l">
        <div className="cny-lantern__string" />
        <div className="cny-lantern__body">
          <div className="cny-lantern__glow" />
          <span className="cny-lantern__text">福</span>
        </div>
        <div className="cny-lantern__tassel" />
      </div>
      <div className="cny-lantern cny-lantern--r">
        <div className="cny-lantern__string" />
        <div className="cny-lantern__body">
          <div className="cny-lantern__glow" />
          <span className="cny-lantern__text">春</span>
        </div>
        <div className="cny-lantern__tassel" />
      </div>
      {/* 烟花 */}
      <div className="cny-firework cny-firework--1">
        <div className="cny-firework__trail" />
        <svg className="cny-firework__burst" viewBox="0 0 80 80" aria-hidden="true">
          <g transform="translate(40,40)">
            {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg => (
              <line key={deg} x1="0" y1="0" x2="0" y2="-28" stroke="#ff4444" strokeWidth="1.2" strokeLinecap="round"
                transform={`rotate(${deg})`} opacity="0.8" />
            ))}
            {[15,75,135,195,255,315].map(deg => (
              <line key={`s${deg}`} x1="0" y1="0" x2="0" y2="-18" stroke="#e8c840" strokeWidth="0.8" strokeLinecap="round"
                transform={`rotate(${deg})`} opacity="0.6" />
            ))}
            {[0,60,120,180,240,300].map(deg => (
              <circle key={`d${deg}`} cx="0" cy="-30" r="1.5" fill="#ffcc00"
                transform={`rotate(${deg})`} />
            ))}
          </g>
        </svg>
      </div>
      <div className="cny-firework cny-firework--2">
        <div className="cny-firework__trail" />
        <svg className="cny-firework__burst" viewBox="0 0 80 80" aria-hidden="true">
          <g transform="translate(40,40)">
            {[0,45,90,135,180,225,270,315].map(deg => (
              <line key={deg} x1="0" y1="0" x2="0" y2="-26" stroke="#e8c840" strokeWidth="1.2" strokeLinecap="round"
                transform={`rotate(${deg})`} opacity="0.8" />
            ))}
            {[22,67,112,157,202,247,292,337].map(deg => (
              <line key={`s${deg}`} x1="0" y1="0" x2="0" y2="-16" stroke="#ff6666" strokeWidth="0.8" strokeLinecap="round"
                transform={`rotate(${deg})`} opacity="0.6" />
            ))}
            {[0,90,180,270].map(deg => (
              <circle key={`d${deg}`} cx="0" cy="-28" r="1.5" fill="#ff4444"
                transform={`rotate(${deg})`} />
            ))}
          </g>
        </svg>
      </div>
      <div className="cny-firework cny-firework--3">
        <div className="cny-firework__trail" />
        <svg className="cny-firework__burst" viewBox="0 0 80 80" aria-hidden="true">
          <g transform="translate(40,40)">
            {[0,36,72,108,144,180,216,252,288,324].map(deg => (
              <line key={deg} x1="0" y1="0" x2="0" y2="-24" stroke="#ff6666" strokeWidth="1" strokeLinecap="round"
                transform={`rotate(${deg})`} opacity="0.8" />
            ))}
            {[18,54,90,126,162,198,234,270,306,342].map(deg => (
              <line key={`s${deg}`} x1="0" y1="0" x2="0" y2="-15" stroke="#ffaa00" strokeWidth="0.8" strokeLinecap="round"
                transform={`rotate(${deg})`} opacity="0.5" />
            ))}
            {[0,72,144,216,288].map(deg => (
              <circle key={`d${deg}`} cx="0" cy="-26" r="1.2" fill="#e8c840"
                transform={`rotate(${deg})`} />
            ))}
          </g>
        </svg>
      </div>
      {/* 爆竹 */}
      <svg className="cny-firecracker" viewBox="0 0 40 120" aria-hidden="true">
        <line x1="20" y1="0" x2="20" y2="20" stroke="#c41a1a" strokeWidth="1.5" strokeDasharray="3 2" />
        {[0,1,2,3,4].map(i => (
          <g key={i} transform={`translate(0, ${20 + i * 20})`}>
            <rect x="6" y="0" width="28" height="16" rx="3" fill="#c41a1a" opacity={0.85 - i * 0.1} />
            <rect x="10" y="2" width="20" height="12" rx="2" fill="#e8c840" opacity="0.3" />
            <line x1="20" y1="0" x2="20" y2={i < 4 ? "20" : "4"} stroke="#c41a1a" strokeWidth="1" strokeDasharray="2 2" transform="translate(0, 16)" />
          </g>
        ))}
      </svg>
    </div>
  );
}
