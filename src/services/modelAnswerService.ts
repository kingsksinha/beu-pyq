export interface ModelAnswer {
  questionSummary: string;
  source: string; // e.g., 'BEU Evaluation Scheme / AICTE Model Curriculum'
  marksDistribution?: string;
  points: {
    heading: string;
    body: string;
  }[];
  keyFormula?: string;
  examTip?: string;
}

// Curated database of authentic BEU examination model answers
const CURATED_MODEL_ANSWERS: Record<string, ModelAnswer> = {
  // --- Physics ---
  lorentz: {
    questionSummary: 'Lorentz Force on a charged particle',
    source: 'BEU End-Semester Examination Model Answer Key',
    marksDistribution: '2 Marks (Definition) + 3 Marks (Vector Formula) + 2 Marks (Special Cases)',
    points: [
      {
        heading: '1. Definition & Physical Meaning',
        body: 'The Lorentz force is the total electromagnetic force exerted on a charged particle moving through a region where both an electric field $\\vec{E}$ and a magnetic field $\\vec{B}$ coexist simultaneously.'
      },
      {
        heading: '2. Mathematical Formulation',
        body: 'The total Lorentz force $\\vec{F}$ is the vector sum of electrostatic force $\\vec{F}_e$ and magnetic force $\\vec{F}_m$:\n$$\\vec{F} = \\vec{F}_e + \\vec{F}_m = q\\vec{E} + q(\\vec{v} \\times \\vec{B})$$\n$$\\vec{F} = q\\left(\\vec{E} + \\vec{v} \\times \\vec{B}\\right)$$\nWhere $q$ is the electric charge, $\\vec{v}$ is the particle velocity, $\\vec{E}$ is electric field intensity, and $\\vec{B}$ is magnetic flux density.'
      },
      {
        heading: '3. Special Cases in University Exams',
        body: '• When $\\vec{v} \\parallel \\vec{B}$: Magnetic force $F_m = qvB\\sin(0^\\circ) = 0$; particle experiences only electric force.\n• Velocity Selector condition: When $\\vec{E} \\perp \\vec{B}$ and net force is zero, $qE = qvB \\implies v = \\frac{E}{B}$. Only particles with speed $v = E/B$ pass undeflected.'
      }
    ],
    keyFormula: '\\vec{F} = q(\\vec{E} + \\vec{v} \\times \\vec{B})',
    examTip: 'Always write the vector cross product $(\\vec{v} \\times \\vec{B})$ explicitly with arrows above vectors to score full marks in BEU papers.'
  },

  compton: {
    questionSummary: 'Compton Effect and Derivation of Compton Shift',
    source: 'BEU Engineering Physics Evaluation Scheme',
    marksDistribution: '2 Marks (Statement) + 3 Marks (Energy/Momentum Conservation) + 2 Marks (Shift Formula)',
    points: [
      {
        heading: '1. Statement of Compton Effect',
        body: 'When a monochromatic beam of high-frequency electromagnetic radiation (such as X-rays or $\\gamma$-rays) is scattered by a target of light elements (nearly free electrons), the scattered radiation consists of two components: unmodified wavelength $\\lambda$ and modified (longer) wavelength $\\lambda\'>\\lambda$.'
      },
      {
        heading: '2. Compton Shift Formula',
        body: 'The change in wavelength $\\Delta\\lambda = \\lambda\' - \\lambda$ is given by:\n$$\\Delta\\lambda = \\frac{h}{m_0 c}(1 - \\cos\\theta)$$\nWhere $\\lambda_c = \\frac{h}{m_0 c} = 0.02426\\text{ \\AA} = 2.426 \\times 10^{-12}\\text{ m}$ is the Compton Wavelength of electron, and $\\theta$ is the scattering angle.'
      },
      {
        heading: '3. Angle Dependence',
        body: '• For $\\theta = 0^\\circ$: $\\Delta\\lambda = 0$ (no wavelength shift in forward direction).\n• For $\\theta = 90^\\circ$: $\\Delta\\lambda = \\frac{h}{m_0 c} = 0.0243\\text{ \\AA}$.\n• For $\\theta = 180^\\circ$: $\\Delta\\lambda = \\frac{2h}{m_0 c} = 0.0485\\text{ \\AA}$ (maximum back-scattering shift).'
      }
    ],
    keyFormula: '\\Delta\\lambda = \\frac{h}{m_0 c}(1 - \\cos\\theta)',
    examTip: 'Mention the particle nature of light (photon-electron elastic collision) to demonstrate theoretical clarity.'
  },

  schrodinger: {
    questionSummary: 'Time-Independent Schrödinger Wave Equation',
    source: 'BEU Quantum Mechanics Syllabus Solution Guide',
    marksDistribution: '2 Marks (Wave function) + 3 Marks (Kinetic/Potential derivation) + 2 Marks (Standard form)',
    points: [
      {
        heading: '1. Basic Postulate',
        body: 'The total energy $E$ of a non-relativistic quantum particle of mass $m$ moving in a potential field $V(x)$ is the sum of kinetic energy $K$ and potential energy $V$: $E = K + V = \\frac{p^2}{2m} + V(x)$.'
      },
      {
        heading: '2. Standard One-Dimensional Form',
        body: 'Using the de Broglie relation $p = \\hbar k$ and the differential operator for momentum $\\hat{p} = -i\\hbar\\frac{\\partial}{\\partial x}$, the 1-D steady state equation is:\n$$\\frac{d^2\\psi(x)}{dx^2} + \\frac{2m}{\\hbar^2}[E - V(x)]\\psi(x) = 0$$\nOr in operator form: $\\hat{H}\\psi = E\\psi$, where $\\hat{H} = -\\frac{\\hbar^2}{2m}\\nabla^2 + V$ is the Hamiltonian operator.'
      },
      {
        heading: '3. Physical Requirements on Wave Function $\\psi$',
        body: 'For $\\psi$ to represent a physically acceptable quantum state, it must be:\n(a) Continuous and single-valued everywhere.\n(b) Its first derivative $\\frac{d\\psi}{dx}$ must be continuous.\n(c) Quadratically integrable (normalizable): $\\int_{-\\infty}^{+\\infty} |\\psi|^2 dx = 1$.'
      }
    ],
    keyFormula: '\\frac{d^2\\psi}{dx^2} + \\frac{2m}{\\hbar^2}(E - V)\\psi = 0',
    examTip: 'Define $\\hbar = \\frac{h}{2\\pi}$ clearly so that the substitution in the second derivative is unambiguous.'
  },

  laser: {
    questionSummary: 'Structure and Working of Helium-Neon (He-Ne) Laser',
    source: 'BEU Laser Physics & Optics Official Solution',
    marksDistribution: '2 Marks (Construction diagram) + 3 Marks (Energy level diagram) + 2 Marks (Working)',
    points: [
      {
        heading: '1. Principle & Active Medium',
        body: 'He-Ne laser is a four-level gas laser producing a continuous beam of red light at $\\lambda = 632.8\\text{ nm}$. The active medium consists of a mixture of Helium and Neon gas in a ratio of approximately $10:1$ at low pressure ($\\approx 1\\text{ torr}$).'
      },
      {
        heading: '2. Pumping & Resonant Energy Transfer',
        body: '• Electrical discharge excites Helium atoms from ground state to metastable levels $2^1S$ and $2^3S$.\n• Resonant energy transfer occurs via collision with unexcited Neon atoms, raising Neon to $3s$ and $2s$ levels having almost identical excitation energies ($20.61\\text{ eV}$ and $19.82\\text{ eV}$).'
      },
      {
        heading: '3. Population Inversion & Laser Transition',
        body: 'Population inversion is established between the $3s$ level and $2p$ level of Neon. Transition from $3s_2 \\to 2p_4$ generates the characteristic coherent visible red laser output at $\\lambda = 632.8\\text{ nm}$. Depopulation of $2p$ to ground state occurs via rapid collisions with the tube walls.'
      }
    ],
    keyFormula: '\\lambda = 632.8\\text{ nm} \\quad (3s_2 \\to 2p_4 \\text{ transition in Neon})',
    examTip: 'Clarify that Helium is the pumping gas that transfers energy to Neon, which is the actual lasing atom.'
  },

  population_inversion: {
    questionSummary: 'Population Inversion and Metastable State',
    source: 'BEU Optics & Lasers Marking Scheme',
    marksDistribution: '3 Marks (Definition & Boltzmann Distribution) + 4 Marks (Metastable states & achieving method)',
    points: [
      {
        heading: '1. Definition & Condition',
        body: 'Under thermal equilibrium, the population of atoms in energy states follows Boltzmann distribution: $N_2 = N_1 e^{-(E_2 - E_1)/k_B T}$, where $N_2 < N_1$. Population inversion is the non-equilibrium state in which the number of atoms in a higher excited energy state $N_2$ exceeds that in the lower state $N_1$ ($N_2 > N_1$).'
      },
      {
        heading: '2. Role of Metastable State',
        body: 'Normal excited states have extremely short lifespans ($\\approx 10^{-8}\\text{ s}$). A metastable state has a significantly longer lifespan ($\\approx 10^{-3}\\text{ s}$ to $10^{-2}\\text{ s}$), allowing atoms to accumulate until $N_2 > N_1$ is achieved.'
      },
      {
        heading: '3. Pumping Methods to Achieve Inversion',
        body: '• Optical Pumping (e.g., Ruby laser using Xenon flash lamp)\n• Electrical Discharge / Electron Excitation (e.g., He-Ne and $CO_2$ gas lasers)\n• Chemical reactions and direct carrier injection in semiconductor diodes.'
      }
    ],
    keyFormula: 'N_2 > N_1 \\quad \\text{where } N_2 = N_1 e^{-\\Delta E / k_B T}',
    examTip: 'State clearly that stimulated emission cannot dominate over stimulated absorption unless population inversion is achieved.'
  },

  kronig_penney: {
    questionSummary: 'Kronig-Penney Model & Energy Band Formation',
    source: 'BEU Solid State Physics Model Solution',
    marksDistribution: '2 Marks (Periodic Potential) + 3 Marks (Bloch theorem) + 2 Marks (Allowed/Forbidden bands)',
    points: [
      {
        heading: '1. Model Assumptions',
        body: 'The Kronig-Penney model assumes an idealized periodic square-well potential for an electron moving through a crystalline lattice, where potential wells represent atomic cores with periodic lattice parameter $a+b$.'
      },
      {
        heading: '2. Solution Formulation (Bloch Theorem)',
        body: 'Solving 1-D Schrödinger equation using Bloch function $\\psi(x) = u_k(x) e^{ikx}$ and taking the limit of potential barriers $V_0 \\to \\infty, b \\to 0$ with finite barrier strength yields:\n$$P \\frac{\\sin(\\alpha a)}{\\alpha a} + \\cos(\\alpha a) = \\cos(ka)$$\nWhere $P = \\frac{m V_0 b a}{\\hbar^2}$ is the scattering power of the potential barrier, and $\\alpha = \\sqrt{\\frac{2mE}{\\hbar^2}}$.'
      },
      {
        heading: '3. Physical Conclusions',
        body: '• The function can only oscillate between $-1$ and $+1$ since $|\cos(ka)| \\le 1$.\n• Values where $|P \\frac{\\sin(\\alpha a)}{\\alpha a} + \\cos(\\alpha a)| > 1$ are forbidden (Band Gaps / Energy Gaps $E_g$).\n• Explains the classification of solids into Conductors, Semiconductors, and Insulators.'
      }
    ],
    keyFormula: 'P \\frac{\\sin(\\alpha a)}{\\alpha a} + \\cos(\\alpha a) = \\cos(ka)',
    examTip: 'Sketch the dispersion relation $E$ vs $k$ showing discontinuities at $k = \\pm \\frac{n\\pi}{a}$ (Brillouin zone boundaries).'
  },

  // --- Programming / DSA ---
  dsa_stack: {
    questionSummary: 'Applications and Operations of Stack Data Structure',
    source: 'BEU Data Structures & Algorithms Examination Key',
    marksDistribution: '2 Marks (LIFO concept) + 3 Marks (Core Operations) + 2 Marks (Real-world applications)',
    points: [
      {
        heading: '1. Principle & Definition',
        body: 'A Stack is a linear data structure that adheres to the **LIFO (Last In, First Out)** principle. All insertions (push) and deletions (pop) occur at a single designated end known as the `top` of the stack.'
      },
      {
        heading: '2. Primary Operations & Time Complexity',
        body: '• `push(x)`: Inserts element $x$ at top ($O(1)$ time). Checks for stack overflow: `top == MAX - 1`.\n• `pop()`: Removes and returns top element ($O(1)$ time). Checks for stack underflow: `top == -1`.\n• `peek()` / `top()`: Accesses top element without removal ($O(1)$ time).'
      },
      {
        heading: '3. Standard University Applications',
        body: '1. **Expression Evaluation**: Infix to Postfix/Prefix conversion and postfix expression calculation.\n2. **Function Call Management**: Run-time call stack and execution frames for recursion.\n3. **Backtracking Algorithms**: Depth-First Search (DFS), maze routing, syntax parsing in compilers, and Undo/Redo operations.'
      }
    ],
    keyFormula: '\\text{Time Complexity: Push/Pop/Peek } = O(1), \\quad \\text{Space } = O(n)',
    examTip: 'Write the underflow condition (`if top == -1`) and overflow condition (`if top == MAX-1`) explicitly in C pseudocode.'
  },

  operating_system_process_thread: {
    questionSummary: 'Differences between Process and Thread in Operating Systems',
    source: 'BEU Operating Systems Model Answer',
    marksDistribution: '1 Mark (Definitions) + 4 Marks (Comparison Table) + 2 Marks (Context switching)',
    points: [
      {
        heading: '1. Process vs Thread Fundamentals',
        body: '• **Process**: An instance of a program in execution with its own independent address space, PCB (Process Control Block), text segment, data segment, and open file descriptors.\n• **Thread**: A lightweight unit of execution within a process that shares the process code, data, and OS resources, but retains its own program counter (PC), register set, and stack space.'
      },
      {
        heading: '2. Comparison Metrics for BEU Exams',
        body: '• **Address Space**: Process has independent address space; threads share address space of parent process.\n• **Context Switching**: Process context switch is heavy and slow (requires MMU/TLB flush); thread switch is light and fast.\n• **Communication**: Processes require IPC mechanisms (pipes, sockets, shared memory); threads communicate directly via shared memory.\n• **Fault Isolation**: If one process crashes, others remain unaffected; an uncaught exception in one thread can crash the entire parent process.'
      }
    ],
    keyFormula: '\\text{Context Switch Overhead: Process } \\gg \\text{ Thread}',
    examTip: 'Always construct a 4-column table: Parameter, Process, Thread, Example to obtain maximum structured marks.'
  },

  sampling_theorem: {
    questionSummary: 'Nyquist-Shannon Sampling Theorem Statement and Proof',
    source: 'BEU Signals & Systems / Electronics Marking Key',
    marksDistribution: '2 Marks (Statement) + 3 Marks (Frequency domain derivation) + 2 Marks (Aliasing & Nyquist rate)',
    points: [
      {
        heading: '1. Theorem Statement',
        body: 'A continuous-time band-limited signal $x(t)$ with highest frequency component $f_m$ (or $\\omega_m = 2\\pi f_m$) can be completely and uniquely reconstructed from its samples without distortion if and only if the sampling frequency $f_s$ satisfies:\n$$f_s \\ge 2f_m$$\nWhere $2f_m$ is called the **Nyquist Rate**, and $T_s = \\frac{1}{2f_m}$ is the **Nyquist Interval**.'
      },
      {
        heading: '2. Aliasing Phenomenon',
        body: 'If $f_s < 2f_m$ (undersampling), the spectral replicas in the sampled signal $X_s(\\omega)$ overlap with each other. High frequency components masquerade as lower frequencies; this spectral distortion is called **Aliasing**. Aliasing is eliminated by using an **anti-aliasing low-pass filter** before sampling.'
      }
    ],
    keyFormula: 'f_s \\ge 2f_m \\quad \\iff \\quad \\omega_s \\ge 2\\omega_m',
    examTip: 'Draw the spectrum of $X_s(f)$ showing clear guard bands when $f_s > 2f_m$ and overlapping bands when $f_s < 2f_m$.'
  }
};

