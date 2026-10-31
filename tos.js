const tosBlueprints = [
  {subject:"Biology", title:"Biology Grade 12 first-semester ToS", scope:"Grade 12 · 2018 E.C. · 50 questions", file:"Biology Grade  12 TOS .pdf", units:[
    {name:"Applications of Biology",weight:20,keywords:["biotechnology","food security","nutrition","natural resource","conservation","gm crop","genetically modified","bioremediation","biopesticide"]},
    {name:"Microorganisms",weight:26,keywords:["microorganism","bacteria","eubacteria","archaea","fungi","fungus","protozoa","virus","viral","microbiota","disease transmission"]},
    {name:"Energy Transformation",weight:46,keywords:["photosynthesis","cellular respiration","respiration","atp","chloroplast","glycolysis","krebs","metabolism","energy transformation","fermentation"]},
    {name:"Evolution",weight:8,keywords:["evolution","natural selection","speciation","fossil","adaptation","darwin","lamarck"]}
  ]},
  {subject:"Chemistry", title:"Chemistry Grade 12 first-semester ToS", scope:"Grade 12 · 2018 E.C. · 50 questions", file:"CHEMISTRY GRADE 12 TOS.pdf", units:[
    {name:"Acid-Base Equilibria",weight:56,keywords:["acid","base","ph","poh","buffer","titration","hydrolysis","equilibrium","indicator","conjugate","dissociation"]},
    {name:"Electrochemistry",weight:44,keywords:["electrochem","electrolysis","oxidation","reduction","redox","voltaic","galvanic","electrode","faraday","salt bridge","anode","cathode"]}
  ]},
  {subject:"Economics", title:"Economics Grade 12 first-semester ToS", scope:"Grade 12 · 2018 E.C. · 50 questions", file:"Grade 12 Economics ToS 2018.pdf", units:[
    {name:"Fundamental Concepts of Macroeconomics",weight:26,keywords:["macroeconomic concept","macroeconomics","national income","inflation","unemployment","economic growth","business cycle","school of thought"]},
    {name:"Aggregate Demand and Aggregate Supply",weight:26,keywords:["aggregate demand","aggregate supply","equilibrium","demand shock","supply shock"]},
    {name:"Market Failure and Consumer Protection",weight:22,keywords:["market failure","public good","free rider","externalit","asymmetric information","consumer protection"]},
    {name:"Macroeconomic Policy Instruments",weight:26,keywords:["fiscal policy","monetary policy","exchange rate","foreign exchange","income policy","wage policy","macroeconomic polic"]}
  ]},
  {subject:"History", title:"History Grade 12 first-semester ToS", scope:"Grade 12 · 2018 E.C. · 50 questions", file:"History G 12 2018- First Sem. TOS.pdf", units:[
    {name:"Capitalism and Nationalism, 1815–1914",weight:16,keywords:["capitalism","industrial revolution","nationalism","unification of italy","unification of germany","american civil war","eastern question","balkan"]},
    {name:"Africa and the Colonial Experience",weight:20,keywords:["colonial","legitimate trade","partition of africa","african resistance","mahdist","mahdist movement"]},
    {name:"Ethiopia, mid-19th century to 1941",weight:36,keywords:["ethiopia","ethiopian","adwa","menelik","tèwodros","tewodros","zemene mesafint","long distance trade","italian aggression","liy iyasu","ethiopian patriots"]},
    {name:"Society and Politics in the World Wars Era",weight:18,keywords:["world war","world war i","world war ii","russian revolution","great depression","fascism","nazism","locarno"]},
    {name:"Global Developments since 1945",weight:10,keywords:["united nations","cold war","post-war","third world","north and south","global development"]}
  ]},
  {subject:"Mathematics", title:"Mathematics Grade 12 first-semester ToS", scope:"Grade 12 · 2018 E.C. · 50 questions", file:"Maths -G-12  TOS.pdf", units:[
    {name:"Sequences and Series",weight:32,keywords:["sequence","series","arithmetic progression","geometric progression","sigma notation","partial sum","convergent","divergent"]},
    {name:"Introduction to Calculus",weight:38,keywords:["calculus","derivative","differentiation","integral","integration","rate of change","tangent","area under a curve"]},
    {name:"Statistics",weight:30,keywords:["statistics","dispersion","interquartile","quartile deviation","mean deviation","variance","standard deviation","coefficient of variation"]}
  ]},
  {subject:"Physics", title:"Physics Grade 12 first-semester ToS", scope:"Grade 12 · first semester · 50 questions", file:"Physics g12  Tos.pdf", units:[
    {name:"Physics and Human Society",weight:20,keywords:["physics and human","medical physics","engineering","communication technology","defense technology","other sciences"]},
    {name:"Two-Dimensional Motion",weight:42,keywords:["projectile","rotational motion","rotational dynamics","moment of inertia","torque","kepler","planetary motion","gravitation"]},
    {name:"Fluid Mechanics",weight:38,keywords:["fluid","pressure","pascal","archimedes","buoyant","flow rate","continuity equation","density","manometer","barometer"]}
  ]},
  {subject:"Geography", title:"Geography Grade 12 first-semester ToS", scope:"Grade 12 · 2018 E.C. · 50 questions", file:"ToS_Geo_Grade 12_2018.pdf", units:[
    {name:"Major Geological Processes",weight:24,keywords:["geolog","continental drift","plate tectonic","plate boundary","folding","faulting","endogenic","exogenic","ring of fire"]},
    {name:"Climate Change",weight:30,keywords:["climate change","climate adaptation","climate mitigation","greenhouse","global warming","climate convention","climate resilient"]},
    {name:"Sustainable Development I",weight:24,keywords:["sustainable development","sustainable development goal","sdg","resource use","resource conflict"]},
    {name:"Sustainable Development II",weight:22,keywords:["sustainable development","green economy","poverty and development","development indicator"]}
  ]},
  {subject:"English", title:"English Grade 12 first-semester ToS", scope:"Grade 12 · 2018 · 50 questions including reading", file:"G-12 ENG SPEC SEM-I.pdf", units:[
    {name:"Sustainable Development",weight:16,keywords:["sustainable development","pronunciation","contextual vocabulary","comparison","contrast","sentence fragment"]},
    {name:"Time Management",weight:16,keywords:["time management","giving reason","phrasal verb","expressing result","wish","gerund","run-on sentence","letter writing"]},
    {name:"Evidence on Traffic Accident",weight:14,keywords:["traffic accident","expressing opinion","antonym","conditional sentence","participle","misplaced modifier","jumbled paragraph"]},
    {name:"Natural Resource Management",weight:16,keywords:["natural resource management","agreeing","disagreeing","syllable","stress","adverbial clause","dangling modifier","expository essay"]},
    {name:"Mechanized Agriculture",weight:12,keywords:["mechanized agriculture","interview question","contextual meaning","analogy","infinitive","descriptive essay"]},
    {name:"Green Economies",weight:12,keywords:["green econom","asking for advice","giving advice","purpose clause","relative pronoun","faulty parallelism"]},
    {name:"Reading Passage",weight:14,keywords:["reading comprehension","according to the passage","passage states","main idea of the passage"]}
  ]},
  {subject:"Aptitude / SAT", title:"Grade 12 Aptitude and SAT ToS", scope:"Grade 12 · verbal 35 items; quantitative 25 items", file:"G-12 APTITUDE ToS.pdf", units:[
    {name:"Analogy",weight:18,keywords:["analogy","analogous","relationship between"]},
    {name:"Sentence Completion",weight:10,keywords:["sentence completion","complete the sentence","blank in the sentence"]},
    {name:"Critical Reading",weight:15,keywords:["critical reading","according to the passage","passage states","main idea of the passage"]},
    {name:"Language Usage",weight:8,keywords:["language usage","grammar","sentence correction","punctuation"]},
    {name:"Logical Reasoning",weight:7,keywords:["logical reasoning","conclusion","assumption","argument"]},
    {name:"Quantitative Reasoning",weight:42,keywords:["quantitative reasoning","ratio","percent","percentage","probability","data interpretation","mean","median","equation","solve","calculate"]}
  ]}
];

tosBlueprints.forEach(function (b) { b.pdfPath = "reference-pdfs/tos/" + b.file; });
