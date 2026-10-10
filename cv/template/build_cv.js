const fs=require('fs');const path=require('path');
const {Document,Packer,Paragraph,TextRun,ImageRun,Table,TableRow,TableCell,WidthType,BorderStyle,AlignmentType,TabStopType,LevelFormat,Header,Footer,PageNumber,ShadingType,VerticalAlign,HeightRule,SectionType}=require('docx');
const OR='FAA21C',TXT='161616',MUT='6A6A6A',LINE='DCDCDC',F='Arial',W=9866;
const NONE={style:BorderStyle.NONE,size:0,color:'FFFFFF'},NB={top:NONE,bottom:NONE,left:NONE,right:NONE};
const r=(t,o={})=>new TextRun({text:t,font:F,size:19,color:TXT,...o});
const p=(ch,o={})=>new Paragraph({children:ch,spacing:{after:40,line:264},...o});
const RT=[{type:TabStopType.RIGHT,position:W}];
const logo=fs.readFileSync(path.join(__dirname,'assets/butec-logo.jpg')),photo=fs.readFileSync(path.join(__dirname,'assets/photo.jpg'));

/* section heading: orange number + bold caps, grey rule with short orange segment */
const h=(n,t,pb)=>new Paragraph({keepNext:true,pageBreakBefore:!!pb,spacing:{before:pb?0:240,after:110},border:{bottom:{style:BorderStyle.SINGLE,size:6,color:LINE,space:3}},
  children:[r(n+'  ',{bold:true,size:18,color:OR}),r(t.toUpperCase(),{bold:true,size:18,characterSpacing:40})]});
const bl=t=>new Paragraph({numbering:{reference:'b',level:0},spacing:{after:30,line:264},children:[r(t)]});
const job=(role,date,org,sub,bullets)=>[
  new Paragraph({keepNext:true,keepLines:true,tabStops:RT,spacing:{before:120,after:0},children:[r(role,{bold:true,size:20}),r('\t'+date,{size:17,color:MUT})]}),
  new Paragraph({keepNext:true,spacing:{after:sub?20:50},children:[r(org,{size:18,color:OR,bold:true})]}),
  ...(sub?[new Paragraph({keepNext:true,spacing:{after:50,line:260},children:[r(sub,{size:18,color:MUT})]})]:[]),
  ...bullets.map(bl)];

/* header / footer running on every page */
const header=new Header({children:[new Paragraph({tabStops:RT,spacing:{after:0},border:{bottom:{style:BorderStyle.SINGLE,size:18,color:OR,space:4}},
  children:[new ImageRun({type:'jpg',data:logo,transformation:{width:64,height:16},altText:{title:'BUTEC',description:'BUTEC logo',name:'logo'}}),
  r('\tPERSONNEL PROFILE',{size:15,bold:true,color:MUT,characterSpacing:60})]})]});
const footer=new Footer({children:[new Paragraph({tabStops:RT,spacing:{before:0},run:{size:15,font:F,color:MUT},
  children:[r('BUTEC  /  BRIK ZINE EDDINE',{size:15,color:MUT}),r('\tPage ',{size:15,color:MUT}),new TextRun({children:[PageNumber.CURRENT],font:F,size:15,color:MUT,bold:false}),r(' of ',{size:15,color:MUT}),new TextRun({children:[PageNumber.TOTAL_PAGES],font:F,size:15,color:MUT,bold:false})]})]});

