(() => {
  'use strict';

  const TAU = Math.PI * 2;
  const STANCE_FRACTION = .6;
  const SNAKE_STATIONS = [
    { x: 8, thickness: 1.6 }, { x: 15, thickness: 4.2 }, { x: 23, thickness: 6.2 },
    { x: 33, thickness: 6.4 }, { x: 44, thickness: 6.1 }, { x: 55, thickness: 5.6 },
    { x: 66, thickness: 5.1 }, { x: 73, thickness: 4.6 }, { x: 78, thickness: 3.7 },
  ];
  const catalog = [
    { id: 'man', label: 'Man', kind: 'human', width: 138, height: 279, catchphrase: 'One more room to wander.' },
    { id: 'woman', label: 'Woman', kind: 'human', width: 138, height: 279, catchphrase: 'I came for the light.' },
    { id: 'dog', label: 'Dog', kind: 'animal', width: 216, height: 152, catchphrase: 'Art? I heard park.' },
    { id: 'cat', label: 'Cat', kind: 'animal', width: 168, height: 144, catchphrase: 'I heard there was a sunbeam.' },
    { id: 'ghost', label: 'Ghost', kind: 'ghost', width: 150, height: 190, catchphrase: 'Here for the atmosphere.' },
    { id: 'snake', label: 'Snake', kind: 'snake', width: 200, height: 78, catchphrase: 'Just passing through.' },
  ];

  const markupById = {
    man: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 58 117" aria-hidden="true">
      <ellipse class="visitor-shadow" cx="30" cy="115" rx="19" ry="2" fill="#687268" opacity=".22"/>
      <g class="leg leg--back">
        <path class="leg-line" d="M28 73 31 93 25 112" fill="none" stroke="#46534c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <path class="shoe" d="M-3-2H3L4 0 8 1Q9 1 9 3H-4V0Z" fill="#3c4941" transform="translate(25 112)"/>
      </g>
      <g class="leg leg--front">
        <path class="leg-line" d="M30 73 36 93 32 112" fill="none" stroke="#313f38" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <path class="shoe" d="M-3-2H3L4 0 8 1Q9 1 9 3H-4V0Z" fill="#2e3b34" transform="translate(32 112)"/>
      </g>
      <g class="visitor-body">
        <g class="arm arm--back" transform="translate(24 42)">
          <path d="M-3-1Q0-4 4 0L3 17H-3Z" fill="#53675a"/>
          <g class="forearm" transform="translate(0 17)">
            <path d="M-3-2H3L2.5 12H-2.5Z" fill="#53675a"/>
            <path d="M-2.5 12H2.5L3 16Q0 19-2.5 16Z" fill="#b39a82"/>
          </g>
        </g>
        <path d="M19 39 Q29 34 37 41 L43 83 Q31 88 16 82 L19 54Z" fill="#829385"/>
        <path d="M19 39 Q28 37 35 42 L32 80 Q26 83 17 81Z" fill="#8ea18f"/>
        <g class="visitor-head">
          <!-- Rear three-quarter view: nape and hair dominate; profile points forward. -->
          <path d="M23 25H33V33Q34 36 36 38Q29 41 20 38L23 33Z" fill="#b39a82"/>
          <path d="M30 9Q37 9 38 16L38 20L40.5 23Q41 24 38.5 24.5L38 28Q36.5 32 32 32L27 27L25 16Z" fill="#bd9d83"/>
          <path d="M36 24L38.5 24.5L38 28Q36.5 32 32 32L31 28L33 25L34 28Q36 28 36 24Z" fill="#3d4a40"/>
          <path d="M18 26Q15 21 16 14Q17 4 27 4Q37 3 39 13L37 18L34 20L33 26Q29 30 22 30L19 28Z" fill="#3d4a40"/>
          <path d="M33 18Q36 17 36 21L35 25Q33 27 31.5 24L31 21Q31 18 33 18Z" fill="#bd9d83"/>
          <path d="M33.5 20Q35 20 34 23" fill="none" stroke="#9e806b" stroke-width=".8" stroke-linecap="round"/>
        </g>
        <path d="M20 38Q28 41 36 38L37 41Q28 44 19 40Z" fill="#677b6c"/>
        <path d="M16 80 Q30 85 43 81 L44 86 Q31 90 15 84Z" fill="#677b6c"/>
        <g class="arm arm--front" transform="translate(34 43)">
          <path d="M-3-1Q0-4 4 0L3 17H-3Z" fill="#687e6e"/>
          <g class="forearm" transform="translate(0 17)">
            <path d="M-3-2H3L2.5 12H-2.5Z" fill="#687e6e"/>
            <path d="M-2.5 12H2.5L3 16Q0 19-2.5 16Z" fill="#bd9d83"/>
          </g>
        </g>
      </g>
    </svg>`,

    woman: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 58 117" aria-hidden="true">
      <ellipse class="visitor-shadow" cx="30" cy="115" rx="19" ry="2" fill="#687268" opacity=".22"/>
      <g class="leg leg--back">
        <path class="leg-line" d="M28 73 31 93 25 112" fill="none" stroke="#46534c" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <path class="shoe" d="M-3-2H3L4 0 8 1Q9 1 9 3H-4V0Z" fill="#485248" transform="translate(25 112)"/>
      </g>
      <g class="leg leg--front">
        <path class="leg-line" d="M30 73 36 93 32 112" fill="none" stroke="#38473d" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <path class="shoe" d="M-3-2H3L4 0 8 1Q9 1 9 3H-4V0Z" fill="#344238" transform="translate(32 112)"/>
      </g>
      <g class="visitor-body">
        <g class="arm arm--back" transform="translate(24 42)">
          <path d="M-3-1Q0-4 4 0L3 17H-3Z" fill="#788b7b"/>
          <g class="forearm" transform="translate(0 17)">
            <path d="M-3-2H3L2.5 12H-2.5Z" fill="#788b7b"/>
            <path d="M-2.5 12H2.5L3 16Q0 19-2.5 16Z" fill="#b99b83"/>
          </g>
        </g>
        <path d="M20 40Q25 36 31 38Q37 38 40 42L44 83Q31 88 15 84L18 54Z" fill="#879888"/>
        <path d="M20 41Q26 38 33 41L37 46L28 56L34 81Q25 84 17 82L18 54Z" fill="#a1ae9f"/>
        <path d="M37 45L41 43L44 83Q31 88 15 84L16 79Q30 83 40 80Z" fill="#758878"/>
        <path d="M18 63Q28 66 40 62L40.5 65Q29 69 17.5 66Z" fill="#697d6d"/>
        <path d="M19 39Q27 36 35 40L32 44Q27 41 22 43Z" fill="#b2bcac"/>
        <g class="visitor-head">
          <!-- Back mass and bun dominate; only a slim profile remains beyond the ear. -->
          <path d="M23 25H33V33Q34 36 36 38Q29 41 20 38L23 33Z" fill="#b99b83"/>
          <path d="M20 16Q18 10 13 11Q8 13 9 18Q9 22 14 24Q11 28 15 30Q20 29 23 24Z" fill="#484d42"/>
          <path d="M30 9Q36 8 38 14L38 19L41 23Q42 24 39 25L38.5 28Q36.5 32 32.5 32L29 27L29 16Z" fill="#c09f86"/>
          <path d="M18 26Q15 21 16 14Q17 4 27 4Q36 3 39 12L37 17L35 19L34 24L32 27Q28 31 22 30L19 28Z" fill="#41483f"/>
          <path d="M18 24Q16 30 20 34L18 38Q23 37 26 32L27 27Z" fill="#41483f"/>
          <path d="M33 19Q36 18 36.5 21L36 25Q34 27 31.5 24L31 21Q31 19 33 19Z" fill="#c09f86"/>
          <path d="M33 21Q34.5 20.5 34.5 22.5" fill="none" stroke="#9b7b65" stroke-width=".7" stroke-linecap="round"/>
        </g>
        <path d="M20 38Q28 41 36 38L37 41Q28 44 19 40Z" fill="#718574"/>
        <path d="M16 80Q30 85 43 81L44 86Q31 90 15 84Z" fill="#718574"/>
        <g class="arm arm--front" transform="translate(34 43)">
          <path d="M-3-1Q0-4 4 0L3 17H-3Z" fill="#8da08e"/>
          <g class="forearm" transform="translate(0 17)">
            <path d="M-3-2H3L2.5 12H-2.5Z" fill="#8da08e"/>
            <path d="M-2.5 12H2.5L3 16Q0 19-2.5 16Z" fill="#c09f86"/>
          </g>
        </g>
      </g>
    </svg>`,

    dog: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 76" aria-hidden="true">
      <ellipse class="dog-shadow" cx="55" cy="73.5" rx="34" ry="2" fill="#687268" opacity=".22"/>
      <g class="dog-tail" transform="rotate(0 31 38)">
        <path d="M32 39C27 35 25 29 20 25Q15 20 11 22" fill="none" stroke="#a87955" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M11 22Q9 20 10 18" fill="none" stroke="#a87955" stroke-width="3.2" stroke-linecap="round"/>
      </g>
      <g class="dog-leg dog-leg--hind-far" transform="translate(34 45)">
        <path class="dog-leg-upper" d="M0 0L7.21 12" fill="none" stroke="#98765b" stroke-width="5" stroke-linecap="round"/>
        <path class="dog-leg-lower" d="M7.21 12L0 24" fill="none" stroke="#98765b" stroke-width="4.2" stroke-linecap="round"/>
        <circle class="dog-leg-joint" cx="7.21" cy="12" r="2.2" fill="#98765b"/>
        <path class="dog-paw" d="M-2-3C-4-2-4 0-2 0H7Q9 0 8-2L5-3.5Q2-4.5-1-3.5Z" transform="translate(-2 28)" fill="#98765b"/>
      </g>
      <g class="dog-leg dog-leg--fore-far" transform="translate(70 43)">
        <path class="dog-leg-upper" d="M0 0L-6.42 13" fill="none" stroke="#98765b" stroke-width="5" stroke-linecap="round"/>
        <path class="dog-leg-lower" d="M-6.42 13L0 26" fill="none" stroke="#98765b" stroke-width="4.2" stroke-linecap="round"/>
        <circle class="dog-leg-joint" cx="-6.42" cy="13" r="2.2" fill="#98765b"/>
        <path class="dog-paw" d="M-2-3C-4-2-4 0-2 0H7Q9 0 8-2L5-3.5Q2-4.5-1-3.5Z" transform="translate(-2 30)" fill="#98765b"/>
      </g>
      <g class="dog-body">
        <path d="M28 36Q31 29 42 27Q55 25 65 29Q73 32 78 39L75 48Q67 52 52 52Q39 52 31 48Q26 44 28 36Z" fill="#b98b66"/>
        <path d="M40 31Q48 28 57 31L61 38Q54 43 44 42Q39 39 40 31Z" fill="#c79c75" opacity=".82"/>
        <path d="M34 45Q48 49 69 45L74 47Q67 52 52 52Q40 52 32 49Z" fill="#a97e5f" opacity=".68"/>
      </g>
      <g class="dog-head">
        <path d="M68 31Q73 27 80 28L86 38Q81 43 74 42L68 38Z" fill="#b98b66"/>
        <path d="M78 20Q74 14 71 19Q69 25 76 31L81 28Z" fill="#946d52"/>
        <path d="M76 22Q77 16 83 15Q91 15 94 22L94 27Q98 28 102 32Q105 35 101 38Q97 40 91 37L84 39Q76 37 74 31Z" fill="#bf916a"/>
        <path d="M88 29Q94 27 99 30Q103 32 101 36Q97 39 92 36L87 34Z" fill="#ead7bd"/>
        <path d="M98 30Q101 29 103 32Q103 35 100 35Q98 34 98 30Z" fill="#524b40"/>
        <circle cx="89" cy="23" r="1.15" fill="#403f38"/>
        <path d="M91 35Q94 38 97 37" fill="none" stroke="#80604b" stroke-width=".8" stroke-linecap="round"/>
        <path d="M72 33Q77 36 83 33L84 37Q78 40 73 37Z" fill="#768878"/>
        <circle cx="79" cy="39" r="1.5" fill="#d4b47f"/>
      </g>
      <g class="dog-leg dog-leg--hind-near" transform="translate(36 45)">
        <path class="dog-leg-upper" d="M0 0L8.12 11.41" fill="none" stroke="#bd906a" stroke-width="5.5" stroke-linecap="round"/>
        <path class="dog-leg-lower" d="M8.12 11.41L2 24" fill="none" stroke="#bd906a" stroke-width="4.7" stroke-linecap="round"/>
        <circle class="dog-leg-joint" cx="8.12" cy="11.41" r="2.4" fill="#bd906a"/>
        <path class="dog-paw" d="M-2-3C-4-2-4 0-2 0H7Q9 0 8-2L5-3.5Q2-4.5-1-3.5Z" transform="translate(0 28)" fill="#bd906a"/>
      </g>
      <g class="dog-leg dog-leg--fore-near" transform="translate(71 43)">
        <path class="dog-leg-upper" d="M0 0L-4.7 13.72" fill="none" stroke="#bd906a" stroke-width="5.5" stroke-linecap="round"/>
        <path class="dog-leg-lower" d="M-4.7 13.72L3 26" fill="none" stroke="#bd906a" stroke-width="4.7" stroke-linecap="round"/>
        <circle class="dog-leg-joint" cx="-4.7" cy="13.72" r="2.4" fill="#bd906a"/>
        <path class="dog-paw" d="M-2-3C-4-2-4 0-2 0H7Q9 0 8-2L5-3.5Q2-4.5-1-3.5Z" transform="translate(1 30)" fill="#bd906a"/>
      </g>
    </svg>`,

    cat: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84 72" aria-hidden="true">
      <ellipse class="cat-shadow" cx="42" cy="70.5" rx="24" ry="1.8" fill="#687268" opacity=".22"/>
      <g class="cat-tail" transform="rotate(0 26 40)">
        <path d="M27 41C19 39 14 32 14 24Q14 16 19 12Q23 8 26 11" fill="none" stroke="#69766d" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M22 10Q26 7 28 11" fill="none" stroke="#69766d" stroke-width="2.8" stroke-linecap="round"/>
      </g>
      <g class="cat-leg cat-leg--hind-far" transform="translate(25 42)">
        <path class="cat-leg-upper" d="M0 0L6.4 12.45" fill="none" stroke="#77847a" stroke-width="3.8" stroke-linecap="round"/>
        <path class="cat-leg-lower" d="M6.4 12.45L0.2 25" fill="none" stroke="#77847a" stroke-width="3.1" stroke-linecap="round"/>
        <circle class="cat-leg-joint" cx="6.4" cy="12.45" r="1.75" fill="#77847a"/>
        <path class="cat-paw" d="M-1-2C-3-1.5-3 0-1 0H5Q7 0 6-1.5L4-2.5Q2-3.5 0-2.5Z" transform="translate(-1 28)" fill="#77847a"/>
      </g>
      <g class="cat-leg cat-leg--fore-far" transform="translate(55 41)">
        <path class="cat-leg-upper" d="M0 0L-5.61 13.04" fill="none" stroke="#77847a" stroke-width="3.8" stroke-linecap="round"/>
        <path class="cat-leg-lower" d="M-5.61 13.04L0.2 26" fill="none" stroke="#77847a" stroke-width="3.1" stroke-linecap="round"/>
        <circle class="cat-leg-joint" cx="-5.61" cy="13.04" r="1.75" fill="#77847a"/>
        <path class="cat-paw" d="M-1-2C-3-1.5-3 0-1 0H5Q7 0 6-1.5L4-2.5Q2-3.5 0-2.5Z" transform="translate(-1 29)" fill="#77847a"/>
      </g>
      <g class="cat-body">
        <path d="M20 35Q23 28 33 25Q43 22 51 28Q58 29 63 36L61 44Q52 48 41 47Q30 47 22 43Q18 40 20 35Z" fill="#899489"/>
        <path d="M28 31Q32 27 35 28L33 34M39 27Q43 25 46 27L43 32M50 30Q54 31 56 35L52 37" fill="none" stroke="#67746b" stroke-width="1.35" stroke-linecap="round"/>
        <path d="M26 42Q40 46 59 41L61 44Q52 48 41 47Q30 47 22 43Z" fill="#758278" opacity=".72"/>
      </g>
      <g class="cat-head">
        <path d="M53 31Q57 27 62 28L67 39Q62 42 57 40Z" fill="#899489"/>
        <path d="M58 24L58 11Q59 9 62 13L66 18Q69 15 73 16L75 24Q79 27 79 31Q77 35 72 35Q67 38 62 35Q57 33 56 28Z" fill="#929d91"/>
        <path d="M60 13L61 19L64 19Z" fill="#c4a39a"/>
        <path d="M69 18L72 17L72.5 22Z" fill="#c4a39a"/>
        <path d="M71 28Q75 27 78 30Q80 32 77 34L71 33Z" fill="#d8c7ad"/>
        <path d="M76 29Q79 29 80 31Q79 33 77 32Z" fill="#4d5047"/>
        <circle cx="72" cy="23" r=".85" fill="#3e433d"/>
        <path d="M74 32L81 30M74 33L82 33M74 34L80 36" fill="none" stroke="#69756c" stroke-width=".55" stroke-linecap="round"/>
        <path d="M56 32Q61 34 66 31L67 35Q62 37 57 35Z" fill="#78887b"/>
        <circle cx="62" cy="37" r="1.2" fill="#c7b184"/>
      </g>
      <g class="cat-leg cat-leg--hind-near" transform="translate(27 42)">
        <path class="cat-leg-upper" d="M0 0L6.87 12.2" fill="none" stroke="#929d91" stroke-width="4.1" stroke-linecap="round"/>
        <path class="cat-leg-lower" d="M6.87 12.2L1.2 25" fill="none" stroke="#929d91" stroke-width="3.4" stroke-linecap="round"/>
        <circle class="cat-leg-joint" cx="6.87" cy="12.2" r="1.9" fill="#929d91"/>
        <path class="cat-paw" d="M-1-2C-3-1.5-3 0-1 0H5Q7 0 6-1.5L4-2.5Q2-3.5 0-2.5Z" transform="translate(0 28)" fill="#929d91"/>
      </g>
      <g class="cat-leg cat-leg--fore-near" transform="translate(56 41)">
        <path class="cat-leg-upper" d="M0 0L-5.08 13.26" fill="none" stroke="#929d91" stroke-width="4.1" stroke-linecap="round"/>
        <path class="cat-leg-lower" d="M-5.08 13.26L1.2 26" fill="none" stroke="#929d91" stroke-width="3.4" stroke-linecap="round"/>
        <circle class="cat-leg-joint" cx="-5.08" cy="13.26" r="1.9" fill="#929d91"/>
        <path class="cat-paw" d="M-1-2C-3-1.5-3 0-1 0H5Q7 0 6-1.5L4-2.5Q2-3.5 0-2.5Z" transform="translate(0 29)" fill="#929d91"/>
      </g>
    </svg>`,

    ghost: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 95" aria-hidden="true">
      <ellipse class="ghost-shadow" cx="37.5" cy="93" rx="19" ry="2" fill="#687268" opacity=".22"/>
      <g class="ghost-body">
        <path class="ghost-cloak" d="M37.5 8C25 8 17 17 16 30C15 42 15 53 11 61Q9 65 14 68L13 81Q17 78 21 81Q25 85 29 81Q33 78 37 82Q41 86 45 81Q49 78 53 81Q58 85 62 81L61 67Q66 64 63 59C60 49 61 38 59 28C57 16 50 8 37.5 8Z" fill="#f2f0e7" stroke="#c7cec3" stroke-width="1.15" stroke-linejoin="round"/>
        <path d="M21 57Q25 61 28 58M47 59Q51 62 55 57" fill="none" stroke="#d8ddd3" stroke-width="1.3" stroke-linecap="round"/>
        <ellipse cx="30.5" cy="36" rx="2.1" ry="3" fill="#555d54"/>
        <ellipse cx="44.5" cy="36" rx="2.1" ry="3" fill="#555d54"/>
        <path d="M34 44Q37.5 47 41 44" fill="none" stroke="#697267" stroke-width="1.25" stroke-linecap="round"/>
        <ellipse cx="24.5" cy="43" rx="2.5" ry="1.35" fill="#d7aaa0" opacity=".7"/>
        <ellipse cx="50.5" cy="43" rx="2.5" ry="1.35" fill="#d7aaa0" opacity=".7"/>
      </g>
    </svg>`,

    snake: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 39" aria-hidden="true">
      <ellipse class="snake-shadow" cx="49" cy="37" rx="31" ry="1.35" fill="#687268" opacity=".22"/>
      <path class="snake-body" d="M8 29.2C14 27.4 18.6 26.6 22.5 26.6C26.5 26.6 29.5 27.2 34 27.2C38.5 27.2 41.3 26.9 45 26.9C48.7 26.9 52.7 27.5 57 27.5C61.3 27.5 64.9 27.1 69 27.1C73.1 27.1 76 27.5 79 28.2C76 32 73.1 33.5 69 33.1C64.9 32.7 61.3 32.5 57 32.5C52.7 32.5 48.7 33.1 45 33.1C41.3 33.1 38.5 32.8 34 32.8C29.5 32.8 26.5 33.4 22.5 33.4C18.6 33.4 14 32.6 8 30.8Z" fill="#748678" stroke="#566458" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="snake-belly" d="M14 30.5C20 29.5 26 29.2 32 29.7C38 30.2 43 29.2 49 29.4C55 29.6 61 30.1 67 29.9C72 29.8 75 30.1 78 30.6C75 32 72 32.3 67 31.7C61 31.1 55 31.3 49 31.2C43 31.1 38 31.8 32 31.4C26 31 20 31.5 14 31.7Z" fill="#c8b894" opacity=".9"/>
      <path class="snake-mark snake-mark--tail" d="M27.75 27.69Q28.9 26.89 30.2 27.54L29.45 29.29L27.9 29.39Z" fill="#58685b" opacity=".8"/>
      <path class="snake-mark snake-mark--middle" d="M48.75 27.94Q49.9 27.14 51.2 27.79L50.45 29.54L48.9 29.64Z" fill="#58685b" opacity=".8"/>
      <path class="snake-mark snake-mark--neck" d="M65.75 28.34Q66.9 27.54 68.2 28.19L67.45 29.94L65.9 30.04Z" fill="#58685b" opacity=".8"/>
      <g class="snake-head" transform="rotate(0 77 27)">
        <path d="M74 27Q75 20 80 17Q85 14 90 17L96 21Q99 23 97 26Q95 29 90 28L82 30Q77 31 74 27Z" fill="#849582" stroke="#566458" stroke-width="1.1" stroke-linejoin="round"/>
        <path d="M80 27Q85 27 90 25L95 25" fill="none" stroke="#c6b391" stroke-width="1.2" stroke-linecap="round"/>
        <circle cx="87" cy="19" r="1.25" fill="#43483e"/>
        <circle cx="87.35" cy="18.65" r=".35" fill="#f1eee1"/>
        <circle cx="94.5" cy="23.2" r=".55" fill="#54584c"/>
      </g>
      <path class="snake-tongue" d="M94 25Q95.6 25 97 25M97 25L98.8 23.7M97 25L98.8 26.3" fill="none" stroke="#b56f6b" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
  };

  const noop = () => {};
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const rounded = value => Math.round(value * 100) / 100;

  const QUADRUPED_PROFILES = {
    dog: {
      body: '.dog-body', head: '.dog-head', tail: '.dog-tail', shadow: '.dog-shadow',
      legPrefix: 'dog', ground: 73, pawHeight: 4, stride: 4.2, swingHeight: 3.2,
      bob: .38, sway: .22, nod: 1.1, headPivotX: 78, headPivotY: 31, tailPivotX: 31, tailPivotY: 38, tailWag: 15, tailFrequency: 2, shadowRadius: 34,
      legs: [
        { selector: '.dog-leg--hind-far', hipX: 34, hipY: 45, footX: 32, ankleOffsetX: 2, offset: .5, upperLength: 14, lowerLength: 14, bend: -1 },
        { selector: '.dog-leg--fore-far', hipX: 70, hipY: 43, footX: 68, ankleOffsetX: 2, offset: .75, upperLength: 14.5, lowerLength: 14.5, bend: 1 },
        { selector: '.dog-leg--hind-near', hipX: 36, hipY: 45, footX: 36, ankleOffsetX: 2, offset: 0, upperLength: 14, lowerLength: 14, bend: -1 },
        { selector: '.dog-leg--fore-near', hipX: 71, hipY: 43, footX: 72, ankleOffsetX: 2, offset: .25, upperLength: 14.5, lowerLength: 14.5, bend: 1 },
      ],
    },
    cat: {
      body: '.cat-body', head: '.cat-head', tail: '.cat-tail', shadow: '.cat-shadow',
      legPrefix: 'cat', ground: 70, pawHeight: 3, stride: 3.2, swingHeight: 2.4,
      bob: .32, sway: .16, nod: 1.2, headPivotX: 65, headPivotY: 29, tailPivotX: 26, tailPivotY: 40, tailWag: 7, tailFrequency: 1, shadowRadius: 24,
      legs: [
        { selector: '.cat-leg--hind-far', hipX: 25, hipY: 42, footX: 24, ankleOffsetX: 1.2, offset: .5, upperLength: 14, lowerLength: 14, bend: -1 },
        { selector: '.cat-leg--fore-far', hipX: 55, hipY: 41, footX: 54, ankleOffsetX: 1.2, offset: .75, upperLength: 14.2, lowerLength: 14.2, bend: 1 },
        { selector: '.cat-leg--hind-near', hipX: 27, hipY: 42, footX: 27, ankleOffsetX: 1.2, offset: 0, upperLength: 14, lowerLength: 14, bend: -1 },
        { selector: '.cat-leg--fore-near', hipX: 56, hipY: 41, footX: 56, ankleOffsetX: 1.2, offset: .25, upperLength: 14.2, lowerLength: 14.2, bend: 1 },
      ],
    },
  };

  function normalizedInput(phase, amount) {
    const safePhase = Number.isFinite(phase) ? ((phase % 1) + 1) % 1 : 0;
    const safeAmount = Number.isFinite(amount) ? clamp(amount, 0, 1) : 0;
    return [safePhase, safeAmount];
  }

  function curvedPath(points) {
    const first = points[0];
    const segments = points.slice(1).map((point, index) => {
      const previous = points[index];
      const before = points[Math.max(0, index - 1)];
      const after = points[Math.min(points.length - 1, index + 2)];
      const firstControlX = previous.x + (point.x - before.x) / 6;
      const firstControlY = previous.y + (point.y - before.y) / 6;
      const secondControlX = point.x - (after.x - previous.x) / 6;
      const secondControlY = point.y - (after.y - previous.y) / 6;
      return `C${rounded(firstControlX)} ${rounded(firstControlY)} ${rounded(secondControlX)} ${rounded(secondControlY)} ${rounded(point.x)} ${rounded(point.y)}`;
    });
    return `M${rounded(first.x)} ${rounded(first.y)}${segments.join('')}`;
  }

  function snakeCenterlineY(x, phase, amount) {
    return 30 + Math.sin(TAU * (phase + x / 78 * .82)) * 3.2 * amount;
  }

  function snakeThicknessAt(x) {
    const stationIndex = SNAKE_STATIONS.findIndex(station => station.x >= x);
    const rightIndex = stationIndex < 0 ? SNAKE_STATIONS.length - 1 : Math.max(1, stationIndex);
    const left = SNAKE_STATIONS[rightIndex - 1];
    const right = SNAKE_STATIONS[rightIndex];
    const progress = clamp((x - left.x) / (right.x - left.x), 0, 1);
    return left.thickness + (right.thickness - left.thickness) * progress;
  }

  function snakeBodyPath(phase, amount) {
    const centerline = SNAKE_STATIONS.map(({ x, thickness }) => ({
      x,
      y: snakeCenterlineY(x, phase, amount),
      thickness,
    }));
    const upper = centerline.map(point => ({ x: point.x, y: point.y - point.thickness / 2 }));
    const lower = centerline.slice().reverse().map(point => ({ x: point.x, y: point.y + point.thickness / 2 }));
    return `${curvedPath(upper)}${curvedPath(lower).replace(/^M/, 'L')}Z`;
  }

  function snakeBellyPath(phase, amount) {
    const stations = [14, 22, 32, 43, 54, 65, 76].map((x, index) => ({
      x,
      y: snakeCenterlineY(x, phase, amount) + .8 + (index % 2 ? .25 : 0),
    }));
    const upper = stations.map(point => ({ x: point.x, y: point.y - .65 }));
    const lower = stations.slice().reverse().map(point => ({ x: point.x, y: point.y + .65 }));
    return `${curvedPath(upper)}${curvedPath(lower).replace(/^M/, 'L')}Z`;
  }

  function snakeMarkPath(x, phase, amount) {
    const centerline = snakeCenterlineY(x, phase, amount);
    const top = centerline - snakeThicknessAt(x) / 2 + .35;
    return `M${rounded(x - 1.25)} ${rounded(top + .5)}Q${rounded(x - .1)} ${rounded(top - .3)} ${rounded(x + 1.2)} ${rounded(top + .35)}L${rounded(x + .45)} ${rounded(top + 2.1)}L${rounded(x - 1.1)} ${rounded(top + 2.2)}Z`;
  }

  function sampleFoot(phase, offset, stride, swingHeight, amount) {
    const footPhase = ((phase + offset) % 1 + 1) % 1;
    // Quarter-cycle footfalls and a 60% planted window guarantee two supports.
    if (footPhase < STANCE_FRACTION) {
      return { travel: stride * (1 - 2 * footPhase / STANCE_FRACTION) * amount, lift: 0 };
    }
    const swing = (footPhase - STANCE_FRACTION) / (1 - STANCE_FRACTION);
    const easedSwing = swing * swing * (3 - 2 * swing);
    return {
      travel: stride * (-1 + 2 * easedSwing) * amount,
      lift: swingHeight * Math.sin(Math.PI * swing) * amount,
    };
  }

  function solveKnee(x, y, upperLength, lowerLength, bend) {
    const rawDistance = Math.max(.001, Math.hypot(x, y));
    const distance = clamp(rawDistance, Math.abs(upperLength - lowerLength) + .001, upperLength + lowerLength - .001);
    const along = (upperLength ** 2 - lowerLength ** 2 + distance ** 2) / (2 * distance);
    const height = Math.sqrt(Math.max(0, upperLength ** 2 - along ** 2));
    const unitX = x / rawDistance;
    const unitY = y / rawDistance;
    return {
      x: unitX * along - unitY * height * bend,
      y: unitY * along + unitX * height * bend,
    };
  }

  function createQuadrupedRenderer(svgElement, id) {
    const profile = QUADRUPED_PROFILES[id];
    const body = svgElement.querySelector(profile.body);
    const head = svgElement.querySelector(profile.head);
    const tail = svgElement.querySelector(profile.tail);
    const shadow = svgElement.querySelector(profile.shadow);
    const legs = profile.legs.map(leg => {
      const group = svgElement.querySelector(leg.selector);
      return {
        ...leg,
        group,
        upper: group && group.querySelector(`.${profile.legPrefix}-leg-upper`),
        lower: group && group.querySelector(`.${profile.legPrefix}-leg-lower`),
        joint: group && group.querySelector(`.${profile.legPrefix}-leg-joint`),
        paw: group && group.querySelector(`.${profile.legPrefix}-paw`),
      };
    });
    if (!body || !head || !tail || !shadow || legs.some(leg => !leg.group || !leg.upper || !leg.lower || !leg.joint || !leg.paw)) return noop;

    return (phase, amount) => {
      const [cycle, intensity] = normalizedInput(phase, amount);
      const shiftX = Math.sin(TAU * cycle) * profile.sway * intensity;
      const bob = Math.cos(TAU * cycle * 2) * profile.bob * intensity;
      const headNod = Math.sin(TAU * cycle * 2 - .3) * profile.nod * intensity;
      body.setAttribute('transform', `translate(${rounded(shiftX)} ${rounded(bob)})`);
      head.setAttribute('transform', `translate(${rounded(shiftX)} ${rounded(bob * .82)}) rotate(${rounded(headNod)} ${profile.headPivotX} ${profile.headPivotY})`);
      tail.setAttribute('transform', `translate(${rounded(shiftX)} ${rounded(bob)}) rotate(${rounded(Math.sin(TAU * cycle * profile.tailFrequency) * profile.tailWag * intensity)} ${profile.tailPivotX} ${profile.tailPivotY})`);
      shadow.setAttribute('rx', rounded(profile.shadowRadius + bob * 1.2));
      shadow.setAttribute('opacity', rounded(.22 + Math.max(0, bob) * .025));

      legs.forEach(leg => {
        const foot = sampleFoot(cycle, leg.offset, profile.stride, profile.swingHeight, intensity);
        const pawX = rounded(leg.footX + foot.travel);
        const pawY = rounded(profile.ground - foot.lift);
        const hipX = rounded(leg.hipX + shiftX);
        const hipY = rounded(leg.hipY + bob);
        const ankleX = rounded(pawX + leg.ankleOffsetX);
        const ankleY = rounded(pawY - profile.pawHeight);
        const localAnkleX = rounded(ankleX - hipX);
        const localAnkleY = rounded(ankleY - hipY);
        const knee = solveKnee(localAnkleX, localAnkleY, leg.upperLength, leg.lowerLength, leg.bend);
        const kneeX = rounded(knee.x);
        const kneeY = rounded(knee.y);

        leg.group.setAttribute('transform', `translate(${hipX} ${hipY})`);
        leg.upper.setAttribute('d', `M0 0L${kneeX} ${kneeY}`);
        leg.lower.setAttribute('d', `M${kneeX} ${kneeY}L${localAnkleX} ${localAnkleY}`);
        leg.joint.setAttribute('cx', kneeX);
        leg.joint.setAttribute('cy', kneeY);
        leg.paw.setAttribute('transform', `translate(${rounded(pawX - hipX)} ${rounded(pawY - hipY)})`);
      });
    };
  }

  function ghostCloakPath(phase, amount) {
    const ripple = Math.sin(TAU * phase) * 1.6 * amount;
    const counterRipple = Math.cos(TAU * phase) * 1.1 * amount;
    return [
      'M37.5 8C25 8 17 17 16 30C15 42 15 53 11 61Q9 65 14 68',
      `L${rounded(13 + ripple * .25)} ${rounded(81 + ripple * .6)}`,
      `Q${rounded(17 + ripple * .2)} ${rounded(78 - ripple * .2)} ${rounded(21 + ripple * .2)} ${rounded(81 + ripple)}`,
      `Q${rounded(25 + ripple * .3)} ${rounded(85 + counterRipple)} ${rounded(29 + ripple * .2)} ${rounded(81 - counterRipple * .25)}`,
      `Q${rounded(33 + ripple * .2)} ${rounded(78 - ripple * .3)} 37 ${rounded(82 + ripple * .8)}`,
      `Q${rounded(41 + ripple * .2)} ${rounded(86 - counterRipple)} ${rounded(45 + ripple * .2)} ${rounded(81 + counterRipple * .4)}`,
      `Q${rounded(49 + ripple * .2)} ${rounded(78 + ripple * .25)} ${rounded(53 + ripple * .2)} ${rounded(81 - ripple)}`,
      `Q${rounded(58 + ripple * .2)} ${rounded(85 + counterRipple * .7)} 62 ${rounded(81 + ripple * .4)}`,
      `L${rounded(61 + ripple * .2)} 67Q66 64 63 59C60 49 61 38 59 28C57 16 50 8 37.5 8Z`,
    ].join('');
  }

  function createRenderer(svgElement, id) {
    const entry = catalog.find(sprite => sprite.id === id);
    if (!entry || entry.kind === 'human' || !svgElement || typeof svgElement.querySelector !== 'function') return noop;
    if (id === 'dog' || id === 'cat') return createQuadrupedRenderer(svgElement, id);

    const query = selector => svgElement.querySelector(selector);
    const setTransform = (node, value) => node && node.setAttribute('transform', value);

    if (id === 'ghost') {
      const body = query('.ghost-body');
      const cloak = query('.ghost-cloak');
      const shadow = query('.ghost-shadow');
      if (!body || !cloak || !shadow) return noop;

      return (phase, amount) => {
        const [cycle, intensity] = normalizedInput(phase, amount);
        const float = Math.sin(TAU * cycle) * 2.8 * intensity;
        setTransform(body, `translate(0 ${rounded(-float)})`);
        cloak.setAttribute('d', ghostCloakPath(cycle, intensity));
        shadow.setAttribute('rx', rounded(19 - Math.max(0, float) * .9));
        shadow.setAttribute('opacity', rounded(.22 - Math.max(0, float) * .012));
      };
    }

    if (id === 'snake') {
      const body = query('.snake-body');
      const belly = query('.snake-belly');
      const marks = [
        { node: query('.snake-mark--tail'), x: 29 },
        { node: query('.snake-mark--middle'), x: 50 },
        { node: query('.snake-mark--neck'), x: 67 },
      ];
      const head = query('.snake-head');
      const tongue = query('.snake-tongue');
      const shadow = query('.snake-shadow');
      if (!body || !belly || !head || !tongue || !shadow || marks.some(mark => !mark.node)) return noop;

      return (phase, amount) => {
        const [cycle, intensity] = normalizedInput(phase, amount);
        const headTilt = Math.sin(TAU * cycle - .5) * 2.6 * intensity;
        const flick = (Math.sin(TAU * cycle * 2 - .6) + 1) / 2;
        const tongueLength = 3 + 1.6 * intensity * flick;
        const tongueRoot = 94;
        const tongueTip = rounded(tongueRoot + tongueLength);
        const forkY = rounded(1.3 + .4 * intensity * flick);
        body.setAttribute('d', snakeBodyPath(cycle, intensity));
        belly.setAttribute('d', snakeBellyPath(cycle, intensity));
        marks.forEach(mark => mark.node.setAttribute('d', snakeMarkPath(mark.x, cycle, intensity)));
        const headShift = snakeCenterlineY(78, cycle, intensity) - 30;
        setTransform(head, `translate(0 ${rounded(headShift)}) rotate(${rounded(headTilt)} 77 27)`);
        tongue.setAttribute('d', `M${tongueRoot} 25Q${rounded(tongueRoot + 1.6)} 25 ${tongueTip} 25M${tongueTip} 25L${rounded(tongueTip + 1.2)} ${rounded(25 - forkY)}M${tongueTip} 25L${rounded(tongueTip + 1.2)} ${rounded(25 + forkY)}`);
        shadow.setAttribute('rx', rounded(31 + Math.sin(TAU * cycle) * 1.2 * intensity));
      };
    }

    return noop;
  }

  function markup(id) {
    return Object.prototype.hasOwnProperty.call(markupById, id) ? markupById[id] : '';
  }

  window.GallerySprites = { catalog, markup, createRenderer };
})();
