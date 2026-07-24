const BLOG_POSTS = [
  {
    id: "cryptographic-hash-chaining-live-video-tamper-evidence",
    title: "A Cryptographic Hash-Chaining Framework for Real-Time Tamper-Evidence in Live Video Streams",
    type: "RESEARCH PAPER",
    date: "24 JUL 2026",
    doi: "https://doi.org/10.5281/zenodo.21526230",
    coverImage: "assets/images/crypto_video_verification.png",
    summary: "The rapid advancement of generative AI has significantly increased the difficulty of verifying live video evidence. We propose a cryptographic evidence pipeline framework combining SHA-256 frame hashing, DCT/wavelet perceptual hashing, metadata binding, Merkle tree aggregation, and hardware-protected digital signatures to deliver deterministic, real-time tamper-evidence.",
    readTime: "12 min read",
    tags: ["#CRYPTOGRAPHY", "#DIGITAL-FORENSICS", "#VIDEO-AUTH", "#MERKLE-TREES", "#HARDWARE-SECURITY"],
    content: `
      <p class="lead">The rapid advancement of generative artificial intelligence has significantly increased the difficulty of verifying the authenticity of live video evidence. Existing forensic approaches primarily perform post-capture analysis and often lack mechanisms for continuous integrity verification during acquisition. This paper proposes a cryptographic evidence pipeline framework for detecting manipulation and verifying the authenticity of AI-manipulated live video.</p>

      <div class="doi-banner-box" style="margin: 1.5rem 0; padding: 1.25rem; background: rgba(59, 130, 246, 0.08); border: 1px solid var(--border-focus); border-radius: 8px;">
        <div style="font-weight: 700; font-size: 0.9rem; text-transform: uppercase; color: var(--accent-color); letter-spacing: 0.05em;">Published Research Paper</div>
        <div style="font-size: 1.1rem; font-weight: 600; margin-top: 0.25rem;">DOI: <a href="https://doi.org/10.5281/zenodo.21526230" target="_blank" rel="noopener noreferrer" style="color: var(--accent-color); text-decoration: underline;">10.5281/zenodo.21526230 ↗</a></div>
        <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">Author: <strong>Karan</strong> (Founder, Entangle &bull; krkaranraj.me@gmail.com)</div>
      </div>

      <h2>1. Introduction & Background</h2>
      <p>Live video has become a primary medium for journalism, remote interviews, legal evidence, and insurance documentation. However, its credibility is increasingly under threat due to powerful real-time manipulation tools such as deepfakes, frame splicing, and object removal.</p>
      <p>Existing solutions have notable limitations. AI-based deepfake detectors are probabilistic and frequently fail against evolving forgery techniques. Traditional metadata approaches, including EXIF tags and standards such as C2PA, can be stripped or forged with relative ease. Consequently, there is a clear need for robust, cryptographically grounded mechanisms capable of verifying authenticity directly at the point of capture.</p>

      <h2>2. Proposed Dual-Hashing Framework</h2>
      <p>Our proposed framework provides strong tamper-evidence by cryptographically linking every frame of a live video stream to both the capturing device and the preceding frames. During recording, each frame is processed through a dual hashing approach:</p>
      <ul>
        <li><strong>Cryptographic Hashing:</strong> SHA-256 is applied to the raw frame bytes (or selected keyframe data). This produces a bit-exact fingerprint, ensuring that even a single-pixel modification results in a drastically different hash value.</li>
        <li><strong>Perceptual Hashing:</strong> A perceptual image hash (pHash based on DCT or wavelet features) is computed to detect semantically significant changes, such as face replacements, while tolerating benign transformations like compression or minor color adjustments.</li>
      </ul>

      <h2>3. Mathematical Formulation of Frame Hash-Chaining</h2>
      <p>The resulting hashes are combined with the previous frame's hash and contextual metadata, including timestamps, GPS coordinates, accelerometer data, and optional challenge-response prompts (e.g., "show your ID" or "state today's date"). Formally, the chained hash is defined as:</p>
      <div style="background: var(--card-bg); border: 1px solid var(--border-color); padding: 1.25rem; border-radius: 8px; font-family: monospace; font-size: 1.1rem; text-align: center; margin: 1.5rem 0;">
        H_i = SHA256( H_{i-1}  ||  c_i  ||  p_i  ||  M_i )
      </div>
      <p>Where <em>c_i = SHA256(F_i)</em> is the cryptographic frame hash, <em>p_i = pHash(F_i)</em> is the perceptual frame hash, and <em>M_i</em> is the bound metadata. Any tampering, insertion, or deletion of frames breaks this chain, similar to the principle used in blockchain or Lamport hash sequences.</p>

      <h2>4. Merkle Tree Aggregation & Hardware-Protected Signatures</h2>
      <p>Frames are grouped into blocks of size <em>N</em> (e.g., <em>N = 1000</em>). For each block, a Merkle tree is constructed over the chained hashes, and the Merkle root is digitally signed using a hardware-protected key on the device (using Android StrongBox TEE or iOS Secure Enclave CryptoKit).</p>
      <p>While the live video is streamed or recorded in the usual manner, a lightweight parallel proof stream carries the hash values, signatures, and anchoring references. Verifiers can then cross-check the received video against these proofs to confirm that no frames have been altered, inserted, or removed.</p>

      <h2>5. Threat Model & Security Properties</h2>
      <p>We consider a strong adversary capable of intercepting and modifying video content after capture:</p>
      <ul>
        <li><strong>Content Adversary:</strong> Attempts frame insertion, deletion, or replacement. Prevented because any change to <em>F_i</em> alters <em>c_i</em> and <em>H_i</em>, breaking the entire downstream chain.</li>
        <li><strong>Timing & Metadata Adversary:</strong> Attempts to delay packets or spoof GPS/timestamp metadata. Prevented because metadata is cryptographically bound into each frame's hash.</li>
        <li><strong>Credential Adversary:</strong> Attempts to forge signatures. Prevented by hardware secure enclaves (TEE/TPM) ensuring private keys cannot be extracted.</li>
      </ul>

      <h2>6. Implementation & Real-World Integration</h2>
      <p>The proposed framework is engineered for real-time execution on commodity devices such as smartphones and webcams. It integrates seamlessly with modern AI platforms (e.g., Google Gemini live camera mode) without introducing noticeable latency (hashing a 720p frame takes ~10ms on mid-range smartphones with <6% CPU overhead).</p>

      <h2>7. DOI Link & Paper Citation</h2>
      <p>Read the official published paper and access full experimental datasets via Zenodo:</p>
      <p><a href="https://doi.org/10.5281/zenodo.21526230" target="_blank" rel="noopener noreferrer" class="submit-comment-btn" style="text-decoration: none; display: inline-flex; align-items: center; gap: 0.5rem; width: auto;">
        View Official DOI Paper on Zenodo (10.5281/zenodo.21526230) ↗
      </a></p>
    `
  },
  {
    id: "nvidias-vision-physical-ai-healthcare",
    title: "NVIDIA's Vision for Physical AI in Healthcare: Building the Foundation for Autonomous Surgical Robotics",
    type: "ESSAY",
    date: "24 JUL 2026",
    coverImage: "assets/images/surgical_robotics_ai.png",
    summary: "Artificial intelligence has transformed diagnosis, but Physical AI is the next frontier. Explore how NVIDIA's Cosmos-H-Surgical, world models, and Isaac Sim are laying the foundation for autonomous surgical robotics.",
    readTime: "6 min read",
    tags: ["#NVIDIA", "#PHYSICAL-AI", "#HEALTHCARE", "#ROBOTICS", "#WORLD-MODELS"],
    content: `
      <p class="lead">Artificial intelligence has transformed how we process medical images, analyze patient data, and assist clinicians in diagnosis. The next frontier, however, is <strong>Physical AI</strong>—AI systems capable of perceiving, reasoning, and interacting with the physical world. NVIDIA's latest initiatives in healthcare signal a major step toward this future by providing the infrastructure needed to develop intelligent surgical robots.</p>

      <h2>What Is Physical AI?</h2>
      <p>Unlike traditional AI, which primarily analyzes information and generates predictions, Physical AI enables machines to understand their environment and perform real-world actions. In healthcare, this includes surgical robots that can interpret visual information, understand surgical context, and execute precise movements under human supervision.</p>
      <p>Building such systems requires enormous amounts of high-quality training data. This is where one of the biggest challenges emerges.</p>

      <h2>The Data Bottleneck in Surgical Robotics</h2>
      <p>Modern robotic foundation models, often referred to as Vision-Language-Action (VLA) models, require datasets containing:</p>
      <ul>
        <li>Visual observations from surgical procedures</li>
        <li>Language describing surgical tasks</li>
        <li>Precise robot movements and tool trajectories</li>
      </ul>
      <p>Although millions of surgical videos are available worldwide, almost none include synchronized robot kinematics or action labels. Without these paired datasets, training highly capable surgical AI becomes extremely difficult.</p>

      <h2>NVIDIA's Solution: Cosmos-H-Surgical</h2>
      <p>To address this challenge, NVIDIA introduced <strong>Cosmos-H-Surgical</strong>, a healthcare-focused world model designed specifically for surgical robotics.</p>
      <p>Rather than relying solely on expensive real-world robotic demonstrations, Cosmos-H-Surgical learns from existing surgical videos and detailed action descriptions. The model can generate realistic synthetic surgical procedures while preserving clinically meaningful interactions.</p>
      <p>Researchers then use inverse dynamics models to estimate robot movements from these generated videos, creating synthetic video-action pairs that can train robotic policies.</p>
      <p>This approach dramatically expands the amount of training data available without requiring every surgical procedure to be manually recorded with robot motion data.</p>

      <h2>Why World Models Matter</h2>
      <p>A world model functions as a simulator of reality.</p>
      <p>Instead of programming every possible surgical scenario, the AI learns how surgeries unfold and can generate new examples that resemble real operations. These synthetic environments allow robots to practice countless procedures safely before operating in clinical settings.</p>
      <p>Similar approaches have already accelerated progress in autonomous driving, where virtual environments are used extensively before real-world deployment.</p>

      <h2>Beyond Simulation</h2>
      <p>NVIDIA's healthcare Physical AI ecosystem extends beyond world models.</p>
      <p>Using technologies such as <strong>Isaac Sim</strong>, developers can create digital twins of operating rooms, simulate interactions between robotic systems and medical devices, and evaluate algorithms under diverse conditions before human testing.</p>
      <p>This simulation-first methodology reduces development costs while improving safety and robustness.</p>

      <h2>Industry Impact</h2>
      <p>Rather than manufacturing surgical robots, NVIDIA is positioning itself as the AI infrastructure provider for the healthcare robotics industry.</p>
      <p>Its technologies can support medical device manufacturers, hospitals, and research institutions by providing:</p>
      <ul>
        <li>Foundation models for surgical understanding</li>
        <li>Simulation environments for robot training</li>
        <li>Synthetic data generation</li>
        <li>Accelerated computing for real-time robotic inference</li>
      </ul>
      <p>This mirrors NVIDIA's successful strategy in autonomous vehicles, where it supplies the underlying AI platform rather than producing cars.</p>

      <h2>The Road Ahead</h2>
      <p>Fully autonomous surgery remains a long-term goal. Significant challenges remain, including regulatory approval, patient safety, clinical validation, and ethical oversight.</p>
      <p>However, NVIDIA's investment in Physical AI represents an important shift. Instead of viewing surgical robots as isolated machines, the company is building an ecosystem that combines foundation models, world models, simulation, and robotics into a unified platform.</p>
      <p>If successful, this approach could substantially reduce the data barrier that has limited progress in surgical robotics for years.</p>

      <h2>Conclusion</h2>
      <p>Physical AI has the potential to redefine healthcare by enabling intelligent robotic systems that learn, adapt, and assist surgeons with unprecedented precision. NVIDIA's Cosmos-H-Surgical and broader healthcare AI framework demonstrate how synthetic data, world models, and simulation can accelerate this transformation.</p>
      <p>While autonomous surgery is still evolving, the foundations being built today may shape the next generation of medical robotics, bringing safer, smarter, and more scalable surgical care to hospitals around the world.</p>
    `
  },
  {
    id: "ml-powering-space-exploration",
    title: "How Machine Learning is Powering the Next Generation of Space Exploration",
    type: "ESSAY",
    date: "19 JUL 2026",
    coverImage: "assets/images/space_exploration.png",
    summary: "From autonomous Mars rovers to deep-space navigation and exoplanet detection, machine learning is transforming how humanity explores the cosmos. We examine the current applications and future challenges of AI in space.",
    readTime: "5 min read",
    tags: ["#SPACE", "#AI", "#MACHINE-LEARNING", "#AUTONOMY", "#EXOPLANETS"],
    content: `
      <p class="lead">Imagine a spacecraft millions of kilometers away from Earth. It encounters an unexpected asteroid or a steep crater on Mars. Waiting for instructions from mission control isn't an option because communication can take several minutes or even hours. In moments like these, the spacecraft must make decisions on its own.</p>
      
      <p>This is where Machine Learning (ML) is transforming space exploration.</p>

      <h2>Why Space Missions Need Machine Learning</h2>
      <p>Every space mission generates enormous amounts of data. Satellites capture high-resolution images, telescopes observe distant galaxies, and spacecraft continuously monitor their own systems. Analyzing all this information manually would be nearly impossible. Machine Learning enables spacecraft to process data, recognize patterns, and make intelligent decisions in real time. Instead of depending entirely on engineers on Earth, modern space systems can operate with a high degree of autonomy.</p>

      <h2>Autonomous Navigation: Teaching Spacecraft to Think</h2>
      <p>One of the most exciting applications of ML is autonomous navigation.</p>
      <p>Future spacecraft and planetary rovers use onboard cameras, LiDAR, sensors, and AI algorithms to understand their surroundings. They can detect rocks, avoid obstacles, optimize routes, and safely navigate unfamiliar terrain without waiting for commands from Earth.</p>
      <p>This capability is especially important for deep-space missions, where communication delays make real-time human control impossible.</p>

      <h2>Smarter Planetary Rovers</h2>
      <p>NASA's Mars rovers are excellent examples of machine learning in action.</p>
      <p>Modern rovers can:</p>
      <ul>
        <li>Identify interesting rock formations.</li>
        <li>Detect hazards like craters and large boulders.</li>
        <li>Choose safer paths.</li>
        <li>Prioritize scientific targets automatically.</li>
      </ul>
      <p>Instead of simply following pre-programmed instructions, these robots continuously analyze their environment and make intelligent decisions based on incoming data.</p>

      <h2>Seeing Patterns Humans Might Miss</h2>
      <p>Space telescopes generate millions of astronomical images every year.</p>
      <p>Machine learning models help astronomers identify galaxies, classify celestial objects, detect unusual cosmic events, and even discover planets orbiting distant stars.</p>
      <p>These algorithms can process years of observational data in a fraction of the time it would take human researchers, accelerating scientific discovery.</p>

      <h2>Predicting Problems Before They Happen</h2>
      <p>Another powerful application is predictive maintenance.</p>
      <p>Every spacecraft contains thousands of components that operate under extreme conditions.</p>
      <p>Machine learning continuously monitors system health by analyzing sensor data such as:</p>
      <ul>
        <li>Temperature</li>
        <li>Pressure</li>
        <li>Voltage</li>
        <li>Fuel levels</li>
        <li>Vibration</li>
      </ul>
      <p>If the system detects unusual behavior, it can predict potential failures before they become mission-threatening, allowing corrective action to be taken early.</p>

      <h2>Discovering New Worlds</h2>
      <p>One of the most fascinating uses of machine learning is the search for exoplanets.</p>
      <p>When a planet passes in front of its host star, the star's brightness decreases slightly. These tiny changes are often too subtle for manual analysis across millions of observations.</p>
      <p>Machine learning algorithms analyze these light curves, identify possible planets, eliminate false detections, and help astronomers discover new worlds faster than ever before.</p>

      <h2>Challenges Ahead</h2>
      <p>Despite its incredible potential, machine learning in space exploration still faces several challenges:</p>
      <ul>
        <li>Limited computing power onboard spacecraft</li>
        <li>Communication delays with Earth</li>
        <li>Noisy or incomplete sensor data</li>
        <li>The need for highly reliable decision-making in extreme environments</li>
      </ul>
      <p>As hardware becomes more efficient and AI algorithms continue to improve, these challenges are gradually being addressed.</p>

      <h2>The Future of Intelligent Space Exploration</h2>
      <p>The next generation of space missions will rely even more heavily on artificial intelligence and machine learning.</p>
      <p>Future spacecraft won't simply follow commands—they will learn from their surroundings, adapt to unexpected situations, optimize their own performance, and assist scientists in making discoveries that were once impossible.</p>
      <p>Machine learning is no longer just a supporting technology in space exploration.</p>
      <p>It is becoming the intelligence that enables humanity to explore farther, safer, and smarter than ever before.</p>
    `
  },
  {
    id: "beating-market-human-psychology-emh",
    title: "Why Beating the Market is Hard: Human Psychology, and the Efficient Market Hypothesis",
    type: "ESSAY",
    date: "17 JUL 2026",
    coverImage: "assets/images/market_psychology.png",
    summary: "Can humans consistently outperform the stock market, or are emotions the biggest obstacle? We explore behavioral biases, the math of the Sharpe Ratio, and the realities of the Efficient Market Hypothesis.",
    readTime: "6 min read",
    tags: ["#FINANCE", "#PSYCHOLOGY", "#EMH", "#SHARPE-RATIO"],
    content: `
      <p class="lead">Every day, millions of people buy and sell stocks believing they have found the perfect opportunity. Some buy because a stock is rising rapidly; others panic and sell when markets fall. While these decisions often feel rational in the moment, behavioral finance reveals that emotions frequently dictate our trading behavior.</p>
      
      <p>This raises a fundamental question at the intersection of psychology and economics:</p>
      <blockquote>
        "Can humans consistently outperform the market, or are our own emotional biases the ultimate obstacle to success?"
      </blockquote>
      <p>To unpack this question, we must look at two key concepts: the Sharpe Ratio (a tool for measuring risk-adjusted returns) and the Efficient Market Hypothesis (EMH).</p>

      <h2>Humans Don't Make Perfect Decisions</h2>
      <p>Modern financial markets move with blistering speed. In periods of high volatility, even seasoned traders experience powerful emotional triggers:</p>
      <ul>
        <li><strong>Fear:</strong> Paralyzing traders during market crashes and causing them to liquidate assets at the bottom.</li>
        <li><strong>Greed:</strong> Encouraging reckless risk-taking during parabolic bull runs.</li>
        <li><strong>FOMO:</strong> Driving traders to jump into a stock long after the optimal entry point has passed.</li>
        <li><strong>Overconfidence:</strong> Leading to oversized position sizing after a brief winning streak.</li>
      </ul>
      <p>These psychological traps lead to classic execution errors, such as buying too late, selling too early, holding losing trades for too long in hopes of a break-even, or taking on excessive risk. Because of this, returns alone do not tell the whole story. The amount of risk taken to generate those returns is what truly matters.</p>

      <h2>Enter the Sharpe Ratio</h2>
      <p>The Sharpe Ratio measures how much excess return an investment generates for every unit of volatility (risk) taken. Conceptually, it is expressed as:</p>
      <p style="text-align: center; font-weight: bold; margin: 1.5rem 0;">Higher Return with Lower Volatility = Higher Sharpe Ratio</p>
      <p>A trader earning a 20% return with massive, heart-stopping drawdowns may actually be performing worse on a risk-adjusted basis than a trader earning 15% steadily. This is why professional hedge funds and institutional trading desks evaluate performance using the Sharpe Ratio rather than absolute profits alone.</p>

      <h2>Efficient Market Hypothesis (EMH)</h2>
      <p>The Efficient Market Hypothesis suggests that stock prices fully reflect all publicly available information at any given time. If this hypothesis holds true:</p>
      <ul>
        <li>No individual trader should be able to consistently beat the market average over the long term.</li>
        <li>Any excess returns can only be achieved by taking on proportionally higher levels of risk.</li>
        <li>The average trader's Sharpe Ratio should converge toward the benchmark market index's Sharpe Ratio.</li>
      </ul>

      <h2>But Reality Is More Interesting</h2>
      <p>While the EMH presents a strong theoretical argument, empirical studies show that experience and discipline do make a difference. A notable study tracking 53 professional proprietary traders in the City of London discovered that:</p>
      <ol>
        <li>Beginner traders had risk-adjusted profiles (Sharpe Ratios) very close to random market returns.</li>
        <li>Experienced traders achieved an average Sharpe Ratio of about <strong>1.02</strong>, which is significantly higher than the benchmark market index.</li>
        <li>Sharpe Ratios tended to improve steadily with years of trading experience. This suggests that risk management and pattern recognition contribute to performance rather than pure luck.</li>
      </ol>
      <p>This does not disprove the EMH entirely, but it indicates that skill, emotional control, and disciplined decision-making can systematically improve risk-adjusted outcomes.</p>

      <h2>Why Emotions Matter</h2>
      <p>Successful professional traders do not magically eliminate their emotions; instead, they build strict systems to reduce emotional decision-making. These frameworks typically rely on:</p>
      <ul>
        <li>Predefined entry and exit triggers.</li>
        <li>Strict mathematical position sizing.</li>
        <li>Automated hard stop-losses.</li>
        <li>Daily and weekly risk exposure limits.</li>
        <li>Continuous evaluation using metrics like the Sharpe Ratio.</li>
      </ul>
      <p>These practices keep execution consistent, particularly during periods of intense market stress. In highly competitive environments, outperforming is incredibly difficult. The Sharpe Ratio serves as a constant reminder that successful investing is not just about making money—it is about making money efficiently relative to the risk you bear.</p>
      <p>Whether you are a retail investor, a professional fund manager, or building automated AI trading systems, focusing on disciplined risk mitigation is always more valuable than chasing the highest return.</p>
    `
  }
];

// Export to window object for vanilla JS usage
window.BLOG_POSTS = BLOG_POSTS;