/* identity block: name + heading 01 left; photo right spans from orange line down to the grey line */
const GREY={style:BorderStyle.SINGLE,size:6,color:LINE};
const id=new Table({width:{size:W,type:WidthType.DXA},columnWidths:[7866,2000],borders:{...NB,insideHorizontal:NONE,insideVertical:NONE},rows:[
 new TableRow({height:{value:2000,rule:HeightRule.EXACT},children:[
  new TableCell({borders:NB,width:{size:7866,type:WidthType.DXA},margins:{left:0,right:200,top:0,bottom:0},verticalAlign:VerticalAlign.CENTER,children:[
    new Paragraph({spacing:{after:50},children:[r('BRIK ZINE EDDINE',{bold:true,size:44,characterSpacing:40})]}),
    new Paragraph({spacing:{after:140},children:[r('PROJECT HSE MANAGER  ·  CMIOSH, BSc',{bold:true,size:20,color:MUT,characterSpacing:50})]}),
    new Paragraph({spacing:{after:30},children:[r('Doha, Qatar',{size:18,color:'333333'}),r('   ▪   ',{size:18,color:OR}),r('+974 7472 5386',{size:18,color:'333333'}),r('   ▪   ',{size:18,color:OR}),r('Zeyn.etudes@gmail.com',{size:18,color:'333333'})]})]}),
  new TableCell({rowSpan:2,borders:{top:NONE,left:NONE,right:NONE,bottom:GREY},width:{size:2000,type:WidthType.DXA},margins:{left:0,right:0,top:0,bottom:0},children:[
    new Paragraph({alignment:AlignmentType.RIGHT,spacing:{after:0,line:240,lineRule:'auto'},children:[new ImageRun({type:'jpg',data:photo,transformation:{width:133,height:162},altText:{title:'Photo',description:'Portrait',name:'photo'}})]})]})
 ]}),
 new TableRow({height:{value:440,rule:HeightRule.EXACT},children:[
  new TableCell({borders:{top:NONE,left:NONE,right:NONE,bottom:GREY},width:{size:7866,type:WidthType.DXA},margins:{left:0,right:0,top:0,bottom:40},verticalAlign:VerticalAlign.BOTTOM,children:[
    new Paragraph({spacing:{after:0},children:[r('01  ',{bold:true,size:18,color:OR}),r('PROFESSIONAL PROFILE',{bold:true,size:18,characterSpacing:40})]})]})
 ]})
]});

/* key figures strip */
const kw=[2466,2466,2466,2468];
const kpi=(n,l,i)=>new TableCell({width:{size:kw[i],type:WidthType.DXA},margins:{top:80,bottom:80,left:140,right:100},
  borders:{top:{style:BorderStyle.SINGLE,size:18,color:OR},bottom:NONE,left:NONE,right:NONE},shading:{type:ShadingType.CLEAR,fill:'F5F5F5',color:'auto'},
  children:[new Paragraph({spacing:{after:0},children:[r(n,{bold:true,size:34})]}),new Paragraph({spacing:{after:0},children:[r(l,{size:15,color:MUT,characterSpacing:10})]})]});
const kpis=new Table({width:{size:W,type:WidthType.DXA},columnWidths:kw,borders:{...NB,insideHorizontal:NONE,insideVertical:NONE},rows:[new TableRow({children:[
  kpi('15+','YEARS IN HSE, 2011 – PRESENT',0),kpi('4','COUNTRIES: QATAR, BRUNEI, MOROCCO, ALGERIA',1),kpi('7','PROJECTS UNDER ONE HSE BUSINESS UNIT',2),kpi('11','HSE OFFICERS LED, LARGEST TEAM',3)]})]});

/* two-column credential / competency grids (borderless, label + text) */
const grid=(rows,lw)=>new Table({width:{size:W,type:WidthType.DXA},columnWidths:[lw,W-lw],borders:{...NB,insideHorizontal:NONE,insideVertical:NONE},
  rows:rows.map(([a,b])=>new TableRow({cantSplit:true,children:[
    new TableCell({borders:NB,width:{size:lw,type:WidthType.DXA},margins:{top:30,bottom:30,left:0,right:100},children:[new Paragraph({spacing:{after:0},children:[r(a,{bold:true,size:17,color:MUT,characterSpacing:10})]})]}),
    new TableCell({borders:{...NB,bottom:{style:BorderStyle.SINGLE,size:2,color:'EEEEEE'}},width:{size:W-lw,type:WidthType.DXA},margins:{top:30,bottom:30,left:0,right:0},children:[new Paragraph({spacing:{after:0,line:260},children:[r(b)]})]})]}))});

