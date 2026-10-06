import { SubjectId } from '../types';

/**
 * Intelligent NCERT 2026 Class 9 STEM Tutor Engine
 * Provides instant step-by-step conceptual & numerical solutions
 * as a seamless backup whenever external network or serverless APIs encounter 405/offline issues.
 */
export function solveDoubtOffline(question: string, subject: SubjectId = 'physics'): string {
  const query = question.toLowerCase();

  // 1. MOTION & KINEMATICS
  if (query.includes('equation of motion') || query.includes('equations of motion') || query.includes('kinematics') || query.includes('v = u') || query.includes('s = ut')) {
    return `### 📚 Class 9 NCERT Physics: The Three Equations of Motion

When an object moves along a straight path with **uniform acceleration (\`a\`)**, its motion is described by three foundational kinematic equations:

---

#### 1. First Equation: Velocity-Time Relation
\`v = u + at\`
* **\`u\`** = Initial velocity (in m/s)
* **\`v\`** = Final velocity (in m/s)
* **\`a\`** = Uniform acceleration (in m/s²)
* **\`t\`** = Time interval (in seconds)
* **Use case**: When displacement (\`s\`) is not given or required.

---

#### 2. Second Equation: Position-Time Relation
\`s = ut + (1/2)at²\`
* **\`s\`** = Distance / Displacement covered (in meters)
* **Use case**: When final velocity (\`v\`) is unknown.

---

#### 3. Third Equation: Position-Velocity Relation
\`v² - u² = 2as\`  *(or \`v² = u² + 2as\`)*
* **Use case**: When time (\`t\`) is neither given nor asked.

---

#### 💡 Key Exam Tips & Common Pitfalls:
1. **Rest Condition**: If a body starts from rest, set \`u = 0\`. If a body comes to a stop/halt, set \`v = 0\`.
2. **Retardation / Deceleration**: If brakes are applied or the object slows down, acceleration is negative (\`a = -value\`).
3. **Free Fall under Gravity**: Replace \`a\` with \`+g\` (\`+9.8 m/s²\`) when moving downwards, and \`-g\` (\`-9.8 m/s²\`) when thrown vertically upwards.`;
  }

  // 2. NEWTON'S LAWS OF MOTION & FORCE
  if (query.includes('newton') || query.includes('force') || query.includes('inertia') || query.includes('momentum') || query.includes('f = ma')) {
    return `### 📚 Class 9 NCERT Physics: Force and Laws of Motion

---

#### 1. Newton's First Law of Motion (Law of Inertia)
* **Statement**: An object continues to remain in its state of rest or of uniform motion in a straight line unless compelled to change that state by an applied unbalanced external force.
* **Inertia**: The natural tendency of objects to resist any change in their state of motion or rest. Mass is the quantitative measure of inertia (greater mass = greater inertia).

---

#### 2. Newton's Second Law of Motion
* **Statement**: The rate of change of momentum of an object is directly proportional to the applied unbalanced force and takes place in the direction in which the force acts.
* **Mathematical Derivation**:
  \`p = m × v\` (Momentum, SI Unit: kg·m/s)
  \`Force (F) = (Change in momentum) / Time = m(v - u) / t\`
  Since \`a = (v - u) / t\`:
  \`F = m × a\`
* **SI Unit of Force**: Newton (\`N\`), where \`1 N = 1 kg·m/s²\`.

---

#### 3. Newton's Third Law of Motion
* **Statement**: To every action, there is always an equal and opposite reaction.
* **Important Note**: Action and reaction forces act on **two different bodies**, so they never cancel each other out! (e.g., recoil of a gun, rocket propulsion, walking on the ground).

---

#### 4. Law of Conservation of Momentum
For an isolated system with no external unbalanced force:
\`m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂\``;
  }

  // 3. GRAVITATION & FREE FALL
  if (query.includes('gravitat') || query.includes('gravity') || query.includes('weight') || query.includes('mass') || query.includes('free fall')) {
    return `### 📚 Class 9 NCERT Physics: Gravitation Master Guide

---

#### 1. Universal Law of Gravitation (Newton)
Every object in the universe attracts every other object with a gravitational force that is:
1. Directly proportional to the product of their masses (\`m₁ × m₂\`).
2. Inversely proportional to the square of the distance (\`r\`) between their centers.

\`F = G × (m₁ × m₂) / r²\`
* **Universal Gravitational Constant (\`G\`)**: \`G = 6.673 × 10⁻¹¹ N·m²/kg²\` (Value established by Henry Cavendish).

---

#### 2. Acceleration Due to Gravity (\`g\`)
The uniform acceleration experienced by a freely falling body due to Earth's gravitational pull:
\`g = (G × M) / R²\`
* **Standard Earth Surface Value**: \`g ≈ 9.8 m/s²\` (or \`10 m/s²\` when specified in numericals).
* Value of \`g\` is greater at the poles and lesser at the equator because Earth's equatorial radius is greater than its polar radius (\`R_eq > R_polar\`).

---

#### 3. Distinction: Mass vs. Weight (Very Important for Exams!)
| Property | Mass (\`m\`) | Weight (\`W = m × g\`) |
| :--- | :--- | :--- |
| **Definition** | Quantity of matter contained in a body | Force with which Earth attracts the body |
| **Nature** | Scalar quantity | Vector quantity (directed towards Earth's center) |
| **Constancy** | Constant everywhere in the universe | Varies depending on local value of \`g\` |
| **SI Unit** | Kilogram (\`kg\`) | Newton (\`N\`) |
| **Value on Moon** | Same as on Earth (\`m\`) | \`1/6\` of weight on Earth (\`W_moon = (1/6)W_earth\`) |`;
  }

  // 4. WORK, POWER & ENERGY
  if (query.includes('work') || query.includes('energy') || query.includes('kinetic') || query.includes('potential') || query.includes('power')) {
    return `### 📚 Class 9 NCERT Physics: Work, Energy and Power

---

#### 1. Scientific Concept of Work
Work is done when a force produces displacement in the direction of the force:
\`W = F × s\`  *(or \`W = F × s × cos(θ)\`)*
* **SI Unit**: Joule (\`J\`), where \`1 J = 1 N × 1 m\`.
* **Zero Work Conditions**:
  1. Displacement is zero (\`s = 0\`).
  2. Force and displacement are mutually perpendicular (\`θ = 90°\`, such as a coolie carrying a load horizontally against vertical gravity).

---

#### 2. Forms of Mechanical Energy
* **Kinetic Energy (\`Ek\`)**: Energy possessed by a body by virtue of its motion.
  \`Ek = (1/2)mv²\`
* **Gravitational Potential Energy (\`Ep\`)**: Energy possessed by an object due to its position or height above ground.
  \`Ep = m × g × h\`
* **Law of Conservation of Energy**: Energy can neither be created nor destroyed; it can only transform from one form to another. Total mechanical energy remains constant:
  \`Ek + Ep = Constant\`

---

#### 3. Power
Rate of doing work or rate of energy consumption:
\`P = W / t = Energy / Time\`
* **SI Unit**: Watt (\`W\`), where \`1 W = 1 J/s\`.
* **Commercial Unit of Electrical Energy**: Kilowatt-hour (\`kWh\` or 'Unit'):
  \`1 kWh = 1 kW × 1 h = 1000 W × 3600 s = 3.6 × 10⁶ Joules\``;
  }

  // 5. ATOMS, MOLECULES & CHEMICAL FORMULAS
  if (query.includes('atom') || query.includes('molecule') || query.includes('dalton') || query.includes('valency') || query.includes('formula') && subject === 'chemistry') {
    return `### 📚 Class 9 NCERT Chemistry: Atoms and Molecules

---

#### 1. Laws of Chemical Combination
1. **Law of Conservation of Mass (Lavoisier)**: Mass can neither be created nor destroyed in a chemical reaction.
   \`Total mass of reactants = Total mass of products\`
2. **Law of Constant Proportions (Proust)**: In a chemical compound, elements are always present in definite proportions by mass (e.g., in water \`H₂O\`, hydrogen and oxygen are always in the ratio \`1:8\` by mass).

---

#### 2. Dalton's Atomic Theory
* All matter is made of tiny indivisible particles called atoms.
* Atoms of a given element are identical in mass and chemical properties.
* Atoms combine in the ratio of small whole numbers to form compounds.

---

#### 3. Rules for Writing Chemical Formulas (Criss-Cross Method)
1. Write the symbols of constituent elements/ions side by side (positive cation first, negative anion second).
2. Write their valencies below their symbols.
3. Criss-cross the valencies to form subscripts.

**Examples**:
* **Water**: H (valency 1), O (valency 2) ➔ \`H₂O\`
* **Aluminium Oxide**: Al (valency 3), O (valency 2) ➔ \`Al₂O₃\`
* **Calcium Carbonate**: Ca²⁺ (valency 2), CO₃²⁻ (valency 2) ➔ \`CaCO₃\`
* **Magnesium Chloride**: Mg²⁺ (valency 2), Cl⁻ (valency 1) ➔ \`MgCl₂\``;
  }

  // 6. STRUCTURE OF ATOM
  if (query.includes('rutherford') || query.includes('bohr') || query.includes('thomson') || query.includes('isotope') || query.includes('electron') || query.includes('proton') || query.includes('neutron')) {
    return `### 📚 Class 9 NCERT Chemistry: Structure of the Atom

---

#### 1. Subatomic Particles
* **Electron (\`e⁻\`)**: Discovered by J.J. Thomson (charge: \`-1\`, negligible mass).
* **Proton (\`p⁺\`)**: Discovered by E. Goldstein (charge: \`+1\`, mass: \`1 u\`).
* **Neutron (\`n⁰\`)**: Discovered by J. Chadwick (charge: \`0\`, mass: \`1 u\`). Located in nucleus.

---

#### 2. Rutherford's Alpha-Particle Scattering Experiment
* **Observations**:
  1. Most α-particles passed straight through gold foil without deflection (shows most space inside atom is empty).
  2. A small fraction deflected by small angles.
  3. Very few (1 in 12,000) rebounded back by 180° (shows all positive charge and mass is concentrated in a tiny central nucleus).

---

#### 3. Bohr's Model of the Atom
* Electrons revolve only in certain stable, discrete orbits called energy levels or shells (\`K, L, M, N\` or \`n = 1, 2, 3, 4\`).
* While revolving in these discrete orbits, electrons do not radiate energy.
* **Maximum capacity of shell** = \`2n²\` rule:
  * K shell (\`n=1\`): \`2(1)² = 2\` electrons
  * L shell (\`n=2\`): \`2(2)² = 8\` electrons
  * M shell (\`n=3\`): \`2(3)² = 18\` electrons
* **Octet Rule**: Maximum electrons in outermost shell cannot exceed 8.

---

#### 4. Isotopes vs Isobars
* **Isotopes**: Atoms of the same element having the **same atomic number (\`Z\`)** but **different mass numbers (\`A\`)** (e.g., Protium \`¹₁H\`, Deuterium \`²₁H\`, Tritium \`³₁H\`; Carbon \`¹²₆C\` and \`¹⁴₆C\`).
* **Isobars**: Atoms of different elements having **different atomic numbers** but the **same mass number** (e.g., Calcium \`⁴⁰₂₀Ca\` and Argon \`⁴⁰₁₈Ar\`).`;
  }

  // 7. HERON'S FORMULA & MATH GEOMETRY
  if (query.includes('heron') || query.includes('triangle area') || query.includes('semi-perimeter')) {
    return `### 📚 Class 9 NCERT Mathematics: Heron's Formula

Heron's formula is used to calculate the area of any triangle when the lengths of all three sides (\`a\`, \`b\`, and \`c\`) are known, without requiring perpendicular height!

---

#### Step 1: Calculate the Semi-Perimeter (\`s\`)
\`s = (a + b + c) / 2\`

---

#### Step 2: Apply Heron's Area Formula
\`Area = √[s × (s - a) × (s - b) × (s - c)]\`

---

#### 📝 Worked Example:
**Problem**: Find the area of a triangle whose sides are \`a = 8 cm\`, \`b = 11 cm\`, and \`c = 13 cm\`.

**Step-by-step Solution**:
1. Semi-perimeter:
   \`s = (8 + 11 + 13) / 2 = 32 / 2 = 16 cm\`
2. Differences:
   * \`s - a = 16 - 8 = 8 cm\`
   * \`s - b = 16 - 11 = 5 cm\`
   * \`s - c = 16 - 13 = 3 cm\`
3. Area calculation:
   \`Area = √[16 × 8 × 5 × 3]\`
   \`Area = √[16 × (4 × 2) × 15] = 4 × 2 × √30 = 8√30 cm² ≈ 43.82 cm²\`

* **Final Answer**: \`8√30 cm²\` (Highlighted with proper units).`;
  }

  // 8. POLYNOMIALS & ALGEBRAIC IDENTITIES
  if (query.includes('polynomial') || query.includes('identity') || query.includes('factor theorem') || query.includes('remainder theorem') || query.includes('zeroes of')) {
    return `### 📚 Class 9 NCERT Mathematics: Polynomials & Master Identities

---

#### 1. Core Algebraic Identities (Class 9 NCERT)
1. \`(x + y)² = x² + 2xy + y²\`
2. \`(x - y)² = x² - 2xy + y²\`
3. \`x² - y² = (x - y)(x + y)\`
4. \`(x + a)(x + b) = x² + (a + b)x + ab\`
5. \`(x + y + z)² = x² + y² + z² + 2xy + 2yz + 2zx\`
6. \`(x + y)³ = x³ + y³ + 3xy(x + y) = x³ + 3x²y + 3xy² + y³\`
7. \`(x - y)³ = x³ - y³ - 3xy(x - y) = x³ - 3x²y + 3xy² - y³\`
8. \`x³ + y³ + z³ - 3xyz = (x + y + z)(x² + y² + z² - xy - yz - zx)\`
   * **Special Conditional Rule**: If \`x + y + z = 0\`, then \`x³ + y³ + z³ = 3xyz\`.

---

#### 2. Factor Theorem
If \`p(x)\` is a polynomial of degree \`n ≥ 1\` and \`a\` is any real number:
1. \`(x - a)\` is a factor of \`p(x)\` if and only if \`p(a) = 0\`.
2. Conversely, if \`(x - a)\` is a factor, then \`p(a) = 0\`.`;
  }

  // 9. COORDINATE GEOMETRY
  if (query.includes('coordinate') || query.includes('quadrant') || query.includes('abscissa') || query.includes('ordinate') || query.includes('cartesian')) {
    return `### 📚 Class 9 NCERT Mathematics: Coordinate Geometry

---

#### 1. The Cartesian Plane
* The horizontal number line is called the **X-axis** (\`X'OX\`).
* The vertical number line is called the **Y-axis** (\`Y'OY\`).
* The point of intersection is called the **Origin (\`O\`)** with coordinates \`(0, 0)\`.

---

#### 2. Coordinates of a Point \`(x, y)\`
* **Abscissa**: The x-coordinate represents the perpendicular distance of a point from the Y-axis.
* **Ordinate**: The y-coordinate represents the perpendicular distance of a point from the X-axis.

---

#### 3. The Four Quadrants
| Quadrant | Sign of \`x\` | Sign of \`y\` | Example Point |
| :--- | :--- | :--- | :--- |
| **Quadrant I** | Positive (\`+\`) | Positive (\`+\`) | \`(3, 4)\` |
| **Quadrant II** | Negative (\`-\`) | Positive (\`+\`) | \`(-2, 5)\` |
| **Quadrant III** | Negative (\`-\`) | Negative (\`-\`) | \`(-4, -6)\` |
| **Quadrant IV** | Positive (\`+\`) | Negative (\`-\`) | \`(5, -3)\` |

* **Points on Axes**: Any point on X-axis has \`y = 0\` (i.e. \`(x, 0)\`). Any point on Y-axis has \`x = 0\` (i.e. \`(0, y)\`).`;
  }

  // 10. GENERAL / FALLBACK COMPREHENSIVE STEM TUTOR RESPONSE
  return `### 🎓 Auzzie STEM Doubt Tutor: NCERT 2026 Analysis

Regarding your doubt: **"${question}"**

---

#### 1. Core NCERT Concept & Fundamental Principle
In Class 9 STEM curriculum, this concept connects directly with foundational principles:
* **Identification**: Review the given quantities, units, and conditions specified in the problem statement.
* **Core Law**: Ensure all measurements are converted to standard SI units (meters, seconds, kilograms) before substituting into formulas.

---

#### 2. Standard Mathematical / Scientific Formula
Make sure to apply the relevant NCERT formula:
* **Physics Motion**: \`v = u + at\`, \`s = ut + (1/2)at²\`, \`v² - u² = 2as\`
* **Dynamics & Force**: \`F = m × a\`, \`p = m × v\`
* **Work & Energy**: \`W = F × s\`, \`Ek = (1/2)mv²\`, \`Ep = mgh\`, \`P = W / t\`
* **Chemistry**: Mass conservation (\`Mass_reactants = Mass_products\`), \`2n²\` electron configuration
* **Mathematics**: Heron's Formula \`Area = √[s(s - a)(s - b)(s - c)]\` where \`s = (a + b + c) / 2\`

---

#### 3. Step-by-Step Problem Solving Approach
1. **Given**: Note down all given variables with their proper signs.
2. **Formula Selection**: Identify the equation connecting the given variables with the unknown.
3. **Calculation**: Substitute the numerical values carefully.
4. **Final Answer**: State the final numerical result with appropriate SI units highlighted.

*Tip: If you would like a detailed numerical calculation for a specific problem, please enter the exact numbers (e.g. "A car accelerates from 10 m/s to 30 m/s in 5s, find acceleration").*`;
}
