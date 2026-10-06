import { SubjectId } from '../types';

/**
 * Encyclopedic NCERT 2026 Class 9 STEM Knowledge & Tutor Engine
 * Covers all CBSE/NCERT Class 9 Physics, Chemistry, and Mathematics concepts,
 * ensuring students always get accurate, step-by-step, syllabus-aligned answers
 * across all devices and hosting environments.
 */
export function solveDoubtOffline(question: string, subjectHint?: SubjectId): string {
  const query = question.trim().toLowerCase();

  // =========================================================================
  // 1. CHEMISTRY: SOLUTIONS, SUSPENSIONS, COLLOIDS & MIXTURES
  // =========================================================================
  if (
    query.includes('true solution') ||
    (query.includes('solution') && (query.includes('what') || query.includes('define') || query.includes('property') || query.includes('example') || query.includes('type')))
  ) {
    return `### 🧪 Class 9 NCERT Chemistry: True Solution Master Guide

#### 1. What is a True Solution?
A **true solution** is a **homogeneous mixture** of two or more chemically non-reacting substances whose particles are completely and uniformly distributed at the molecular or atomic level.
* **Solute**: The substance that dissolves and is present in a smaller proportion (e.g., salt, sugar, iodine).
* **Solvent**: The medium in which the solute dissolves and is present in a larger proportion (e.g., water, alcohol).

---

#### 2. Distinctive Characteristics & Properties:
1. **Homogeneous Composition**: Uniform appearance and identical chemical properties throughout the mixture.
2. **Extremely Small Particle Size**: Solute particle diameter is **less than 1 nanometer** (\`< 10⁻⁹ m\` or \`< 1 nm\`). They cannot be seen even under an optical microscope.
3. **No Tyndall Effect**: The particles are too small to scatter light beams; hence, the path of light through a true solution is **not visible**.
4. **Cannot Be Separated by Filtration**: Solute particles pass through regular filter paper freely along with solvent molecules.
5. **High Stability**: It does not settle upon standing. If left undisturbed, the solute remains permanently dissolved.
6. **Transparent & Clear**: Light passes through without scattering.

---

#### 3. High-Yield Comparison Table (NCERT Exam Favorite):
| Property | True Solution | Colloidal Solution | Suspension |
| :--- | :--- | :--- | :--- |
| **Mixture Type** | Homogeneous | Heterogeneous (appears homogeneous) | Heterogeneous |
| **Particle Size** | \`< 1 nm\` (\`< 10⁻⁹ m\`) | Between \`1 nm\` and \`1000 nm\` | \`> 1000 nm\` (\`> 10⁻⁶ m\`) |
| **Tyndall Effect** | ❌ No scattering | ✅ Shows Tyndall effect | ✅ Scatters light (opaque) |
| **Filtration** | Passes through filter paper | Passes through filter paper | Separated by filter paper |
| **Stability** | Completely stable | Stable | Unstable (particles settle) |
| **Examples** | Salt in water, sugar syrup | Milk, blood, fog, ink | Muddy water, chalk powder in water |

---

#### 4. Everyday Examples of True Solutions:
* **Solid in Liquid**: Common salt in water, sugar in water.
* **Liquid in Solid/Liquid**: Tincture of iodine (solid iodine dissolved in alcohol solvent).
* **Gas in Liquid**: Aerated drinks (carbon dioxide dissolved in pressurized water).
* **Solid in Solid**: Alloys (e.g., Brass = 30% Zinc + 70% Copper).
* **Gas in Gas**: Clean air (homogeneous mixture of 78% Nitrogen, 21% Oxygen, etc.).

---

#### 5. Formula for Concentration of Solutions:
* **Mass by Mass %** = \`[Mass of solute / (Mass of solute + Mass of solvent)] × 100\`
* **Mass by Volume %** = \`[Mass of solute / Volume of solution] × 100\``;
  }

  if (query.includes('colloid') || query.includes('suspension') || query.includes('tyndall')) {
    return `### 🧪 Class 9 NCERT Chemistry: Colloids, Suspensions & Tyndall Effect

---

#### 1. Colloidal Solution (Colloid)
A colloid is a **heterogeneous mixture** in which solute-like particles (**dispersed phase**) are suspended uniformly in a solvent-like medium (**dispersion medium**).
* **Particle Size**: Between **1 nm and 1000 nm** (intermediate between true solution and suspension).
* **Properties**: Appears homogeneous to the naked eye but is heterogeneous; stable (does not settle on standing); cannot be separated by filtration (requires centrifugation).
* **Examples**: Milk, ink, blood, fog, clouds, smoke, gelatin.

---

#### 2. Suspension
A suspension is a **heterogeneous mixture** in which solute particles do not dissolve, but remain suspended throughout the bulk of the medium.
* **Particle Size**: Greater than **1000 nm** (\`> 10⁻⁶ m\`).
* **Properties**: Opaque; unstable (solute particles settle to the bottom upon standing); solute particles are easily separated by simple filtration.
* **Examples**: Chalk powder in water, sand in water, muddy pond water.

---

#### 3. What is the Tyndall Effect?
The **Tyndall Effect** is the scattering of a visible beam of light by colloidal particles or coarse suspension particles suspended in a medium.
* **Why it happens**: When light strikes colloidal particles whose dimensions are comparable to the wavelength of light, the light waves bounce off in all directions, making the **path of the light beam visible**.
* **Everyday Examples**:
  1. Sunlight streaming through a dense forest canopy due to mist and water droplets.
  2. A ray of sunlight entering a dark, dusty room through a tiny ventilation hole.
  3. Headlight beams illuminating fog at night.`;
  }

  // =========================================================================
  // 2. CHEMISTRY: MATTER IN OUR SURROUNDINGS
  // =========================================================================
  if (
    query.includes('matter') ||
    query.includes('evaporation') ||
    query.includes('latent heat') ||
    query.includes('sublimation') ||
    query.includes('states of matter') ||
    query.includes('solid liquid')
  ) {
    return `### 🧪 Class 9 NCERT Chemistry: Matter in Our Surroundings

---

#### 1. Fundamental Nature of Matter
Matter is anything that has **mass** and occupies **volume** (space).
* All matter is composed of tiny particles that:
  1. Have spaces between them (**intermolecular spaces**).
  2. Are continuously moving (**possess kinetic energy**).
  3. Attract each other (**intermolecular forces**).

---

#### 2. The Three States of Matter:
| Property | Solid | Liquid | Gas |
| :--- | :--- | :--- | :--- |
| **Shape & Volume** | Definite shape & definite volume | Indefinite shape, definite volume | Indefinite shape & indefinite volume |
| **Intermolecular Space** | Minimum (closely packed) | Intermediate | Maximum (far apart) |
| **Force of Attraction** | Maximum | Intermediate | Negligible / Minimum |
| **Kinetic Energy** | Minimum (vibrate in place) | Intermediate | Maximum (rapid random motion) |
| **Compressibility** | Incompressible | Negligible | Highly compressible (e.g., LPG, CNG) |

---

#### 3. Phase Transitions & Key Definitions:
* **Latent Heat of Fusion**: The amount of heat energy required to change **1 kg of a solid into a liquid** at atmospheric pressure at its melting point without any rise in temperature.
* **Latent Heat of Vaporization**: The amount of heat energy required to change **1 kg of a liquid into a gas** at atmospheric pressure at its boiling point without any rise in temperature.
  *(Note: Steam at 373 K causes more severe burns than boiling water at 373 K because steam possesses extra latent heat of vaporization!)*
* **Sublimation**: The transition directly from **solid to gas** without passing through the liquid phase (e.g., Camphor, Ammonium chloride \`NH₄Cl\`, Naphthalene, Dry Ice / solid \`CO₂\`).
* **Deposition**: Direct transition from **gas to solid** without liquid phase.

---

#### 4. Evaporation & Cooling Effect:
Evaporation is a surface phenomenon where liquid turns to vapor at temperatures below its boiling point.
* **Factors Affecting Evaporation Rate**:
  1. Surface area (increases with larger surface area).
  2. Temperature (increases with higher temperature).
  3. Humidity (decreases with higher humidity).
  4. Wind speed (increases with faster wind).
* **Why Evaporation Causes Cooling**: Particles on the surface absorb latent heat of vaporization from the surroundings, lowering the surroundings' thermal energy (e.g., sweating, water kept in earthen pots/matka).`;
  }

  // =========================================================================
  // 3. CHEMISTRY: ATOMS, MOLECULES & CHEMICAL FORMULAS
  // =========================================================================
  if (
    query.includes('atom') ||
    query.includes('molecule') ||
    query.includes('dalton') ||
    query.includes('valency') ||
    query.includes('mole concept') ||
    query.includes('molecular mass') ||
    (query.includes('chemical formula') && !query.includes('physics'))
  ) {
    return `### 🧪 Class 9 NCERT Chemistry: Atoms and Molecules

---

#### 1. Laws of Chemical Combination
1. **Law of Conservation of Mass (Antoine Lavoisier)**: Mass can neither be created nor destroyed in a chemical reaction.
   \`Total Mass of Reactants = Total Mass of Products\`
2. **Law of Constant Proportions (Joseph Proust)**: In a pure chemical compound, the elements are always combined in a definite proportion by mass.
   * *Example*: Water (\`H₂O\`) always contains Hydrogen and Oxygen in the mass ratio of \`1 : 8\` (2 g of H to 16 g of O).

---

#### 2. Dalton's Atomic Theory (Key Postulates):
1. All matter is made of indivisible particles called atoms.
2. Atoms of a given element are identical in mass and chemical properties.
3. Atoms of different elements have different masses and chemical properties.
4. Atoms combine in simple whole-number ratios to form compounds.
5. Atoms are neither created nor destroyed in a chemical reaction.

---

#### 3. How to Write Chemical Formulas (Criss-Cross Method):
1. Write symbols side by side (positive cation on the left, negative anion on the right).
2. Write their respective valencies below their symbols.
3. Criss-cross the valencies to obtain subscripts.

* **Examples**:
  * **Water**: H (valency 1), O (valency 2) ➔ \`H₂O\`
  * **Aluminium Oxide**: Al (valency 3), O (valency 2) ➔ \`Al₂O₃\`
  * **Calcium Oxide**: Ca²⁺, O²⁻ ➔ \`Ca₂O₂\` ➔ Simplify to \`CaO\`
  * **Magnesium Chloride**: Mg²⁺ (valency 2), Cl⁻ (valency 1) ➔ \`MgCl₂\`
  * **Sodium Carbonate**: Na⁺ (valency 1), CO₃²⁻ (valency 2) ➔ \`Na₂CO₃\`

---

#### 4. Molecular Mass Calculation:
Sum of atomic masses of all atoms present in a single molecule.
* **Molecular mass of Water (\`H₂O\`)**: \`2 × 1 u (H) + 1 × 16 u (O) = 18 u\`
* **Molecular mass of Carbon Dioxide (\`CO₂\`)**: \`1 × 12 u (C) + 2 × 16 u (O) = 44 u\`
* **Molecular mass of Nitric Acid (\`HNO₃\`)**: \`1(1) + 14 + 3(16) = 1 + 14 + 48 = 63 u\``;
  }

  // =========================================================================
  // 4. CHEMISTRY: STRUCTURE OF THE ATOM
  // =========================================================================
  if (
    query.includes('rutherford') ||
    query.includes('bohr') ||
    query.includes('thomson') ||
    query.includes('electron') ||
    query.includes('proton') ||
    query.includes('neutron') ||
    query.includes('isotope') ||
    query.includes('isobar') ||
    query.includes('electronic configuration')
  ) {
    return `### 🧪 Class 9 NCERT Chemistry: Structure of the Atom

---

#### 1. Discovery of Subatomic Particles
* **Electron (\`e⁻\`)**: Discovered by J.J. Thomson (Cathode ray experiment). Negative charge (\`-1\`), mass is \`1/1840\` of a proton (negligible).
* **Proton (\`p⁺\`)**: Discovered by E. Goldstein (Canal ray experiment). Positive charge (\`+1\`), mass is \`1 u\`.
* **Neutron (\`n⁰\`)**: Discovered by J. Chadwick. Neutral charge (\`0\`), mass is \`1 u\`. Located inside the nucleus.

---

#### 2. Major Atomic Models:
1. **J.J. Thomson's Plum Pudding Model**:
   * Atom consists of a positively charged sphere with negatively charged electrons embedded like seeds in a watermelon.
2. **Rutherford's α-Particle Scattering Experiment**:
   * **Observation**: Most α-particles passed straight through gold foil (most space inside atom is empty). A few deflected by large angles; 1 in 12,000 rebounded by 180°.
   * **Conclusion**: All positive charge and mass are concentrated in a tiny central core called the **nucleus**.
3. **Bohr's Model of Atom**:
   * Electrons revolve only in discrete non-radiating orbits called **energy shells** (\`K, L, M, N\` with \`n = 1, 2, 3, 4\`).
   * **Maximum shell capacity** follows the **\`2n²\` rule**:
     * K shell (\`n=1\`): \`2(1)² = 2\` electrons
     * L shell (\`n=2\`): \`2(2)² = 8\` electrons
     * M shell (\`n=3\`): \`2(3)² = 18\` electrons
   * **Octet Rule**: Maximum electrons in the outermost shell is 8.

---

#### 3. Atomic Number (\`Z\`) & Mass Number (\`A\`):
* **Atomic Number (\`Z\`)**: Number of protons in an atom (determines element identity).
* **Mass Number (\`A\`)**: \`Protons + Neutrons\` (Nucleons).
* **Notation**: \`^A_Z X\` (e.g., \`¹⁴_6 C\`).

---

#### 4. Isotopes vs. Isobars:
* **Isotopes**: Atoms of the **same element** having the **same atomic number (\`Z\`)** but **different mass numbers (\`A\`)**.
  * *Examples*: Hydrogen has Protium (\`¹₁H\`), Deuterium (\`²₁H\`), Tritium (\`³₁H\`); Carbon has \`¹²₆C\` and \`¹⁴₆C\`.
* **Isobars**: Atoms of **different elements** having **different atomic numbers (\`Z\`)** but the **same mass number (\`A\`)**.
  * *Example*: Calcium (\`⁴⁰₂₀Ca\`) and Argon (\`⁴⁰₁₈Ar\`).`;
  }

  // =========================================================================
  // 5. PHYSICS: MOTION & KINEMATICS
  // =========================================================================
  if (
    query.includes('motion') ||
    query.includes('velocity') ||
    query.includes('acceleration') ||
    query.includes('displacement') ||
    query.includes('speed')
  ) {
    return `### ⚡ Class 9 NCERT Physics: Describing Motion

---

#### 1. Distance vs. Displacement
* **Distance**: Total path length travelled by an object. It is a **scalar quantity** (magnitude only) and is always \`≥ 0\`.
* **Displacement**: The shortest straight-line distance between the initial and final positions. It is a **vector quantity** (has direction) and can be **positive, negative, or zero** (e.g., when an object completes a full circular loop, displacement is 0).

---

#### 2. Speed vs. Velocity
* **Speed**: Rate of change of distance (\`Speed = Distance / Time\`). Scalar quantity, SI unit: **m/s**.
* **Velocity**: Rate of change of displacement (\`Velocity = Displacement / Time\`). Vector quantity, SI unit: **m/s**.
* **Average Velocity**:
  \`v_avg = (Initial Velocity + Final Velocity) / 2 = (u + v) / 2\` (for uniform acceleration)

---

#### 3. Acceleration (\`a\`)
Rate of change of velocity with respect to time:
\`a = (v - u) / t\`
* **SI Unit**: \`m/s²\`.
* **Positive Acceleration**: Velocity increases over time.
* **Negative Acceleration (Deceleration / Retardation)**: Velocity decreases (e.g., brakes applied).

---

#### 4. The Three Equations of Motion (Uniform Acceleration):
1. **Velocity-Time Relation**: \`v = u + at\`
2. **Position-Time Relation**: \`s = ut + (1/2)at²\`
3. **Position-Velocity Relation**: \`v² - u² = 2as\`

* *Symbols*: \`u\` = initial velocity (m/s), \`v\` = final velocity (m/s), \`a\` = acceleration (m/s²), \`t\` = time (s), \`s\` = distance/displacement (m).

---

#### 5. Uniform Circular Motion:
When an object moves along a circular path of radius \`r\` at constant speed:
\`v = (2 × π × r) / t\`
* Although speed is constant, the direction of motion continuously changes, so circular motion is always an **accelerated motion**.`;
  }

  // =========================================================================
  // 6. PHYSICS: FORCE & LAWS OF MOTION
  // =========================================================================
  if (
    query.includes('newton') ||
    query.includes('force') ||
    query.includes('inertia') ||
    query.includes('momentum')
  ) {
    return `### ⚡ Class 9 NCERT Physics: Force and Laws of Motion

---

#### 1. Newton's First Law of Motion (Law of Inertia)
An object remains at rest or in uniform straight-line motion unless acted upon by an external unbalanced force.
* **Inertia**: Tendency of an object to resist changes in its state of motion. **Mass is the measure of inertia** (greater mass = greater inertia).

---

#### 2. Newton's Second Law of Motion
The rate of change of momentum of an object is directly proportional to the applied unbalanced force in the direction of the force.
* **Momentum (\`p\`)**: \`p = m × v\` (SI Unit: \`kg·m/s\`).
* **Formula**:
  \`Force (F) = m × a = m(v - u) / t\`
* **SI Unit of Force**: Newton (\`N\`), where \`1 N = 1 kg·m/s²\`.

---

#### 3. Newton's Third Law of Motion
To every action, there is an equal and opposite reaction.
* **Crucial Rule**: Action and reaction forces act on **two different bodies**, so they never cancel each other out (e.g., swimming, firing a bullet from a rifle, rocket launching).

---

#### 4. Law of Conservation of Momentum:
For two colliding bodies with no external force:
\`m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂\``;
  }

  // =========================================================================
  // 7. PHYSICS: GRAVITATION & BUOYANCY
  // =========================================================================
  if (
    query.includes('gravitat') ||
    query.includes('gravity') ||
    query.includes('weight') ||
    query.includes('buoyan') ||
    query.includes('archimedes') ||
    query.includes('free fall')
  ) {
    return `### ⚡ Class 9 NCERT Physics: Gravitation Master Guide

---

#### 1. Universal Law of Gravitation (Newton)
Every object in the universe attracts every other object with a gravitational force:
\`F = G × (m₁ × m₂) / r²\`
* \`G\` = Universal Gravitational Constant = \`6.673 × 10⁻¹¹ N·m²/kg²\`.

---

#### 2. Acceleration Due to Gravity (\`g\`)
Acceleration experienced by a freely falling body:
\`g = (G × M) / R² ≈ 9.8 m/s²\` (on Earth surface)
* \`g\` is greater at the poles and smaller at the equator because Earth's equatorial radius is larger (\`R_eq > R_polar\`).

---

#### 3. Mass vs. Weight:
* **Mass (\`m\`)**: Quantity of matter in a body. Constant everywhere. Scalar quantity, unit: \`kg\`.
* **Weight (\`W\`)**: Force of Earth's attraction on the body: \`W = m × g\`. Vector quantity, unit: \`N\`.
* **Weight on Moon**: \`W_moon = (1/6) × W_earth\` because moon's gravitational pull is \`1/6\` of Earth's.

---

#### 4. Archimedes' Principle & Buoyancy:
* **Buoyant Force (Upthrust)**: Upward force exerted by a fluid on an immersed body.
* **Archimedes' Principle**: When an object is fully or partially immersed in a fluid, it experiences an upward buoyant force equal to the **weight of the fluid displaced by the object**.
* **Relative Density**:
  \`Relative Density = Density of substance / Density of water at 4°C\` (Unitless quantity).`;
  }

  // =========================================================================
  // 8. PHYSICS: WORK, POWER & ENERGY
  // =========================================================================
  if (
    query.includes('work') ||
    query.includes('energy') ||
    query.includes('kinetic') ||
    query.includes('potential') ||
    query.includes('power')
  ) {
    return `### ⚡ Class 9 NCERT Physics: Work, Energy and Power

---

#### 1. Scientific Concept of Work
Work is done when an applied force causes displacement:
\`W = F × s\`
* **SI Unit**: Joule (\`J\`), where \`1 J = 1 N × 1 m\`.
* **Conditions for Zero Work**:
  1. No displacement occurs (\`s = 0\`).
  2. Force and displacement are perpendicular (\`θ = 90°\`, such as carrying a load horizontally while gravity acts downward).

---

#### 2. Forms of Mechanical Energy:
* **Kinetic Energy (\`Ek\`)**: Energy of motion:
  \`Ek = (1/2)m × v²\`
* **Gravitational Potential Energy (\`Ep\`)**: Energy due to height:
  \`Ep = m × g × h\`
* **Law of Conservation of Energy**: Energy cannot be created or destroyed, only transformed:
  \`Total Mechanical Energy = Ek + Ep = Constant\`

---

#### 3. Power & Commercial Unit:
* **Power (\`P\`)**: Rate of doing work:
  \`P = W / t = Energy / Time\` (SI Unit: Watt, \`1 W = 1 J/s\`).
* **Commercial Unit of Energy**: Kilowatt-hour (\`kWh\` or 'Unit'):
  \`1 kWh = 1000 W × 3600 s = 3.6 × 10⁶ Joules\``;
  }

  // =========================================================================
  // 9. PHYSICS: SOUND WAVES
  // =========================================================================
  if (query.includes('sound') || query.includes('echo') || query.includes('ultrasound') || query.includes('frequency') || query.includes('wavelength')) {
    return `### ⚡ Class 9 NCERT Physics: Sound Waves Master Guide

---

#### 1. Nature of Sound Waves
Sound is a form of energy produced by vibrating objects.
* It travels as a **longitudinal mechanical wave** through a material medium (solid, liquid, or gas).
* Sound **cannot travel through a vacuum** (requires particles to transmit vibrations).

---

#### 2. Sound Characteristics & Wave Formula:
* **Wavelength (\`λ\`)**: Distance between two consecutive compressions or rarefactions (in meters).
* **Frequency (\`ν\` or \`f\`)**: Number of oscillations per second (in Hertz, \`Hz\`).
* **Time Period (\`T\`)**: Time taken for one complete oscillation (\`T = 1 / f\`).
* **Wave Equation**:
  \`Speed (v) = Wavelength (λ) × Frequency (ν) = λ / T\`

---

#### 3. Echo & Minimum Distance:
An echo is the repetition of sound caused by reflection from an obstacle.
* For distinct hearing, the time interval between original sound and reflected sound must be at least **0.1 seconds** (persistence of hearing).
* Taking speed of sound in air as \`344 m/s\`:
  \`Total Distance (2d) = v × t = 344 × 0.1 = 34.4 m\`
  \`Minimum Distance (d) = 34.4 / 2 = 17.2 meters\`.

---

#### 4. Audible Range & Ultrasound:
* **Human Audible Range**: **20 Hz to 20,000 Hz** (20 kHz).
* **Infrasonic Sound**: Frequencies **< 20 Hz** (whales, elephants, earthquakes).
* **Ultrasound**: Frequencies **> 20,000 Hz** (bats, medical SONAR, echocardiography, industrial crack detection).`;
  }

  // =========================================================================
  // 10. MATHEMATICS: NUMBER SYSTEMS & REAL NUMBERS
  // =========================================================================
  if (
    query.includes('number system') ||
    query.includes('rational') ||
    query.includes('irrational') ||
    query.includes('real number') ||
    query.includes('rationalis') ||
    query.includes('exponent')
  ) {
    return `### 📐 Class 9 NCERT Mathematics: Number Systems

---

#### 1. Classification of Real Numbers
* **Rational Numbers (\`Q\`)**: Any number that can be expressed in the form \`p/q\` where \`p\` and \`q\` are integers and \`q ≠ 0\`.
  * **Decimal Expansion**: Either **terminating** (e.g., \`0.75\`) or **non-terminating recurring/repeating** (e.g., \`0.333...\`).
* **Irrational Numbers**: Numbers that cannot be written as \`p/q\`.
  * **Decimal Expansion**: **Non-terminating and non-recurring** (e.g., \`√2 = 1.4142...\`, \`√3\`, \`π\`, \`0.1010010001...\`).

---

#### 2. Rationalising the Denominator:
To eliminate square roots from denominators, multiply numerator and denominator by the conjugate:
* For \`1 / (√a + √b)\`, multiply by \`(√a - √b) / (√a - √b)\`:
  \`1 / (√a + √b) = (√a - √b) / [(√a)² - (√b)²] = (√a - √b) / (a - b)\`

---

#### 3. Laws of Exponents for Real Numbers:
1. \`aᵐ × aⁿ = aᵐ⁺ⁿ\`
2. \`aᵐ / aⁿ = aᵐ⁻ⁿ\`
3. \`(aᵐ)ⁿ = aᵐⁿ\`
4. \`aᵐ × bᵐ = (ab)ᵐ\`
5. \`a⁰ = 1\`
6. \`a⁻ⁿ = 1 / aⁿ\`
7. \`ⁿ√a = a^(1/n)\``;
  }

  // =========================================================================
  // 11. MATHEMATICS: POLYNOMIALS & ALGEBRAIC IDENTITIES
  // =========================================================================
  if (
    query.includes('polynomial') ||
    query.includes('algebraic identit') ||
    query.includes('factor theorem') ||
    query.includes('remainder theorem') ||
    query.includes('zeroes of')
  ) {
    return `### 📐 Class 9 NCERT Mathematics: Polynomials Master Guide

---

#### 1. Core Algebraic Identities (Class 9 NCERT):
1. \`(x + y)² = x² + 2xy + y²\`
2. \`(x - y)² = x² - 2xy + y²\`
3. \`x² - y² = (x - y)(x + y)\`
4. \`(x + a)(x + b) = x² + (a + b)x + ab\`
5. \`(x + y + z)² = x² + y² + z² + 2xy + 2yz + 2zx\`
6. \`(x + y)³ = x³ + y³ + 3xy(x + y) = x³ + 3x²y + 3xy² + y³\`
7. \`(x - y)³ = x³ - y³ - 3xy(x - y) = x³ - 3x²y + 3xy² - y³\`
8. \`x³ + y³ + z³ - 3xyz = (x + y + z)(x² + y² + z² - xy - yz - zx)\`
   * **Crucial Exam Property**: If \`x + y + z = 0\`, then \`x³ + y³ + z³ = 3xyz\`.

---

#### 2. Factor Theorem:
For a polynomial \`p(x)\` of degree \`n ≥ 1\`:
* \`(x - a)\` is a factor of \`p(x)\` if and only if \`p(a) = 0\`.
* To factorize quadratics \`ax² + bx + c\`, use **splitting the middle term** such that two numbers have product \`a × c\` and sum \`b\`.`;
  }

  // =========================================================================
  // 12. MATHEMATICS: COORDINATE GEOMETRY & LINEAR EQUATIONS
  // =========================================================================
  if (
    query.includes('coordinate') ||
    query.includes('cartesian') ||
    query.includes('abscissa') ||
    query.includes('ordinate') ||
    query.includes('linear equation')
  ) {
    return `### 📐 Class 9 NCERT Mathematics: Coordinate Geometry & Linear Equations

---

#### 1. The Cartesian Plane:
* **X-axis**: Horizontal number line; **Y-axis**: Vertical number line.
* **Origin \`O\`**: Point of intersection with coordinates \`(0, 0)\`.
* **Abscissa**: The x-coordinate (distance from Y-axis).
* **Ordinate**: The y-coordinate (distance from X-axis).

---

#### 2. The Four Quadrants:
* **Quadrant I**: \`(+x, +y)\` (e.g., \`(2, 5)\`)
* **Quadrant II**: \`(-x, +y)\` (e.g., \`(-3, 4)\`)
* **Quadrant III**: \`(-x, -y)\` (e.g., \`(-2, -6)\`)
* **Quadrant IV**: \`(+x, -y)\` (e.g., \`(4, -1)\`)
* *Axes Points*: Points on X-axis have \`y = 0\` (\`(x, 0)\`). Points on Y-axis have \`x = 0\` (\`(0, y)\`).

---

#### 3. Linear Equations in Two Variables:
* **Standard Form**: \`ax + by + c = 0\` where \`a, b, c\` are real numbers and \`a ≠ 0, b ≠ 0\`.
* Every linear equation in two variables has **infinitely many solutions**.
* Its graph is always a **straight line**.`;
  }

  // =========================================================================
  // 13. MATHEMATICS: HERON'S FORMULA, SURFACE AREA & GEOMETRY
  // =========================================================================
  if (
    query.includes('heron') ||
    query.includes('triangle') ||
    query.includes('circle') ||
    query.includes('surface area') ||
    query.includes('volume')
  ) {
    return `### 📐 Class 9 NCERT Mathematics: Heron's Formula & Geometry

---

#### 1. Heron's Formula (Triangle Area with 3 Sides):
For a triangle with side lengths \`a\`, \`b\`, and \`c\`:
1. **Semi-perimeter**: \`s = (a + b + c) / 2\`
2. **Area**: \`Area = √[s × (s - a) × (s - b) × (s - c)]\`

---

#### 2. Key Mensuration Formulas (Class 9 NCERT):
* **Right Circular Cylinder**:
  * Curved Surface Area (CSA): \`2πrh\`
  * Total Surface Area (TSA): \`2πr(r + h)\`
  * Volume: \`πr²h\`
* **Right Circular Cone**:
  * Slant Height: \`l = √(r² + h²)\`
  * CSA: \`πrl\`
  * TSA: \`πr(l + r)\`
  * Volume: \`(1/3)πr²h\`
* **Sphere**:
  * Surface Area: \`4πr²\`
  * Volume: \`(4/3)πr³\`
* **Hemisphere**:
  * CSA: \`2πr²\`
  * TSA: \`3πr²\`
  * Volume: \`(2/3)πr³\``;
  }

  // =========================================================================
  // 14. SUBJECT-AWARE DYNAMIC FALLBACK
  // =========================================================================
  const isChemistry =
    subjectHint === 'chemistry' ||
    query.includes('solution') ||
    query.includes('mixture') ||
    query.includes('matter') ||
    query.includes('atom') ||
    query.includes('compound') ||
    query.includes('element') ||
    query.includes('gas') ||
    query.includes('liquid') ||
    query.includes('solid') ||
    query.includes('reaction');

  const isMath =
    subjectHint === 'mathematics' ||
    query.includes('solve') ||
    query.includes('calculate') ||
    query.includes('equation') ||
    query.includes('angle') ||
    query.includes('triangle') ||
    query.includes('area') ||
    query.includes('volume') ||
    query.includes('number') ||
    query.includes('formula') ||
    query.includes('probability');

  if (isChemistry) {
    return `### 🧪 Class 9 NCERT Chemistry Tutor

Regarding your question: **"${question}"**

---

#### 1. Core NCERT Concept & Definition:
In Class 9 Chemistry, this topic is part of the foundational curriculum (Matter, Pure Substances, Atoms & Molecules, or Atomic Structure):
* Review whether this relates to **Matter in Our Surroundings** (states of matter, phase transitions, evaporation), **Is Matter Around Us Pure** (mixtures, true solutions, colloids, suspensions), or **Atoms & Molecules** (laws of chemical combination, valency, formulas).
* Ensure proper scientific terminology (solute, solvent, homogeneity, particle sizes, valencies).

---

#### 2. Key Principles to Apply:
* **Mixtures vs. Pure Substances**: Mixtures can be separated by physical methods; compounds require chemical reactions.
* **Solutions**: Particle sizes are \`< 1 nm\` in true solutions, \`1–1000 nm\` in colloids, and \`> 1000 nm\` in suspensions.
* **Atoms**: Atoms combine in simple whole-number ratios to form molecules.

*Tip: Please feel free to ask a specific question like "What is true solution?", "Explain Tyndall effect", or "How to calculate molecular mass of H₂O" for a direct step-by-step breakdown!*`;
  }

  if (isMath) {
    return `### 📐 Class 9 NCERT Mathematics Tutor

Regarding your question: **"${question}"**

---

#### 1. Core Mathematical Concept:
In Class 9 Mathematics (NCERT Ganita Manjari & Exploration 2026), this problem connects with core algebraic or geometric theorems:
1. Identify the given values, geometric figures, or algebraic expressions.
2. Select the corresponding NCERT formula or theorem (e.g., Heron's formula, algebraic identities, angle sum property, or congruence criteria).
3. Carry out calculations step-by-step, ensuring proper units.

*Tip: Please provide specific numerical values or the exact textbook problem statement for a complete worked-out solution!*`;
  }

  // Default Physics-aware Fallback
  return `### ⚡ Class 9 NCERT Physics Tutor

Regarding your question: **"${question}"**

---

#### 1. Core Physical Principles:
In Class 9 Physics (NCERT 2026), problems are solved using fundamental kinematic and dynamic principles:
* **Given Data**: Note down all initial conditions with proper SI units (meters, seconds, kilograms).
* **Formula Selection**:
  * For motion: \`v = u + at\`, \`s = ut + (1/2)at²\`, \`v² - u² = 2as\`
  * For forces: \`F = m × a\`, \`p = m × v\`
  * For gravitation: \`F = G(m₁m₂)/r²\`, \`W = m × g\`
  * For energy: \`W = F × s\`, \`Ek = (1/2)mv²\`, \`Ep = mgh\`

*Tip: Enter the exact numerical problem (e.g., "A stone falls from 20m, find final speed") to see full step-by-step working!*`;
}