const quals=grid([
 ['MEMBERSHIP','Chartered Member of IOSH (CMIOSH)'],
 ['ACADEMIC','BSc in Business Management'],
 ['DIPLOMA','Level 6 Diploma in Occupational Health and Safety Practice'],
 ['NEBOSH','International General Certificate; Incident Investigation'],
 ['OSHA','Certified Occupational Safety and Health Professional; Certified OSH Trainer (Train the Trainer)'],
 ['AUDITING','ISO 45001:2018 Auditor / Lead Auditor'],
 ['INSPECTION & FIRST AID','CITB SIS Scaffolding Inspector Training; BLS/AED and First Aid Certificate'],
 ['DEVELOPMENT','Train the Trainer: Instructional Design and Dynamic Delivery (PHI Management Group, 5 days); Developing and Implementing an Outward Mindset'],
],2100);
const comps=grid([
 ['MANAGEMENT SYSTEMS & LEADERSHIP','Safety management system evaluation · HSE department and team leadership · legal compliance · audits · safety committees · performance reporting · worker welfare'],
 ['OPERATIONAL RISK CONTROL','Job hazard analysis · COSHH · confined spaces · shafts, excavation and tunnelling · steel erection and scaffolding · fall protection · electrical safety · PPE · LOTO · heat and cold stress · rigging and lifting'],
 ['EMERGENCY & INVESTIGATION','Fire prevention plans · emergency action plans · accident investigation and root cause analysis · first aid BLS/CPR'],
 ['TRAINING & COMMUNICATION','OSH training development · hazard communication · inductions and toolbox talks · effective safety committee meetings'],
 ['DIGITAL TOOLS','MS Office, including expert-level Excel'],
 ['LANGUAGES','Arabic (native) · English (advanced) · French (advanced)'],
],2100);

const refs=grid([
 ['Andy Barker','JACOBS, HSE Manager'],
 ['Chris Garrow','IDRIS MTS2, HSE Manager'],
 ['Mike Hewitt','STRABAG–ZÜBLIN, HSE Manager'],
 ['James Reilly','STRABAG–ZÜBLIN, HSE Manager'],
],2100);

