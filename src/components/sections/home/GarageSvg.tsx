// The garage scene SVG, converted mechanically from the design (VangLost C.dc.html) by
// scripts/html-to-jsx.py. Animated nodes carry data-vl; see src/lib/animation/garageTimeline.ts.
// Only changes: the font uses the site's font variable and the mark image path.
import { memo } from 'react';

export const GarageSvg = memo(function GarageSvg({ label }: { label: string }) {
  return (
    <svg
      viewBox="0 0 600 400"
      style={{ flex: '1 1 380px', minWidth: '0', width: '100%', maxWidth: '700px', height: 'auto' }}
      role="img"
      aria-label={label}
    >
      <defs>
        <filter id="vlcGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <rect x="0" y="0" width="600" height="400" rx="24" fill="#F3E4CC" />
      <rect x="0" y="358" width="600" height="42" fill="#D85A30" />
      <path d="M0 382h600" stroke="#B8441F" strokeWidth="2" opacity="0.5" />
      <text
        x="40"
        y="66"
        fill="#2B2118"
        style={{ fontFamily: 'var(--font-archivo), Helvetica, sans-serif' }}
        fontSize="34"
        fontWeight="800"
        letterSpacing="11"
      >
        GARAGE
      </text>
      <path d="M40 82h214" stroke="#D85A30" strokeWidth="4" strokeLinecap="round" />
      <rect x="40" y="310" width="100" height="9" rx="4.5" fill="#2B2118" />
      <rect x="52" y="319" width="9" height="39" rx="4.5" fill="#2B2118" />
      <rect x="119" y="319" width="9" height="39" rx="4.5" fill="#2B2118" />
      <g data-vl="aiph" opacity="0" style={{ transformOrigin: '88px 296px' }}>
        <circle cx="88" cy="296" r="30" fill="#D85A30" opacity="0.6" filter="url(#vlcGlow)" />
      </g>
      <g data-vl="ring" opacity="0" fill="none" stroke="#D85A30" strokeLinecap="round">
        <circle
          cx="88"
          cy="290"
          r="22"
          strokeWidth="3"
          style={{ transformOrigin: '88px 290px', animation: 'vlc-pulse 1800ms ease-out infinite' }}
        />
        <circle
          cx="88"
          cy="290"
          r="22"
          strokeWidth="3"
          style={{ transformOrigin: '88px 290px', animation: 'vlc-pulse 1800ms ease-out 600ms infinite' }}
        />
        <path d="M128 280q8 10 0 20M138 272q14 18 0 36M48 280q-8 10 0 20M38 272q-14 18 0 36" strokeWidth="3.2" />
      </g>
      <g data-vl="airing" opacity="0">
        <circle
          cx="88"
          cy="296"
          r="22"
          fill="none"
          stroke="#D85A30"
          strokeWidth="2.4"
          style={{ transformOrigin: '88px 296px', animation: 'vlc-pulse 2000ms ease-out infinite' }}
        />
      </g>
      <path
        data-vl="cord"
        d="M112 303c8 4 4-8 10-6c6 2 2-10 8-8c5 2 4-8 8-9"
        fill="none"
        stroke="#2B2118"
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity="0"
      />
      <path
        d="M66 294 C56 296 52 300 58 302 C64 304 50 306 56 309 C62 312 50 314 56 316 C60 318 62 314 66 310"
        fill="none"
        stroke="#2B2118"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M64 310 L68 292 H108 L112 310 Z" fill="#2B2118" />
      <rect x="71" y="288" width="5" height="6" rx="1.5" fill="#2B2118" />
      <rect x="100" y="288" width="5" height="6" rx="1.5" fill="#2B2118" />
      <circle cx="88" cy="301" r="6.2" fill="#F3E4CC" />
      <circle cx="88" cy="301" r="2" fill="#2B2118" />
      <g data-vl="aimk" opacity="0">
        <circle cx="88" cy="301" r="8" fill="#D85A30" />
        <image
          href="/brand/mark-cream.png"
          x="81.5"
          y="295.5"
          width="13"
          height="11"
          preserveAspectRatio="xMidYMid meet"
        />
      </g>
      <g data-vl="hset" style={{ transformOrigin: '88px 290px' }}>
        <path
          d="M61 290.5C61 284.5 66.5 282.5 72 283.8C80.5 278.6 95.5 278.6 104 283.8C109.5 282.5 115 284.5 115 290.5C115 296 110.5 297.5 106 296.6C102.8 296 100.8 293.6 100 291.2C94 286.8 82 286.8 76 291.2C75.2 293.6 73.2 296 70 296.6C65.5 297.5 61 296 61 290.5Z"
          fill="#2B2118"
        />
      </g>
      <g data-vl="pops" opacity="0">
        <g className="vlc-pop1" style={{ transformOrigin: '88px 250px' }}>
          <rect x="72" y="236" width="32" height="27" rx="8" fill="#2B2118" />
          <path d="M76 249h24" stroke="#D85A30" strokeWidth="2" />
          <path
            d="M81 255l3.5 3.5 7-7.5"
            fill="none"
            stroke="#D85A30"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <g className="vlc-pop2" style={{ transformOrigin: '132px 250px' }}>
          <circle cx="132" cy="250" r="14" fill="#D85A30" />
          <path
            d="M125 250l5 5 9-10"
            fill="none"
            stroke="#F3E4CC"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <g className="vlc-pop3" style={{ transformOrigin: '44px 250px' }}>
          <rect x="28" y="236" width="32" height="27" rx="8" fill="#2B2118" />
          <path d="M32 249h24" stroke="#D85A30" strokeWidth="2" />
          <path
            d="M37 255l3.5 3.5 7-7.5"
            fill="none"
            stroke="#D85A30"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </g>
      <g>
        <path
          d="M168 342 V318 A20 20 0 0 1 188 298 H210 L232 267 A12 12 0 0 1 242 262 H314 A12 12 0 0 1 324 267 L346 298 H394 A20 20 0 0 1 414 318 V342 Z"
          fill="#6B5D4F"
        />
        <path d="M227 292 L243 270 H274 V292 Z" fill="#F3E4CC" />
        <path d="M282 270 H313 L329 292 H282 Z" fill="#F3E4CC" />
        <circle cx="228" cy="342" r="22" fill="#120D09" stroke="#F3E4CC" strokeWidth="3" />
        <circle cx="228" cy="342" r="9" fill="#CDBFA8" />
        <circle cx="228" cy="342" r="3" fill="#6B5D4F" />
        <circle cx="376" cy="342" r="22" fill="#120D09" stroke="#F3E4CC" strokeWidth="3" />
        <circle cx="376" cy="342" r="9" fill="#CDBFA8" />
        <circle cx="376" cy="342" r="3" fill="#6B5D4F" />
        <rect
          data-vl="hood"
          x="336"
          y="288"
          width="88"
          height="13"
          rx="6.5"
          fill="#4A4038"
          style={{ transformOrigin: '338px 294px' }}
        />
      </g>
      <g data-vl="cust" style={{ transformOrigin: '600px 322px', transform: 'translateX(44px)' }}>
        <g data-vl="cLegA" style={{ transformOrigin: '594px 318px' }}>
          <path d="M594 318 L594 358" stroke="#854F0B" strokeWidth="10" strokeLinecap="round" />
        </g>
        <g data-vl="cLegB" style={{ transformOrigin: '606px 318px' }}>
          <path d="M606 318 L606 358" stroke="#854F0B" strokeWidth="10" strokeLinecap="round" />
        </g>
        <g data-vl="cArmB" style={{ transformOrigin: '606px 290px' }} opacity="0.45">
          <path
            d="M606 290 L596 304 L590 314"
            fill="none"
            stroke="#854F0B"
            strokeWidth="7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <rect x="584" y="272" width="32" height="54" rx="16" fill="#854F0B" />
        <circle cx="600" cy="258" r="14.5" fill="#854F0B" />
        <g data-vl="cArmA" style={{ transformOrigin: '592px 288px' }}>
          <path
            d="M592 288 L580 302 L570 310"
            fill="none"
            stroke="#854F0B"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <g data-vl="talkC" opacity="0">
          <rect x="576" y="212" width="48" height="28" rx="13" fill="#854F0B" />
          <path d="M590 240l3-10h10z" fill="#854F0B" />
          <circle cx="588" cy="226" r="3" fill="#F3E4CC" />
          <circle cx="600" cy="226" r="3" fill="#F3E4CC" />
          <circle cx="612" cy="226" r="3" fill="#F3E4CC" />
        </g>
      </g>
      <g data-vl="mech" style={{ transformOrigin: '515px 322px' }}>
        <g data-vl="mLegA" style={{ transformOrigin: '509px 318px' }}>
          <path d="M509 318 L509 358" stroke="#2B2118" strokeWidth="10" strokeLinecap="round" />
        </g>
        <g data-vl="mLegB" style={{ transformOrigin: '521px 318px' }}>
          <path d="M521 318 L521 358" stroke="#2B2118" strokeWidth="10" strokeLinecap="round" />
        </g>
        <g data-vl="mTorso" style={{ transformOrigin: '515px 322px' }}>
          <g data-vl="mArmB" style={{ transformOrigin: '521px 294px' }} opacity="0.45">
            <path
              d="M521 294 L508 308 L497 316"
              fill="none"
              stroke="#2B2118"
              strokeWidth="7.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <rect x="499" y="276" width="32" height="52" rx="16" fill="#2B2118" />
          <g data-vl="mPock">
            <rect x="525" y="298" width="8" height="14" rx="2" fill="#D85A30" />
            <rect x="527" y="300" width="4" height="7" rx="1" fill="#F3E4CC" />
          </g>
          <g data-vl="mBuzz" opacity="0">
            <path
              d="M539 298q4 7 0 14M544 294q7 11 0 22"
              fill="none"
              stroke="#D85A30"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </g>
          <g data-vl="mHead" style={{ transformOrigin: '515px 282px' }}>
            <circle cx="515" cy="264" r="14.5" fill="#2B2118" />
            <path d="M502 259a13 13 0 0 1 26 0z" fill="#D85A30" />
            <path d="M502 259h-12a3 3 0 0 0 0 4.5h12z" fill="#D85A30" />
            <g data-vl="mRec" opacity="0">
              <g transform="translate(518 271) rotate(80) scale(.6) translate(-88 -287)">
                <path
                  d="M61 290.5C61 284.5 66.5 282.5 72 283.8C80.5 278.6 95.5 278.6 104 283.8C109.5 282.5 115 284.5 115 290.5C115 296 110.5 297.5 106 296.6C102.8 296 100.8 293.6 100 291.2C94 286.8 82 286.8 76 291.2C75.2 293.6 73.2 296 70 296.6C65.5 297.5 61 296 61 290.5Z"
                  fill="#2B2118"
                  stroke="#F3E4CC"
                  strokeWidth="2.6"
                />
              </g>
            </g>
            <g data-vl="mMob" opacity="0">
              <rect
                x="519"
                y="253"
                width="8"
                height="15"
                rx="2.2"
                fill="#D85A30"
                stroke="#F3E4CC"
                strokeWidth="1.5"
                transform="rotate(14 523 260)"
              />
            </g>
            <g data-vl="stars" opacity="0" style={{ transformOrigin: '515px 240px' }}>
              <g transform="translate(0 -3)">
                <path
                  d="M500 240L501.92 244.08L506 246L501.92 247.92L500 252L498.08 247.92L494 246L498.08 244.08Z"
                  fill="#E8A33D"
                />
                <path
                  d="M530 239L531.6 242.4L535 244L531.6 245.6L530 249L528.4 245.6L525 244L528.4 242.4Z"
                  fill="#D85A30"
                />
                <path
                  d="M515 226.5L516.76 230.24L520.5 232L516.76 233.76L515 237.5L513.24 233.76L509.5 232L513.24 230.24Z"
                  fill="#E8A33D"
                />
              </g>
            </g>
          </g>
          <g data-vl="mArmA" style={{ transformOrigin: '507px 292px' }}>
            <path
              d="M507 292 L492 306 L479 314"
              fill="none"
              stroke="#2B2118"
              strokeWidth="8.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
          <g data-vl="talkM" opacity="0">
            <rect x="491" y="218" width="48" height="28" rx="13" fill="#2B2118" />
            <path d="M505 246l3-10h10z" fill="#2B2118" />
            <circle cx="503" cy="232" r="3" fill="#F3E4CC" />
            <circle cx="515" cy="232" r="3" fill="#F3E4CC" />
            <circle cx="527" cy="232" r="3" fill="#F3E4CC" />
          </g>
        </g>
      </g>
    </svg>
  );
});