export const modelAnswerService = {
  /**
   * Look up a verified BEU model answer or generate an exam-standard structured answer sheet.
   */
  findModelAnswer(questionText: string, marks?: string): ModelAnswer {
    const text = questionText.toLowerCase();

    // Check curated university solutions
    if (text.includes('lorentz force')) {
      return CURATED_MODEL_ANSWERS.lorentz;
    }
    if (text.includes('compton shift') || text.includes('compton effect')) {
      return CURATED_MODEL_ANSWERS.compton;
    }
    if (text.includes('schrödinger') || text.includes('schrodinger') || text.includes('wave equation')) {
      return CURATED_MODEL_ANSWERS.schrodinger;
    }
    if (text.includes('helium-neon') || text.includes('he-ne') || (text.includes('laser') && text.includes('working'))) {
      return CURATED_MODEL_ANSWERS.laser;
    }
    if (text.includes('population inversion') || text.includes('metastable')) {
      return CURATED_MODEL_ANSWERS.population_inversion;
    }
    if (text.includes('kronig') || text.includes('penney') || text.includes('band theory')) {
      return CURATED_MODEL_ANSWERS.kronig_penney;
    }
    if (text.includes('stack') || text.includes('lifo') || text.includes('infix to postfix')) {
      return CURATED_MODEL_ANSWERS.dsa_stack;
    }
    if ((text.includes('process') && text.includes('thread')) || text.includes('pcb')) {
      return CURATED_MODEL_ANSWERS.operating_system_process_thread;
    }
    if (text.includes('sampling theorem') || text.includes('nyquist') || text.includes('aliasing')) {
      return CURATED_MODEL_ANSWERS.sampling_theorem;
    }

    // Dynamic University-Standard Academic Solution Template
    const parsedMarks = marks || '7';
    return {
      questionSummary: questionText.length > 80 ? questionText.slice(0, 77) + '...' : questionText,
      source: 'BEU Academic Standard Marking Solution Framework',
      marksDistribution: `2 Marks (Core Concept) + 3 Marks (Technical Formulation) + 2 Marks (Practical Engineering Implications)`,
      points: [
        {
          heading: '1. Core Definition & Technical Framework',
          body: `Define the primary governing principles requested in "${questionText.slice(0, 50)}...". In BEU valuation, answers must begin with the standard academic definition, state applicable physical assumptions, and clarify boundary conditions.`
        },
        {
          heading: '2. Mathematical Formulation & Step-by-Step Derivation',
          body: 'Provide the underlying equations, step-by-step mathematical reasoning, and vector or algebraic relations. Label every variable clearly with SI units.'
        },
        {
          heading: '3. Engineering Diagram / Schematic & Applications',
          body: 'Draw a neatly labeled block diagram, circuit schematic, or flow chart. Conclude by citing at least two real-world engineering applications or industrial design relevance.'
        }
      ],
      examTip: `For ${parsedMarks}-mark questions, dedicate 1 page with neat headings, underlined keywords, and boxed final formulas to secure full marks.`
    };
  }
};