const kids=[
 id,
 p([r('HSE management professional with project and business-unit experience across construction, infrastructure, power generation, industrial plants and oil and gas. Responsibilities include HSE management systems, multidisciplinary team leadership, operational risk control, worker welfare, emergency preparedness, investigation, performance reporting and client coordination.')],{spacing:{before:120,after:140,line:276}}),
 kpis,
 h('02','Qualifications and membership'), quals,
 h('03','Core competencies'), comps,
];
const kids2=[
 h('04','Experience'),
 ...job('Project HSE Manager','Nov 2020 – Present','BUTEC · Doha, Qatar','Project: Development of Doha Air Base',[
  'Principal HSE contact: communicates performance to stakeholders and develops policies and procedures aligned with legal requirements, industry standards and international norms.',
  'Plans activities with project teams to identify, assess and control hazards; recruits, supervises and mentors HSE team leaders and officers.',
  'Develops emergency response and crisis management strategies; leads loss-event investigations, root cause analysis and corrective measures.',
  'Designs and conducts organisation-wide training; sets SMART objectives and reports performance metrics.']),
 ...job('Health, Safety, Environment and Welfare Manager','Jan 2018 – Nov 2020','STRABAG–ZÜBLIN · Doha, Qatar','Head of the business unit across seven projects, reporting to the Managing Director and Corporate HSE Director. Portfolio: Doha South Terminal Pumping Station and Odour Control Facility (ASHGHAL); Al Shaqab Equine Veterinary Medical Centre, SIDRA Medical Research Centre, North Site Utility Extension (Qatar Foundation); Energy City Qatar; BEEMA Office Building, Lusail; Muntazah Commercial Residences.',[
  'Recruited, managed and mentored HSE, environmental, medical and training personnel; developed project HSE systems, HSE plans, emergency response and traffic management plans.',
  'Conducted site visits and compliance audits, directed incident investigations, and produced monthly and annual board reports.',
  'Implemented Qatar Foundation Worker Welfare Standards across Qatar Foundation and ASHGHAL projects: accommodation, site facilities, employment conditions and ethical recruitment.',
  'Supported Business Development and Pre-Construction teams with prequalification questionnaires, tender bids and construction planning.']),
 ...job('Project HSSE and Welfare Manager','Jan 2017 – Aug 2018','STRABAG–ZÜBLIN · Doha, Qatar','Project: Design and Build of Al Shaqab Equine Veterinary Medical Centre (Qatar Foundation)',[
  'Led occupational health, safety, environment and worker welfare; implemented policies and procedures and monitored compliance with regulations and legislation.',
  'Coordinated with construction, procurement and planning; supported method statements and risk assessments; developed and delivered project-specific training.',
  'Managed the emergency response team; investigated incidents and near misses and implemented corrective actions.',
  'Verified welfare standards on site and at worker accommodation; chaired safety committees; conducted client liaison, internal and subcontractor audits.']),
 ...job('Deputy HSE Manager','Sep 2015 – Jan 2017','STRABAG–ZÜBLIN · Doha, Qatar','Project: Design and Build of Inner Doha Re-sewerage Implementation Strategy, IDRIS MTS II',[
  'Provided shift support to the HSE Manager, supervising 10 HSE Officers and Inspectors plus environmental, medical and training staff; primary HSE contact for the supervisory consultant.',
  'Supported development and implementation of the project HSE system, joint inspections with consultant teams and action closeout.',
  'Delivered toolbox talks and training; provided weekly and monthly metrics; monitored compliance with BS 6164; acted as shift emergency coordinator.']),
 ...job('HSE Team Leader','Feb 2015 – May 2015','STRABAG · Brunei','COGEN II Power Station Expansion, Brunei Shell Petroleum',[
  'Led 11 HSE and Environmental Officers: assigned duties, oversaw daily inspections and preventive actions, and monitored compliance with regulations and client standards.',
  'Reported safety statistics to the divisional head; chaired safety meetings; developed a frontline supervisory training package.']),
 ...job('HSE Officer','Mar 2012 – Dec 2014','Total Safety / JACOBS · Morocco','Two Di-Ammonium Phosphate production units: civil works, steel erection, piping, lifting, electrical work, testing and commissioning; ODI platforms (Phosphoric Acid, DAP and Sulfuric Acid plant units)',[
  'Reviewed contractor HSE systems, method statements and risk assessments; developed project training and training matrices.',
  'Monitored legal compliance through inspections, audits and surveys; analysed HSE statistics; investigated accidents.']),
 ...job('HSE Officer','Jul 2011 – Mar 2012','BONATTI SPA · Algeria','OMN and E2A water injection and reinjection stations (SONATRACH); In Salah Gas pipelines (Petrofac / British Petroleum / Statoil)',[
  'Monitored safe work systems and permits; reviewed construction and commissioning risk assessments; inspected site and camp facilities.',
  'Took part in client and subcontractor audits; delivered inductions and toolbox talks; investigated near misses; inspected cranes, MEWPs, forklifts, lifting accessories and scaffolding.']),
 ...job('Administrative Assistant','Jul 2010 – Jul 2011','BONATTI SPA · Algeria','',[]),
 h('05','Professional references'),
 refs,
 p([r('Contact details provided on request.',{size:17,color:MUT,italics:true})],{spacing:{before:60}}),
];
const doc=new Document({
  styles:{default:{document:{run:{font:F,size:19}}}},
  numbering:{config:[{reference:'b',levels:[{level:0,format:LevelFormat.BULLET,text:'▪',alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:300,hanging:220}},run:{color:OR}}}]}]},
  sections:[
  {properties:{page:{size:{width:11906,height:16838},margin:{top:1000,bottom:1000,left:1020,right:1020,header:560,footer:480}}},headers:{default:header},footers:{default:footer},children:kids},
  {properties:{type:SectionType.NEXT_PAGE,page:{size:{width:11906,height:16838},margin:{top:1250,bottom:1000,left:1020,right:1020,header:560,footer:480}}},headers:{default:header},footers:{default:footer},children:kids2}
]});
Packer.toBuffer(doc).then(b=>fs.writeFileSync(path.join(__dirname,'BUTEC_Personnel_CV_Template.docx'),b));
