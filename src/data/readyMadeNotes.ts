import { StudyNote } from '../types';

export const READY_MADE_NOTES: StudyNote[] = [
  // =========================================================================
  // ===================== PHYSICS (NCERT 2026 CURRICULUM) ===================
  // =========================================================================
  {
    id: 'ready-phy-motion',
    title: 'Describing Motion Around Us: Core Theory & Kinematic Equations',
    subjectId: 'physics',
    chapterId: 'phy-ch1',
    topicId: 'phy-mot-1',
    content: `# Chapter 1: Describing Motion Around Us (Class 9 Physics - NCERT 2026)

## 1. Concept of Motion and Reference Point
- **State of Rest and Motion**: Motion is relative to an observer. An object is in motion when its position changes continuously relative to a stationary reference frame or origin as time elapses.
- **Reference Frame**: The coordinate system chosen to describe position. A passenger inside a moving bus is stationary relative to fellow passengers, but in motion relative to roadside trees.

---

## 2. Distance vs. Displacement
- **Distance**: The total actual path length traversed by an object during its motion.
  - Scalar quantity (magnitude only).
  - Always positive for a moving object; never zero or negative.
- **Displacement**: The shortest straight-line distance directed from the initial position to the final position.
  - Vector quantity (both magnitude and direction).
  - Can be positive, negative, or zero (e.g. returning to the starting point gives zero displacement).
- **Core Relation**: Magnitude of displacement is always less than or equal to distance.

---

## 3. Speed, Velocity and Acceleration
- **Average Speed:**
  \`v_avg = Total Distance / Total Time\`
- **Average Velocity (with uniform acceleration):**
  \`v_avg = (u + v) / 2\`
- **Acceleration:** Rate of change of velocity:
  \`a = (v - u) / t\`
  * SI Unit: m/s²
  * When velocity decreases, acceleration is negative (called deceleration or retardation).

---

## 4. The Three Equations of Motion
For motion along a straight line under uniform acceleration \`a\`:
1. Velocity - Time Relation:
   \`v = u + at\`
2. Position - Time Relation:
   \`s = ut + (1/2)at²\`
3. Position - Velocity Relation:
   \`v² - u² = 2as\`

*Where:*
- \`u\` = initial velocity (m/s)
- \`v\` = final velocity (m/s)
- \`a\` = uniform acceleration (m/s²)
- \`t\` = time elapsed (s)
- \`s\` = displacement (m)

---

## 5. Graphical Analysis of Motion
- **Distance-Time (s-t) Graph:**
  - Slope = Speed of the object
  - Straight diagonal line = Uniform speed; Horizontal line = Body at rest
- **Velocity-Time (v-t) Graph:**
  - Slope = Acceleration (\`a = Δv / Δt\`)
  - Area enclosed under curve = Total Displacement (\`s\`)

---

## 6. Uniform Circular Motion
- When an object moves along a circular path of radius \`r\` with constant speed:
  \`v = (2πr) / T\`
- Even though the speed is constant, the direction of motion changes continuously at every point. Hence, uniform circular motion is always an accelerated motion.`,
    tags: ['Physics', 'Motion', 'Kinematics', 'Formulas', 'NCERT 2026'],
    isPinned: true,
    createdAt: '2026-10-04T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },
  {
    id: 'ready-phy-force',
    title: 'How Forces Affect Motion: Inertia, Momentum & Newton’s Laws',
    subjectId: 'physics',
    chapterId: 'phy-ch2',
    topicId: 'phy-force-1',
    content: `# Chapter 2: How Forces Affect Motion (Class 9 Physics - NCERT 2026)

## 1. Balanced and Unbalanced Forces
- **Balanced Forces**: Resultant net force = 0. Cannot change an object's velocity, but can deform its shape.
- **Unbalanced Forces**: Resultant net force ≠ 0. Produces acceleration, changing speed or direction.

---

## 2. Inertia and Mass
- **Inertia**: The natural tendency of an object to resist any change in its state of rest or uniform motion.
- **Forms of Inertia:**
  1. *Inertia of Rest*: Dust flies off a rug when beaten with a stick.
  2. *Inertia of Motion*: Passengers lurch forward when a bus suddenly brakes.
  3. *Inertia of Direction*: Water drops fly off tangentially from a rotating umbrella.
- **Mass as a Measure of Inertia**: A heavier body has greater mass, hence greater inertia.

---

## 3. Momentum & Newton's Second Law
- **Linear Momentum (\`p\`):**
  \`p = m × v\`
  * SI Unit: kg·m/s
  * Vector quantity in the direction of velocity.
- **Newton’s Second Law:**
  The rate of change of momentum is directly proportional to applied unbalanced force:
  \`F = m × a = (p₂ - p₁) / t\`
  * SI Unit: Newton (\`1 N = 1 kg·m/s²\`).

---

## 4. Newton’s Third Law of Motion
- To every action, there is an equal and opposite reaction.
- **Key Exam Rule:** Action and reaction forces act simultaneously on **two different interacting bodies**, which is why they never cancel each other out.
- Examples: Recoil of a gun upon firing, forward thrust of a rocket, and walking on the ground.`,
    tags: ['Physics', 'Forces', 'Newton Laws', 'Momentum', 'NCERT 2026'],
    isPinned: false,
    createdAt: '2026-10-04T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },
  {
    id: 'ready-phy-work',
    title: 'Work, Energy, and Simple Machines: Mechanics & Power',
    subjectId: 'physics',
    chapterId: 'phy-ch3',
    topicId: 'phy-work-1',
    content: `# Chapter 3: Work, Energy, and Simple Machines (Class 9 Physics - NCERT 2026)

## 1. Scientific Concept of Work
- Scientific work is done only when a force produces a displacement along its line of action.
- **Formula:**
  \`W = F × s\`
- **SI Unit:** Joule (\`1 J = 1 N × 1 m\`).
- **Types of Work:**
  - *Positive Work*: Force and displacement are in the same direction.
  - *Negative Work*: Opposing force (e.g. friction opposes motion).
  - *Zero Work*: Displacement is zero, or force is perpendicular to displacement (e.g. satellite orbiting Earth).

---

## 2. Kinetic & Gravitational Potential Energy
- **Kinetic Energy (energy of motion):**
  \`Ek = (1/2)mv²\`
- **Gravitational Potential Energy (energy of position at height h):**
  \`Ep = m × g × h\` (take g ≈ 9.8 m/s²)
- **Law of Conservation of Energy:**
  Energy cannot be created or destroyed, only transformed.
  In a freely falling body: \`Ek + Ep = Constant\`

---

## 3. Power and Simple Machines
- **Power (rate of doing work):**
  \`P = W / t\`
  * SI Unit: Watt (\`1 W = 1 J/s\`), \`1 kW = 1000 W\`.
- **Simple Machines:**
  - Devices that change the magnitude or direction of applied effort.
  - **Mechanical Advantage (MA):**
    \`Mechanical Advantage (MA) = Load / Effort\`
  - Common examples: Levers, pulleys, inclined planes, and wheel-and-axle systems.`,
    tags: ['Physics', 'Work', 'Energy', 'Simple Machines', 'Power', 'NCERT 2026'],
    isPinned: false,
    createdAt: '2026-10-04T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },
  {
    id: 'ready-phy-sound',
    title: 'Sound Waves: Characteristics and Applications',
    subjectId: 'physics',
    chapterId: 'phy-ch4',
    topicId: 'phy-sound-1',
    content: `# Chapter 4: Sound Waves: Characteristics and Applications (Class 9 Physics - NCERT 2026)

## 1. Production and Nature of Sound
- Sound is produced by vibrating objects and travels as a **longitudinal mechanical wave**.
- Requires a material medium (solid, liquid, or gas) for propagation; sound cannot travel through a vacuum (bell jar experiment).
- Propagates via alternating regions of:
  - **Compressions (C):** High pressure and high density.
  - **Rarefactions (R):** Low pressure and low density.

---

## 2. Wave Characteristics & The Wave Equation
- **Wavelength (\`λ\`):** Distance between two consecutive compressions or rarefactions (meters).
- **Frequency (\`ν\`):** Number of complete wave oscillations per second (Hertz, Hz).
- **Time Period (\`T\`):** Time taken for one complete oscillation (\`T = 1 / ν\`).
- **Wave Speed Equation:**
  \`v = ν × λ = λ / T\`
- **Pitch vs. Loudness:**
  - *Pitch* depends on Frequency (\`ν\`).
  - *Loudness* depends on Amplitude (\`A\`).

---

## 3. Echo & Ultrasound Applications
- **Echo Distance Calculation:**
  \`d = (v × t) / 2\`
  * Persistence of hearing in the human ear is \`0.1 s\`.
  * Minimum obstacle distance in air = \`(344 × 0.1) / 2 = 17.2 m\`.
- **Ultrasound (\`> 20,000 Hz\`):**
  Used in non-destructive metal flaw detection, ultrasonic cleaning, and medical imaging.`,
    tags: ['Physics', 'Sound', 'Waves', 'Echo', 'Ultrasound', 'NCERT 2026'],
    isPinned: false,
    createdAt: '2026-10-04T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },

  // =========================================================================
  // ==================== CHEMISTRY (NCERT 2026 CURRICULUM) =================
  // =========================================================================
  {
    id: 'ready-chem-mixtures',
    title: 'Exploring Mixtures and Their Separation: Solutions & Methods',
    subjectId: 'chemistry',
    chapterId: 'chem-ch1',
    topicId: 'chem-mix-1',
    content: `# Chapter 1: Exploring Mixtures and Their Separation (Class 9 Chemistry - NCERT 2026)

## 1. Pure Substances vs. Mixtures
- **Pure Substances**:
  - *Elements*: Composed of one type of atom (metals, non-metals, metalloids).
  - *Compounds*: Composed of two or more elements chemically combined in fixed proportions by mass.
- **Mixtures**:
  - *Homogeneous*: Uniform composition throughout (e.g. salt dissolved in water).
  - *Heterogeneous*: Non-uniform composition (e.g. sand in water, oil and water).

---

## 2. Solutions, Suspensions and Colloids
| Property | True Solution | Colloid | Suspension |
| :--- | :--- | :--- | :--- |
| **Particle Size** | \`< 1 nm\` | \`1 nm - 1000 nm\` | \`> 1000 nm\` |
| **Stability** | Completely stable | Stable (does not settle) | Unstable (settles down) |
| **Tyndall Effect** | Absent (no scattering) | **Present (scatters light)** | Present until settled |
| **Filterability** | Passes filter paper | Passes filter paper | Separated by filter paper |

---

## 3. Concentration Formulas of Solutions
- **Mass Percentage (Mass by Mass):**
  \`Mass % = (Mass of Solute / Mass of Solution) × 100\`
  *Note: Mass of Solution = Mass of Solute + Mass of Solvent!*
- **Volume Percentage (Volume by Volume):**
  \`Volume % = (Volume of Solute / Volume of Solution) × 100\`

---

## 4. Separation Techniques
- **Filtration**: Separates insoluble solid particles from a liquid.
- **Centrifugation**: Separates denser particles to bottom via rapid spinning (blood testing, dairy cream separation).
- **Chromatography**: Separates colored solutes based on differing solubility in a mobile solvent.
- **Crystallization**: Purifies solids by cooling concentrated solutions (e.g. pure copper sulphate).`,
    tags: ['Chemistry', 'Mixtures', 'Solutions', 'Colloids', 'Separation', 'NCERT 2026'],
    isPinned: true,
    createdAt: '2026-10-04T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },
  {
    id: 'ready-chem-atom-journey',
    title: 'Journey Inside the Atom: Subatomic Particles & Bohr Model',
    subjectId: 'chemistry',
    chapterId: 'chem-ch2',
    topicId: 'chem-atom-1',
    content: `# Chapter 2: Journey Inside the Atom (Class 9 Chemistry - NCERT 2026)

## 1. Discovery of Subatomic Particles
- **Electron (\`e⁻\`):** Discovered by J.J. Thomson (cathode ray experiment). Charge = -1, mass negligible.
- **Proton (\`p⁺\`):** Discovered by E. Goldstein (canal rays). Charge = +1, mass = 1 u.
- **Neutron (\`n\`):** Discovered by James Chadwick (1932). Charge = 0 (neutral), mass = 1 u.

---

## 2. Evolution of Atomic Models
- **Thomson’s Plum Pudding Model:** Spherical cloud of positive charge with electrons embedded like raisins. Failed to explain large-angle scattering.
- **Rutherford’s Nuclear Model:** Alpha-particle gold foil experiment revealed:
  - Most alpha particles pass straight through => atom is mostly empty space.
  - Very few deflected at large angles => small, dense, positively charged **nucleus** at center.
  - Limitation: Orbiting electrons would radiate energy and collapse into the nucleus.

---

## 3. Bohr’s Model of the Atom
- Electrons revolve only in discrete, non-radiating stationary orbits called **energy shells** (K, L, M, N...).
- **Bohr-Bury Electron Distribution Rules:**
  \`Max Electrons = 2n²\`
  * K shell (\`n = 1\`): \`2 × 1² = 2\`
  * L shell (\`n = 2\`): \`2 × 2² = 8\`
  * M shell (\`n = 3\`): \`2 × 3² = 18\`
  * N shell (\`n = 4\`): \`2 × 4² = 32\`
- Outermost shell can hold a maximum of **8 electrons** (Octet Rule).

---

## 4. Atomic Number, Mass Number, Isotopes & Isobars
- **Atomic Number (\`Z\`):** Number of protons in the nucleus.
- **Mass Number (\`A\`):** Total count of nucleons (protons + neutrons):
  \`A = Z + N\`
- **Isotopes:** Atoms of the same element with identical atomic number \`Z\` but different mass numbers \`A\` (e.g. ³⁵Cl₁₇ and ³⁷Cl₁₇).
- **Isobars:** Atoms of different elements with different atomic numbers \`Z\` but the same mass number \`A\` (e.g. ⁴⁰Ar₁₈ and ⁴⁰Ca₂₀).`,
    tags: ['Chemistry', 'Atomic Structure', 'Bohr Model', 'Isotopes', 'NCERT 2026'],
    isPinned: false,
    createdAt: '2026-10-04T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },
  {
    id: 'ready-chem-foundations',
    title: 'Atomic Foundation of Matter: Laws & Formula Writing',
    subjectId: 'chemistry',
    chapterId: 'chem-ch3',
    topicId: 'chem-found-1',
    content: `# Chapter 3: Atomic Foundation of Matter (Class 9 Chemistry - NCERT 2026)

## 1. Laws of Chemical Combination
- **Law of Conservation of Mass (Lavoisier):** Mass can neither be created nor destroyed in a chemical reaction.
  \`Total Mass of Reactants = Total Mass of Products\`
- **Law of Constant Proportions (Proust):** In a chemical substance, elements are always present in definite proportions by mass regardless of the source.
  *Example:* In water (H₂O), the mass ratio \`m(H) / m(O) = 2 / 16 = 1 / 8\`.

---

## 2. Atoms, Molecules and Valency
- **Atom:** Smallest particle of an element that takes part in chemical reactions.
- **Molecule:** Smallest independent particle of an element or compound capable of independent existence.
- **Ions:** Charged species:
  - Cation: Positively charged (\`Na⁺, Ca²⁺, Al³⁺\`).
  - Anion: Negatively charged (\`Cl⁻, O²⁻, N³⁻\`).
  - Polyatomic Ions: Group of atoms carrying a charge (\`NH₄⁺, SO₄²⁻, CO₃²⁻, OH⁻\`).

---

## 3. Writing Chemical Formulae (Criss-Cross Method)
1. Write symbols side-by-side (cation first, then anion).
2. Write valency charges below each symbol.
3. Cross-over valencies and simplify to the lowest integer ratio.
*Examples:*
- Aluminium Oxide: Al (valency 3) and O (valency 2) => \`Al₂O₃\`
- Calcium Chloride: Ca (valency 2) and Cl (valency 1) => \`CaCl₂\`
- Ammonium Sulphate: NH₄ (valency 1) and SO₄ (valency 2) => \`(NH₄)₂SO₄\`

---

## 4. Molecular Mass Calculation
- **Molecular Mass:** Sum of atomic masses of all atoms present in a molecule.
  *Example:* Molecular mass of Nitric Acid (\`HNO₃\`):
  \`M = 1(H) + 14(N) + 3 × 16(O) = 1 + 14 + 48 = 63 u\``,
    tags: ['Chemistry', 'Chemical Formula', 'Molecular Mass', 'Valency', 'NCERT 2026'],
    isPinned: false,
    createdAt: '2026-10-04T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },

  // =========================================================================
  // ================= MATHEMATICS (GANITA MANJARI - NCERT 2026) =============
  // =========================================================================
  {
    id: 'ready-math-coordinates',
    title: 'Orienting Yourself: The Use of Coordinates Master Guide',
    subjectId: 'mathematics',
    chapterId: 'math-ch1',
    topicId: 'math-coord-1',
    content: `# Chapter 1: Orienting Yourself: The Use of Coordinates (Ganita Manjari - NCERT 2026)

## 1. The Cartesian Coordinate System
- **Axes**: Horizontal line is the x-axis; vertical line is the y-axis. They intersect perpendicularly at the **origin (0, 0)**.
- **Coordinates of a Point P(x, y)**:
  - \`x\` is the **Abscissa** (perpendicular distance from y-axis).
  - \`y\` is the **Ordinate** (perpendicular distance from x-axis).
- **Four Quadrants & Sign Conventions:**
  - Quadrant I: \`(+x, +y)\`
  - Quadrant II: \`(-x, +y)\`
  - Quadrant III: \`(-x, -y)\`
  - Quadrant IV: \`(+x, -y)\`
  - Points on x-axis have \`y = 0\` => \`(x, 0)\`
  - Points on y-axis have \`x = 0\` => \`(0, y)\`

---

## 2. Distance Formula
The straight-line distance between two points \`P(x₁, y₁)\` and \`Q(x₂, y₂)\`:
\`d = √[(x₂ - x₁)² + (y₂ - y₁)²]\`

- **Distance of Point P(x, y) from the Origin (0, 0):**
  \`OP = √(x² + y²)\`

---

## 3. Midpoint Formula
Coordinates of the midpoint \`M\` of line segment joining \`P(x₁, y₁)\` and \`Q(x₂, y₂)\`:
\`M = ((x₁ + x₂) / 2, (y₁ + y₂) / 2)\`

---

## 4. Geometric Applications
- **Collinear Points:** Three points A, B, C are collinear if \`AB + BC = AC\`.
- **Equilateral Triangle:** All three side distances are equal (\`AB = BC = CA\`).
- **Right Triangle:** Satisfies Pythagorean condition: \`AB² + BC² = AC²\`.`,
    tags: ['Mathematics', 'Coordinates', 'Distance Formula', 'Midpoint', 'NCERT 2026'],
    isPinned: true,
    createdAt: '2026-10-04T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },
  {
    id: 'ready-math-polynomials',
    title: 'Introduction to Linear Polynomials: Concepts & Solutions',
    subjectId: 'mathematics',
    chapterId: 'math-ch2',
    topicId: 'math-poly-1',
    content: `# Chapter 2: Introduction to Linear Polynomials (Ganita Manjari - NCERT 2026)

## 1. Polynomial Expressions & Classification
- An algebraic expression \`p(x) = aₙxⁿ + ... + a₁x + a₀\` where powers of x are non-negative whole numbers.
- **Degree**: Highest power of variable in the polynomial.
  - Linear Polynomial: Degree = 1 (e.g. \`3x + 5\`)
  - Quadratic Polynomial: Degree = 2 (e.g. \`x² - 4x + 3\`)
  - Cubic Polynomial: Degree = 3 (e.g. \`2x³ + x² - 1\`)

---

## 2. Zero of a Linear Polynomial
- The value of x for which \`p(x) = 0\`.
- For standard linear polynomial \`p(x) = ax + b\` (with \`a ≠ 0\`):
  \`ax + b = 0  =>  x = -b / a\`
- A linear polynomial has **exactly one unique real zero**.

---

## 3. Linear Equations in Two Variables
- Standard Form:
  \`ax + by + c = 0\` (where \`a\` and \`b\` are not both zero).
- **Fundamental Principle:**
  Every linear equation in two variables has **infinitely many solutions** \`(x, y)\`.
- A solution is an ordered pair \`(x, y)\` which makes LHS equal to RHS.`,
    tags: ['Mathematics', 'Polynomials', 'Linear Equations', 'Zeroes', 'NCERT 2026'],
    isPinned: false,
    createdAt: '2026-10-04T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },
  {
    id: 'ready-math-numbers',
    title: 'The World of Numbers: Real Numbers, Decimals & Exponents',
    subjectId: 'mathematics',
    chapterId: 'math-ch3',
    topicId: 'math-num-1',
    content: `# Chapter 3: The World of Numbers (Ganita Manjari - NCERT 2026)

## 1. Rational vs. Irrational Numbers
- **Rational Numbers (\`Q\`):** Numbers expressible in \`p / q\` form where \`p, q\` are integers and \`q ≠ 0\`.
  - Decimal representation is either **terminating** (e.g. 0.75) or **non-terminating recurring/repeating** (e.g. 0.333...).
- **Irrational Numbers:** Numbers that cannot be expressed as \`p / q\`.
  - Decimal expansion is **non-terminating and non-recurring** (e.g. \`√2 = 1.41421...\`, \`π = 3.14159...\`).

---

## 2. Rationalising the Denominator
To remove square roots from denominators, multiply numerator and denominator by the conjugate pair:
\`1 / (√a ± √b) = (√a ∓ √b) / (a - b)\`

*Example:*
\`1 / (√5 - √3) = (√5 + √3) / [(√5)² - (√3)²] = (√5 + √3) / 2\`

---

## 3. Laws of Exponents for Real Numbers
For base \`a > 0\` and rational exponents \`m, n\`:
1. Product Rule: \`aᵐ × aⁿ = aᵐ⁺ⁿ\`
2. Quotient Rule: \`aᵐ / aⁿ = aᵐ⁻ⁿ\`
3. Power Rule: \`(aᵐ)ⁿ = aᵐⁿ\`
4. Different Bases: \`aᵐ × bᵐ = (ab)ᵐ\`
5. Zero Exponent: \`a⁰ = 1\`
6. Negative Exponent: \`a⁻ⁿ = 1 / aⁿ\``,
    tags: ['Mathematics', 'Number Systems', 'Rationalisation', 'Exponents', 'NCERT 2026'],
    isPinned: false,
    createdAt: '2026-10-04T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },
  {
    id: 'ready-math-identities',
    title: 'Exploring Algebraic Identities: Formulas & Factorisation',
    subjectId: 'mathematics',
    chapterId: 'math-ch4',
    topicId: 'math-ident-1',
    content: `# Chapter 4: Exploring Algebraic Identities (Ganita Manjari - NCERT 2026)

## 1. Core Quadratic Identities
1. \`(x + y)² = x² + 2xy + y²\`
2. \`(x - y)² = x² - 2xy + y²\`
3. \`x² - y² = (x - y)(x + y)\`
4. \`(x + a)(x + b) = x² + (a + b)x + ab\`

---

## 2. Trinomial Square Identity
\`(x + y + z)² = x² + y² + z² + 2(xy + yz + zx)\`

---

## 3. Cubic Identities
1. \`(x + y)³ = x³ + y³ + 3xy(x + y)\`
2. \`(x - y)³ = x³ - y³ - 3xy(x - y)\`
3. \`x³ + y³ = (x + y)(x² - xy + y²)\`
4. \`x³ - y³ = (x - y)(x² + xy + y²)\`

---

## 4. Conditional Three-Cube Identity (High-Yield Exam Shortcut)
General formula:
\`x³ + y³ + z³ - 3xyz = (x + y + z)(x² + y² + z² - xy - yz - zx)\`

**Crucial Shortcut Rule:**
\`If x + y + z = 0  =>  x³ + y³ + z³ = 3xyz\`

*Example:* Calculate \`(-12)³ + 7³ + 5³\` without cubing:
Here \`x = -12, y = 7, z = 5\`. Since \`-12 + 7 + 5 = 0\`:
\`(-12)³ + 7³ + 5³ = 3 × (-12) × 7 × 5 = -1260\``,
    tags: ['Mathematics', 'Algebra', 'Identities', 'Factoring', 'NCERT 2026'],
    isPinned: true,
    createdAt: '2026-10-04T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },
  {
    id: 'ready-math-circles',
    title: "I'm Up and Down, and Round and Round: Circular Geometry",
    subjectId: 'mathematics',
    chapterId: 'math-ch5',
    topicId: 'math-circle-1',
    content: `# Chapter 5: I'm Up and Down, and Round and Round (Ganita Manjari - NCERT 2026)

## 1. Chords and Central Angles
- Equal chords of a circle subtend equal angles at the center (and converse).
- The perpendicular drawn from the center of a circle to a chord **bisects the chord**.
- Equal chords are equidistant from the center of the circle.

---

## 2. Inscribed Angle Theorems
- **Central Angle Theorem:** The angle subtended by an arc at the center is double the angle subtended by it at any point on the remaining circumference:
  \`∠AOB = 2 × ∠APB\`
- **Angles in the Same Segment:** Angles subtended by an arc in the same segment of a circle are equal.
- **Angle in a Semicircle:** An angle inscribed in a semicircle is always a **right angle (90°)**.

---

## 3. Cyclic Quadrilaterals
- A quadrilateral whose all four vertices lie on the circumference of a circle.
- **Fundamental Property:**
  Opposite angles of a cyclic quadrilateral are supplementary:
  \`∠A + ∠C = 180°  and  ∠B + ∠D = 180°\``,
    tags: ['Mathematics', 'Circles', 'Geometry', 'Theorems', 'NCERT 2026'],
    isPinned: false,
    createdAt: '2026-10-04T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },
  {
    id: 'ready-math-area',
    title: 'Measuring Space: Perimeter and Area (Heron & Curved Surfaces)',
    subjectId: 'mathematics',
    chapterId: 'math-ch6',
    topicId: 'math-area-1',
    content: `# Chapter 6: Measuring Space: Perimeter and Area (Ganita Manjari - NCERT 2026)

## 1. Heron’s Formula for General Triangles
When side lengths \`a, b, c\` are known:
1. Semi-perimeter:
   \`s = (a + b + c) / 2\`
2. Area of Triangle:
   \`A = √[s(s - a)(s - b)(s - c)]\`

- **Equilateral Triangle Direct Area:**
  \`A = (√3 / 4)a²\`

---

## 2. Circular Sector and Arcs
For a circle of radius \`r\` and sector angle \`θ\`:
- Length of an Arc:
  \`L = (θ / 360°) × 2πr\`
- Area of a Sector:
  \`A_sector = (θ / 360°) × πr²\`

---

## 3. Curved Surface Areas and Volumes
- **Right Circular Cone:**
  - Slant height: \`l = √(r² + h²)\`
  - Curved Surface Area: \`CSA = πrl\`
  - Total Surface Area: \`TSA = πr(l + r)\`
  - Volume: \`V = (1/3)πr²h\`
- **Sphere:**
  - Surface Area: \`SA = 4πr²\`
  - Volume: \`V = (4/3)πr³\`
- **Hemisphere:**
  - Curved Surface Area: \`CSA = 2πr²\`
  - Total Surface Area: \`TSA = 3πr²\`
  - Volume: \`V = (2/3)πr³\``,
    tags: ['Mathematics', 'Mensuration', 'Heron Formula', 'Surface Area', 'NCERT 2026'],
    isPinned: false,
    createdAt: '2026-10-04T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },
  {
    id: 'ready-math-probability',
    title: 'The Mathematics of Maybe: Introduction to Probability',
    subjectId: 'mathematics',
    chapterId: 'math-ch7',
    topicId: 'math-prob-1',
    content: `# Chapter 7: The Mathematics of Maybe: Introduction to Probability (Ganita Manjari - NCERT 2026)

## 1. Fundamental Concepts of Probability
- **Random Experiment:** An experiment in which all possible outcomes are known in advance, but the exact outcome cannot be predicted beforehand (e.g. coin toss, rolling a die).
- **Sample Space (\`S\`):** The set of all possible outcomes.
  - Tossing a coin: \`S = {H, T}\` (total 2 outcomes).
  - Rolling a die: \`S = {1, 2, 3, 4, 5, 6}\` (total 6 outcomes).

---

## 2. Theoretical Probability Formula
\`P(E) = (Number of outcomes favourable to E) / (Total number of possible outcomes)\`

---

## 3. Critical Rules of Probability
1. **Range:**
   \`0 ≤ P(E) ≤ 1\`
2. **Impossible Event:** An event that can never happen has \`P(E) = 0\` (e.g. rolling a 7 on a standard 6-sided die).
3. **Sure / Certain Event:** An event that is guaranteed to occur has \`P(E) = 1\`.
4. **Complementary Events:**
   \`P(not E) = 1 - P(E)\``,
    tags: ['Mathematics', 'Probability', 'Sample Space', 'NCERT 2026'],
    isPinned: false,
    createdAt: '2026-10-04T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },
  {
    id: 'ready-math-sequences',
    title: 'Predicting What Comes Next: Exploring Sequences and Progression',
    subjectId: 'mathematics',
    chapterId: 'math-ch8',
    topicId: 'math-seq-1',
    content: `# Chapter 8: Predicting What Comes Next: Exploring Sequences and Progression (Ganita Manjari - NCERT 2026)

## 1. Number Sequences & Patterns
- A **sequence** is an ordered list of numbers following a definite rule.
- Terms are designated by position: \`a₁, a₂, a₃, ..., aₙ\`.

---

## 2. Arithmetic Progressions (AP)
- An **Arithmetic Progression** is a sequence in which each term is obtained by adding a fixed constant number \`d\` (common difference) to the preceding term.
- **Common Difference (\`d\`):**
  \`d = aₙ - aₙ₋₁\` (can be positive, negative, or zero).

---

## 3. General nth Term of an AP
To find the value of any term at position \`n\`:
\`aₙ = a + (n - 1)d\`

*Where:*
- \`a\` = first term (\`a₁\`)
- \`d\` = common difference
- \`n\` = position of the term

---

## 4. Sum of the First n Terms of an AP
1. When first term \`a\` and common difference \`d\` are known:
   \`Sₙ = (n / 2)[2a + (n - 1)d]\`

2. When first term \`a\` and last term \`l = aₙ\` are known:
   \`Sₙ = (n / 2)[a + l]\`

3. **Sum of the First n Positive Integers (Natural Numbers):**
   \`Sum = n(n + 1) / 2\`
   *Example:* Sum of first 100 natural numbers = \`100 × 101 / 2 = 5050\`.`,
    tags: ['Mathematics', 'Sequences', 'Arithmetic Progression', 'AP', 'Formulas', 'NCERT 2026'],
    isPinned: true,
    createdAt: '2026-10-04T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },
];
