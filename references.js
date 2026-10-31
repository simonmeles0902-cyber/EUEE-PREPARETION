const references = [
  {subject:"Biology",grade:"Grade 12",kind:"Student textbook · 2023",title:"Biology Student Textbook",file:"G12-Biology-STB-2023-web (1).pdf",sections:["Unit 1 · Applications of Biology · p. 6","Unit 2 · Microorganisms · p. 40","Unit 3 · Energy Transformation · p. 114","Unit 4 · Evolution · p. 161","Unit 5 · Human Body System · p. 236","Unit 6 · Climate Change · p. 333"]},
  {subject:"Chemistry",grade:"Grade 12",kind:"Student textbook · 2023",title:"Chemistry Student Textbook",file:"G12-Chemistry-STB-2023-web.pdf",sections:["Unit 1 · Acid-Base Equilibria · p. 1 (section 1.1 starts p. 3)","Unit 2 · Electrochemistry · p. 57","Unit 3 · Industrial Chemistry · p. 136","Unit 4 · Polymers · p. 214","Unit 5 · Introduction to Environmental Chemistry · p. 241"]},
  {subject:"Mathematics",grade:"Grade 12",kind:"Student textbook · 2023",title:"Mathematics Student Textbook",file:"G12-Mathematics-STB-2023-web (2).pdf",sections:["Unit 1 · Sequences and Series · printed p. 1","Other units: Introduction to Pre-calculus, Statistics, Introduction to Linear Programming, and Mathematical Applications in Business. Page numbers were not readable in the supplied copy."]},
  {subject:"Physics",grade:"Grade 12",kind:"Student textbook · 2023",title:"Physics Student Textbook",file:"G12-Physics-STB-2023-web.pdf",sections:["Unit 1 · Application of Physics in Other Fields · p. 1","Unit 2 · Two-Dimensional Motion · p. 24","Unit 3 · Fluid Mechanics · p. 69","Unit 4 · Electromagnetism · p. 117","Unit 5 · Basics of Electronics · p. 142"]},
  {subject:"Biology",grade:"Grade 11",kind:"Student textbook · 2023",title:"Biology Student Textbook",file:"G11-Biology-STB-2023-web.pdf",sections:[]},
  {subject:"Chemistry",grade:"Grade 11",kind:"Student textbook · 2023",title:"Chemistry Student Textbook",file:"G11-Chemistry-STB-2023-web.pdf",sections:[]},
  {subject:"Mathematics",grade:"Grade 11",kind:"Student textbook · 2023",title:"Mathematics Student Textbook",file:"G11-Mathematics-STB-2023-web.pdf",sections:[]},
  {subject:"Economics",grade:"Grade 12",kind:"Condensed curriculum · 2025",title:"Economics Grade 12 Condensed Curriculum",file:"Economics G-12, Condensed Curriculum.pdf",sections:["Lesson 5 · Aggregate Demand and Aggregate Supply Analysis. The lesson heading is clear; the supplied file does not provide stable printed page references."]},
  {subject:"Geography",grade:"Grade 12",kind:"Condensed notes",title:"Geography Condensed Grade 12",file:"Geography Condensed Grade 12.pdf",sections:[]},
  {subject:"History",grade:"Grade 12",kind:"Condensed notes",title:"History Condensed G-12",file:"History Condensed G-12.pdf",sections:[]},
  {subject:"English",grade:"Grade 12",kind:"Student module · 2018",title:"English Grade 12 Final Module",file:"English GRADE 12 FINAL MODULE 2018.pdf",sections:[]},
  {subject:"English",grade:"Grade 12",kind:"Grammar notes",title:"Grammar Note for Grade 12",file:"GRAMMAR NOTE FOR GRADE 12.pdf",sections:[]},
  {subject:"Mathematics",grade:"Grade 9–12",kind:"Entrance-exam topic guide · 2017",title:"Mathematics Entrance Exam Content",file:"Mathematics 2017 Entrance Exam content grade 9-12 (1).pdf",sections:[]},
  {subject:"Study guide",grade:"Grade 12",kind:"EUEE study guide · 2017",title:"Grade 12 Best Study Contents for EUEE",file:"Grade 12 Best study contents for EUEE 2017.pdf",sections:[]},
  {subject:"Aptitude / SAT",grade:"Grade 12",kind:"Reference workbook · 2025",title:"SAT Workbook",file:"SAT workbook. 2025.pdf",sections:[]}
];


references.forEach(function (r) { r.pdfPath = "reference-pdfs/" + r.file; });
