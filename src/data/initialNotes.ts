import { StudyNote } from '../types';

export const INITIAL_NOTES: StudyNote[] = [
  {
    id: 'note-ncert-2026-phy-1',
    title: 'Kinematics & Motion Equations Master Summary',
    subjectId: 'physics',
    chapterId: 'phy-ch1',
    content: `## NCERT 2026 Physics: Describing Motion Around Us

### 1. Fundamental Kinematics Formulas:
- **Average Speed & Velocity:**
  \`v_avg = Total Distance / Total Time\`
  \`v_avg = (u + v) / 2\` (when acceleration is uniform)

- **Acceleration:**
  \`a = (v - u) / t\`
  * SI Unit: m/s²
  * Negative acceleration is deceleration or retardation.

### 2. The Three Equations of Motion:
1. \`v = u + at\` (Velocity - Time relation)
2. \`s = ut + (1/2)at²\` (Position - Time relation)
3. \`v² - u² = 2as\` (Position - Velocity relation)

### 3. Uniform Circular Motion:
- Linear speed: \`v = (2πr) / T\`
- Direction changes continuously at every point, so circular motion is always accelerated even with constant speed!

### 4. Graph Reading Key Points:
- Slope of Distance-Time (s-t) graph = Speed
- Slope of Velocity-Time (v-t) graph = Acceleration (\`a = Δv / Δt\`)
- Area under Velocity-Time (v-t) graph = Displacement (\`s\`)`,
    tags: ['Kinematics', 'Equations of Motion', 'Formulas', 'NCERT 2026'],
    isPinned: true,
    createdAt: '2026-10-04T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },
  {
    id: 'note-ncert-2026-phy-2',
    title: "Forces, Momentum & Newton's 3 Laws",
    subjectId: 'physics',
    chapterId: 'phy-ch2',
    content: `## NCERT 2026 Physics: How Forces Affect Motion

### 1. Newton's First Law (Law of Inertia):
- An object remains in its state of rest or uniform straight-line motion unless compelled by an external unbalanced force.
- **Mass is the quantitative measure of inertia.** Heavier bodies possess greater inertia.

### 2. Linear Momentum:
- \`p = m × v\`
- SI unit: kg·m/s
- Vector quantity having the direction of velocity.

### 3. Newton's Second Law:
- Rate of change of momentum is directly proportional to applied force.
- **Formula:**
  \`F = m × a = (p₂ - p₁) / t\`
- SI unit: Newton (\`1 N = 1 kg·m/s²\`).

### 4. Newton's Third Law:
- To every action, there is an equal and opposite reaction.
- **Crucial Rule:** Action and reaction forces act simultaneously on **two different interacting bodies**, which is why they do not cancel each other!`,
    tags: ['Forces', 'Newton Laws', 'Momentum', 'NCERT 2026'],
    isPinned: false,
    createdAt: '2026-10-04T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },
  {
    id: 'note-ncert-2026-phy-3',
    title: 'Work, Energy & Simple Machines Mechanics',
    subjectId: 'physics',
    chapterId: 'phy-ch3',
    content: `## NCERT 2026 Physics: Work, Energy, and Simple Machines

### 1. Scientific Concept of Work:
- Work is done only when force causes displacement in the direction of force.
- **Formula:**
  \`W = F × s\`
- SI unit: Joule (\`1 J = 1 N × 1 m\`).
- Conditions:
  * Positive work: force and displacement in same direction.
  * Negative work: opposing force (e.g. friction).
  * Zero work: displacement perpendicular to force or displacement = 0.

### 2. Kinetic & Potential Energy:
- **Kinetic Energy:** \`Ek = (1/2)mv²\`
- **Gravitational Potential Energy:** \`Ep = m × g × h\` (take g ≈ 9.8 m/s²)
- **Law of Conservation of Energy:**
  Total mechanical energy in free fall: \`Ek + Ep = Constant\`

### 3. Power & Simple Machines:
- **Power:** \`P = W / t\` (SI unit: Watt, \`1 W = 1 J/s\`)
- **Mechanical Advantage:** \`MA = Load / Effort\`
- Simple machines (levers, pulleys, inclined planes) multiply effort force to overcome heavier loads.`,
    tags: ['Work', 'Energy', 'Power', 'Simple Machines', 'NCERT 2026'],
    isPinned: false,
    createdAt: '2026-10-04T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },
  {
    id: 'note-ncert-2026-chem-1',
    title: 'Mixtures, Solutions & Concentration Formulas',
    subjectId: 'chemistry',
    chapterId: 'chem-ch1',
    content: `## NCERT 2026 Chemistry: Exploring Mixtures and Their Separation

### 1. Classification of Matter:
- **Pure Substances:** Elements (metals, non-metals, metalloids) and Compounds (fixed chemical composition).
- **Mixtures:** Homogeneous (uniform composition, e.g. true solution) vs Heterogeneous (non-uniform, e.g. suspension, colloid).

### 2. Solution Concentration Formulas:
- **Mass Percentage:**
  \`Mass % = (Mass of Solute / Mass of Solution) × 100\`
  *Remember: Mass of Solution = Mass of Solute + Mass of Solvent!*
- **Volume Percentage:**
  \`Volume % = (Volume of Solute / Volume of Solution) × 100\`

### 3. Particle Sizes & Tyndall Effect:
- **True Solution:** Particle diameter < 1 nm. Stable, transparent, no Tyndall effect.
- **Colloid:** Particle diameter 1 nm to 1000 nm. Displays **Tyndall Effect** (scatters light beam).
- **Suspension:** Particle diameter > 1000 nm. Heterogeneous, unstable, particles settle over time.`,
    tags: ['Chemistry', 'Solutions', 'Concentration', 'Tyndall Effect', 'NCERT 2026'],
    isPinned: true,
    createdAt: '2026-10-04T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },
  {
    id: 'note-ncert-2026-chem-2',
    title: 'Atomic Structure, Bohr Model & Valency Rules',
    subjectId: 'chemistry',
    chapterId: 'chem-ch2',
    content: `## NCERT 2026 Chemistry: Journey Inside the Atom & Atomic Foundations

### 1. Subatomic Particles:
- Electron: discovered by J.J. Thomson (charge -1, mass negligible)
- Proton: discovered by E. Goldstein (charge +1, mass 1 u)
- Neutron: discovered by J. Chadwick (charge 0, mass 1 u)

### 2. Bohr's Shell Distribution Rules (Bohr-Bury):
- **Max capacity in shell n:**
  \`Max Electrons = 2n²\`
  * K shell (n = 1): \`2 × 1² = 2\`
  * L shell (n = 2): \`2 × 2² = 8\`
  * M shell (n = 3): \`2 × 3² = 18\`
  * N shell (n = 4): \`2 × 4² = 32\`
- Maximum outermost capacity: **8 electrons (Octet Rule)**.

### 3. Mass Number & Atomic Number:
- Atomic Number (\`Z\`): number of protons in nucleus.
- Mass Number (\`A\`): protons + neutrons (\`A = Z + N\`).
- **Isotopes:** Same atomic number Z, different mass numbers A (e.g. ³⁵Cl₁₇ and ³⁷Cl₁₇).
- **Isobars:** Different atomic numbers Z, same mass number A (e.g. ⁴⁰Ar₁₈ and ⁴⁰Ca₂₀).`,
    tags: ['Atoms', 'Bohr Model', 'Isotopes', 'Isobars', 'NCERT 2026'],
    isPinned: false,
    createdAt: '2026-10-04T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },
  {
    id: 'note-ncert-2026-math-1',
    title: 'Coordinate Geometry Core Formulas & Quadrants',
    subjectId: 'mathematics',
    chapterId: 'math-ch1',
    content: `## NCERT 2026 Mathematics: Orienting Yourself: The Use of Coordinates

### 1. Distance Formula:
Between any two points P(x₁, y₁) and Q(x₂, y₂):
\`d = √[(x₂ - x₁)² + (y₂ - y₁)²]\`

- **Distance of point P(x, y) from origin (0, 0):**
  \`OP = √(x² + y²)\`

### 2. Midpoint Formula:
Coordinates of the midpoint M dividing segment PQ equally:
\`M = ((x₁ + x₂) / 2, (y₁ + y₂) / 2)\`

### 3. Cartesian Coordinates & Quadrant Signs:
- Abscissa = x-coordinate
- Ordinate = y-coordinate
- **Quadrants:**
  * Quadrant I: (+, +)
  * Quadrant II: (-, +)
  * Quadrant III: (-, -)
  * Quadrant IV: (+, -)
- Any point on the x-axis has ordinate \`y = 0\` => (x, 0)
- Any point on the y-axis has abscissa \`x = 0\` => (0, y)`,
    tags: ['Coordinate Geometry', 'Distance Formula', 'Midpoint', 'NCERT 2026'],
    isPinned: true,
    createdAt: '2026-10-04T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },
  {
    id: 'note-ncert-2026-math-2',
    title: 'Algebraic Identities & Factoring Master Guide',
    subjectId: 'mathematics',
    chapterId: 'math-ch4',
    content: `## NCERT 2026 Mathematics: Exploring Algebraic Identities

### 1. Quadratic Expansions:
- \`(x + y)² = x² + 2xy + y²\`
- \`(x - y)² = x² - 2xy + y²\`
- \`x² - y² = (x - y)(x + y)\`
- \`(x + a)(x + b) = x² + (a + b)x + ab\`

### 2. Trinomial Square Identity:
\`(x + y + z)² = x² + y² + z² + 2(xy + yz + zx)\`

### 3. Cubic Identities:
- \`(x + y)³ = x³ + y³ + 3xy(x + y)\`
- \`(x - y)³ = x³ - y³ - 3xy(x - y)\`
- \`x³ + y³ = (x + y)(x² - xy + y²)\`
- \`x³ - y³ = (x - y)(x² + xy + y²)\`

### 4. High-Yield Conditional Exam Identity:
- General Identity:
  \`x³ + y³ + z³ - 3xyz = (x + y + z)(x² + y² + z² - xy - yz - zx)\`
- **Crucial Exam Shortcut:**
  \`If x + y + z = 0  =>  x³ + y³ + z³ = 3xyz\``,
    tags: ['Algebra', 'Identities', 'Polynomials', 'NCERT 2026'],
    isPinned: false,
    createdAt: '2026-10-04T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },
  {
    id: 'note-ncert-2026-math-3',
    title: 'Probability & Sequences (AP) Formulas',
    subjectId: 'mathematics',
    chapterId: 'math-ch8',
    content: `## NCERT 2026 Mathematics: Probability & Arithmetic Progressions

### 1. Probability (The Mathematics of Maybe):
- **Theoretical Probability:**
  \`P(E) = (Number of favourable outcomes) / (Total number of possible outcomes)\`
- **Essential Rules:**
  * \`0 ≤ P(E) ≤ 1\`
  * Impossible event: \`P(E) = 0\`
  * Sure/Certain event: \`P(E) = 1\`
  * Complementary event: \`P(not E) = 1 - P(E)\`

### 2. Sequences & Progression (Predicting What Comes Next):
- **General nth Term of an AP:**
  \`aₙ = a + (n - 1)d\`
  * \`a\` = first term
  * \`d\` = common difference (\`a₂ - a₁\`)
  * \`n\` = position of the term

- **Sum of First n Terms of an AP:**
  \`Sₙ = (n / 2)[2a + (n - 1)d]\`
  \`Sₙ = (n / 2)[a + l]\` (where l is the last term \`aₙ\`)

- **Sum of First n Natural Numbers:**
  \`Sum = n(n + 1) / 2\``,
    tags: ['Probability', 'Sequences', 'AP', 'Formulas', 'NCERT 2026'],
    isPinned: true,
    createdAt: '2026-10-04T00:00:00.000Z',
    updatedAt: '2026-10-04T00:00:00.000Z',
  },
];
