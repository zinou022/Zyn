const fs=require('fs');
const {Document,Packer,Paragraph,TextRun,Table,TableRow,TableCell,ImageRun,Header,Footer,AlignmentType,HeadingLevel,BorderStyle,WidthType,ShadingType,PageNumber,LevelFormat,PageBreak,TabStopType}=require('docx');
const meta=JSON.parse(fs.readFileSync('meta.json'));
const NAVY='12355B',GREY='5B6573',LINE='C9D2DE',FONT='Arial';
const CW=9900; // content width DXA
const r=(t,o={})=>new TextRun({text:t,font:FONT,...o});
const p=(t,o={})=>new Paragraph({spacing:{after:o.after??100,before:o.before??0,line:o.line??276},alignment:o.align,keepNext:o.keepNext,children:Array.isArray(t)?t:[r(t,{size:o.size??21,color:o.color,bold:o.bold,italics:o.italics})]});
const h1=(t,pb)=>new Paragraph({heading:HeadingLevel.HEADING_1,pageBreakBefore:!!pb,spacing:{before:pb?0:300,after:140},keepNext:true,border:{bottom:{style:BorderStyle.SINGLE,size:8,color:NAVY,space:4}},children:[r(t,{size:30,bold:true,color:NAVY})]});
const h2=(t,pb)=>new Paragraph({heading:HeadingLevel.HEADING_2,pageBreakBefore:!!pb,spacing:{before:pb?0:260,after:80},keepNext:true,children:[r(t,{size:25,bold:true,color:NAVY})]});
const bullet=(t,bold)=>new Paragraph({numbering:{reference:'b',level:0},spacing:{after:60,line:268},children:bold?[r(bold,{size:21,bold:true}),r(t,{size:21})]:[r(t,{size:21})]});
const img=(k,w=590)=>{const [W,H]=meta[k];return new Paragraph({alignment:AlignmentType.CENTER,spacing:{before:60,after:60},keepNext:true,children:[new ImageRun({type:'png',data:fs.readFileSync(`img-${k}.png`),transformation:{width:w,height:Math.round(w*H/W)},altText:{title:k,description:k+' workflow',name:k}})]});};
const bd={style:BorderStyle.SINGLE,size:4,color:LINE};const borders={top:bd,bottom:bd,left:bd,right:bd};
const cell=(children,w,o={})=>new TableCell({borders,width:{size:w,type:WidthType.DXA},shading:o.fill?{fill:o.fill,type:ShadingType.CLEAR,color:'auto'}:undefined,margins:{top:60,bottom:60,left:100,right:100},verticalAlign:o.va,columnSpan:o.span,children});
const tp=(t,o={})=>new Paragraph({keepNext:o.keep,spacing:{after:0,line:250},children:[r(t,{size:o.size??19,bold:o.bold,color:o.color})]});
function table(head,rows,widths,keep){
  const hr=new TableRow({tableHeader:true,cantSplit:true,children:head.map((h,i)=>cell([tp(h,{bold:true,color:'FFFFFF',keep})],widths[i],{fill:NAVY}))});
  const body=rows.map((row,ri)=>{const k=keep&&ri<rows.length-1;return row.group?new TableRow({cantSplit:true,children:[cell([tp(row.group,{bold:true,color:NAVY,keep:k})],CW,{fill:'E6EDF6',span:widths.length})]}):new TableRow({cantSplit:true,children:row.map((c,i)=>cell([tp(c,{bold:i==0,color:i==0?NAVY:undefined,keep:k})],widths[i]))});});
  return new Table({width:{size:CW,type:WidthType.DXA},columnWidths:widths,rows:[hr,...body]});
}
const REQ=[1250,5050,3600];
const req=rows=>table(['ID','The system shall…','Why it matters'],rows,REQ,true);
const purpose=(t,who)=>new Paragraph({spacing:{after:100,line:270},keepNext:true,shading:{type:ShadingType.CLEAR,fill:'F1F5FA',color:'auto'},border:{left:{style:BorderStyle.SINGLE,size:24,color:NAVY,space:6}},children:[r('Purpose. ',{size:20,bold:true,color:NAVY}),r(t,{size:20}),...(who?[r('  Used by: ',{size:20,bold:true,color:NAVY}),r(who,{size:20})]:[])]});
const note=(t,k)=>p(t,{size:18,color:GREY,italics:true,before:40,after:100,keepNext:!!k});
const sp=()=>new Paragraph({spacing:{after:80},children:[]});

const C=[];
// Title block
C.push(new Paragraph({spacing:{before:0,after:60},children:[r('BUTEC HSE INTEGRATED PLATFORM',{size:20,bold:true,color:GREY})]}));
C.push(new Paragraph({spacing:{after:80},children:[r('Functional Requirements Document',{size:46,bold:true,color:NAVY})]}));
C.push(p('What the platform must do, and why. Prepared for BUTEC management.',{size:22,color:GREY,after:160}));
C.push(table(['Version','Status','Date','Prepared by'],[['2.0','Draft for management review','7 October 2026','HSE Platform owner']],[1400,3400,2300,2800]));
// 1
C.push(h1('1. The project in brief'));
C.push(p('The BUTEC HSE Integrated Platform is one web platform that brings the company’s HSE work into a single place. It has a Portal, which is the entry door, and a set of applications behind it. Each application covers one HSE process from start to finish.'));
C.push(h2('Where the idea comes from'));
C.push(p('HSE information at BUTEC lived in many separate places: monthly statistics in Excel files, KPI and audit checklists in PDF, investigation reports and witness statements in Word, observations and worker documents in other files and emails. Every project reported in its own way. Follow-up depended on people chasing each other, and information was lost when a person moved or a project ended.'));
C.push(p('The platform was created to replace this with one controlled system: one login, one set of data, one way of working on every project.'));
C.push(h2('What the Portal is'));
C.push(p('The Portal is the single front door. A user signs in once and sees only the projects and applications that match their role. The Portal also holds the project register, the user directory, announcements and notifications, and the platform backups. Applications do not keep their own users or projects; they all take them from the Portal.'));
C.push(img('overview',560));
C.push(note('Figure 1. The Portal, its seven applications and the central database.'));
// 2
C.push(h1('2. What the platform must achieve'));
C.push(table(['Centralisation','Automation','Retention'],[[
 'All HSE processes, users, projects and results in one place, with one login, one look and one set of rules. No parallel spreadsheets.',
 'The system assigns, reminds, calculates and reports by itself. People do the work; the system does the chasing, the arithmetic and the paperwork.',
 'Nothing about a project is lost. Records are voided or archived, never erased. Every change is traced. Everything is backed up.']],[3300,3300,3300]));
C.push(p('',{after:60}));
C.push(p('These three goals drive every requirement in this document. Section 4 states them as platform-wide requirements; Section 5 applies them application by application.',{size:21}));
// 3
C.push(h1('3. Who uses the platform'));
C.push(table(['Group','What they do on the platform'],[
 ['System owner','Controls projects, users and roles; sets targets and templates; reviews and accepts or returns submitted reports.'],
 ['Corporate and country HSE','Follow performance and incidents across several projects.'],
 ['Project HSE managers and officers','Complete the monthly reports, run investigations and observations on their project.'],
 ['Project management','Follow the project’s HSE status and take decisions on it.'],
 ['Site and support staff','Engineers, supervisors, trainers, nurses, HR, logistics, security and others use only the applications that match their function.'],
 ['All employees and visitors','Raise observations and read task instructions.'],
],[2800,7100]));
C.push(note('Access is always limited by project and by role. A person sees only what their role needs on the projects they belong to.'));
// 4
C.push(h1('4. Platform-wide requirements',true));
const PW=[
 {group:'Centralisation'},
 ['FR-PLT-01','Give each user one sign-in for every application they are entitled to.','No multiple accounts and passwords.'],
 ['FR-PLT-02','Keep one register of projects, users and roles in the Portal, used by all applications.','Data is entered once and is the same everywhere.'],
 ['FR-PLT-03','Limit what each user sees by project and role.','Confidentiality and clear accountability.'],
 ['FR-PLT-04','Send assignments, returns, deadlines and overdue items to users as in-app notifications, and publish announcements.','People are informed without emails and calls.'],
 ['FR-PLT-05','Offer one search across the platform and one common look and behaviour in every application.','Easy to learn; staff move between applications without retraining.'],
 {group:'Automation'},
 ['FR-PLT-06','Create recurring reports and assign them automatically (monthly), to the right person.','No one has to remember or be reminded.'],
 ['FR-PLT-07','Apply deadlines automatically, flag late items and send reminders.','Late work is visible early, without manual follow-up.'],
 ['FR-PLT-08','Calculate scores, rates and targets automatically and reuse data between applications (incident data feeds statistics).','Removes calculation errors and double entry.'],
 ['FR-PLT-09','Produce outputs automatically: dashboards, Word reports, printable forms.','Management gets results without rebuilding them by hand.'],
 {group:'Retention of information'},
 ['FR-PLT-10','Never let users delete records. Mistakes are voided with a reason, who and when; finished items are archived.','The history of a project is always complete.'],
 ['FR-PLT-11','Keep every submitted or approved record as a fixed version. A correction creates a new version; comments and replies stay attached.','Shows what was reported, reviewed and changed.'],
 ['FR-PLT-12','Record who did what and when on every record. For incidents the history can only be added to, never changed.','Evidence for audits, clients and investigations.'],
 ['FR-PLT-13','Keep project data readable after the project closes, and keep a person’s records after they leave or transfer. Before deactivating a user or project, show what it affects.','Knowledge stays with the company, not with individuals.'],
 ['FR-PLT-14','Back up all data automatically and keep a backup before every change to the live system.','A failure or a mistake never means lost data.'],
 ['FR-PLT-15','Import existing spreadsheet history into the platform.','Past years are brought in, not abandoned.'],
];
C.push(table(['ID','The system shall…','Why it matters'],PW,REQ,true));
// 5
C.push(h1('5. Applications',true));
C.push(p('Each application below states its purpose, shows its workflow and lists what it must do. In every diagram the colour shows who acts.',{after:60}));
C.push(img('legend',590));C.push(sp());
const app=(title,pb,pur,who,fig,caption,rows,extra)=>{
  C.push(h2(title,pb));C.push(purpose(pur,who));C.push(img(fig,590));C.push(note(caption,true));if(extra)C.push(...extra);C.push(req(rows));};
app('5.1 Portal',false,'The single entry point: it controls who can reach which project and application.','System owner, all users.','portal','Figure 2. Portal workflow.',[
 ['FR-POR-01','Maintain the project register: create projects, set their leadership, choose the applications each project uses, and close or archive them.','The Portal alone decides what exists.'],
 ['FR-POR-02','Maintain the user directory: create users, give one or several roles, move people between projects, deactivate and reset access.','Control over who has access.'],
 ['FR-POR-03','Show each user a card for each application they may open.','Simple, uniform navigation.'],
 ['FR-POR-04','Provide announcements, notifications and global search.','One channel for communication.'],
 ['FR-POR-05','Let the owner upload, review and approve controlled matrices and boarding requirements by country and project.','Requirements are set centrally and applied everywhere.'],
 ['FR-POR-06','Show system health, data-quality checks and backups, and allow a backup on demand.','The owner can trust and recover the data.'],
]);
app('5.2 HSE Statistics',false,'Replaces the monthly statistics spreadsheets. Each project reports the same indicators every month, and results are compared with targets.','Project HSE manager (fills), system owner (reviews).','stats','Figure 3. HSE Statistics workflow. The owner can reopen an accepted report, with a reason, for correction.',[
 ['FR-STA-01','Hold one report per project per month, with indicators in three groups: statistics, leading and lagging. A month cannot be assigned twice.','Same structure on every project.'],
 ['FR-STA-02','Assign each report automatically to the project HSE Manager, with a 7-day deadline, an overdue notice and monthly creation.','No manual chasing.'],
 ['FR-STA-03','Calculate rates (per 200,000 man-hours), emissions from fuel and totals, and bring in incident figures from the Incident application.','Accurate figures, entered once.'],
 ['FR-STA-04','Set a target per indicator with an effective period; when a target changes, ask from when it applies. Show targets met or not met.','Performance is judged against the target valid at the time.'],
 ['FR-STA-05','Let the owner add or remove indicators and edit targets.','The system follows company needs.'],
 ['FR-STA-06','Let the owner comment on each line, accept or return the report, show returned lines in red, let the assignee reply on the same comment, and allow reopening.','Corrections are traceable, with no side emails.'],
 ['FR-STA-07','Provide a dashboard with period selection and click-to-highlight, in the same style as the OBS Tracker.','Management sees performance at a glance.'],
]);
app('5.3 Audit and KPI',false,'Replaces the PDF checklists used for the monthly KPI assessment of each project (HSE, HR and ADNOC assurance).','Assigned assessor (scores), system owner (reviews).','kpi','Figure 4. Audit and KPI workflow. Review, return and reopen work exactly as in HSE Statistics.',[
 ['FR-KPI-01','Reproduce each checklist with the same table format, weights and scoring as the original PDF.','Results stay valid for audits and clients.'],
 ['FR-KPI-02','Accept only positive numbers that do not exceed the line’s weight, with a pop-up reminder when the entry is wrong. Lines marked N/A are left out of the score.','Prevents scoring errors.'],
 ['FR-KPI-03','Block submission while lines are missing and highlight them in light red.','Complete assessments only.'],
 ['FR-KPI-04','Calculate and show the total score of each sheet by the rule of that checklist.','One clear result per sheet.'],
 ['FR-KPI-05','Create assessments monthly, assign them automatically (same person as last time), allow manual creation, and apply the 7-day deadline and overdue notices.','No manual chasing.'],
 ['FR-KPI-06','Let the owner maintain the checklist templates, and provide a dashboard in the OBS Tracker style.','Controlled templates; management view.'],
]);
app('5.4 Incident Investigation',false,'Manages an event from the first report to closed corrective actions, and keeps a permanent record of it.','Anyone reports; HSE investigates; owner reviews.','inc','Figure 5. Incident Investigation workflow.',[
 ['FR-INC-01','Let an authorised user report an event and assess its severity by domain, giving a governing level of Low, Medium or High.','Response is proportionate to severity.'],
 ['FR-INC-02','Set investigation deadlines of 3, 7 or 14 days from the event date according to the level, and flag late investigations automatically.','Investigations are done on time.'],
 ['FR-INC-03','Keep facts, witness statements, root cause (SCAT) and corrective actions in one case file.','Everything about the event in one place.'],
 ['FR-INC-04','Let the reviewer comment line by line and return or approve the report. An approved report becomes a fixed copy that can be circulated.','What was circulated can always be shown.'],
 ['FR-INC-05','Generate the investigation report as a Word document automatically.','No retyping.'],
 ['FR-INC-06','Never delete an event. Mistaken events are voided with a reason; the history cannot be altered, even by administrators.','Legal and learning value of the record.'],
 ['FR-INC-07','Feed incident figures into HSE Statistics and show an incident dashboard.','One source for incident numbers.'],
]);
app('5.5 OBS Tracker',false,'Captures safety observations from site and follows each one to a validated close-out.','Anyone on site (raise); action owner; reviewer.','obs','Figure 6. OBS Tracker workflow.',[
 ['FR-OBS-01','Let anyone raise an observation with category, risk rating, priority and photo, through the application or a public QR page, even with weak connection.','Easy to report; more observations.'],
 ['FR-OBS-02','Set the deadline from the priority: Critical 24 h, High 72 h, Medium 120 h, Low 168 h. Flag overdue items and escalate them automatically.','Urgent items are never left behind.'],
 ['FR-OBS-03','Keep the discussion and evidence with the observation.','Full story in one record.'],
 ['FR-OBS-04','Require evidence at close-out and validation by the reviewer within 24 hours; a rejection returns it to the action owner.','Closed means truly closed.'],
 ['FR-OBS-05','Manage inspection checklists and focus inspections, and provide a dashboard and reports with filters.','Targeted inspections; management view.'],
 ['FR-OBS-06','Void or archive observations; never delete them.','History kept.'],
]);
app('5.6 Task Instruction',false,'Gives the crew a clear, reviewed instruction before a task starts, so risks and controls are understood.','Supervisor (prepares), HSE team (reviews), crew (reads).','ti','Figure 7. Task Instruction workflow.',[
 ['FR-TI-01','Let a supervisor prepare an instruction from a controlled catalogue of tasks, hazards and controls.','Consistent content, less typing.'],
 ['FR-TI-02','Select the crew from the project roster and send the instruction to the HSE team for review.','Right people briefed; HSE has control.'],
 ['FR-TI-03','Give the crew access to the issued instruction by link or QR code, without a separate account.','Reaches the people on the ground.'],
 ['FR-TI-04','Close the instruction when the task ends and keep it as a record.','Proof of briefing.'],
]);
app('5.7 Boarding System',false,'Controls who may enter and work on a project: documents, medical fitness, training and access, from arrival to departure.','Boarding officer, HR, medical staff, trainers, security.','brd','Figure 8. Boarding workflow.',[
 ['FR-BRD-01','Keep one record per person (BUTEC staff, subcontractor, client, consultant, visitor) with company and project.','One identity per worker.'],
 ['FR-BRD-02','Register documents with expiry dates, apply the requirements set by country and project, and send reminders before expiry.','No one works with expired papers.'],
 ['FR-BRD-03','Record the medical result (fit, fit with restrictions, unfit, needs reassessment) with a printable exam form. Restrict medical details to medical roles.','Medical privacy and clear fitness status.'],
 ['FR-BRD-04','Record induction and training attendance, with a printable attendance sheet.','Proof of training.'],
 ['FR-BRD-05','Issue the access pass and ID card, keep a gate log of entries and exits, and allow a pass to be revoked.','Only cleared people enter.'],
 ['FR-BRD-06','Handle transfers between projects and offboarding without losing history, and provide compliance reports (expiry, overdue actions, training status).','Complete personnel history; management view.'],
]);
app('5.8 Equipment Management',false,'Makes sure every machine and vehicle on a project has valid documents and inspections before and during use.','Equipment coordinator, storekeeper, HSE.','eqp','Figure 9. Equipment workflow.',[
 ['FR-EQP-01','Keep an asset register by equipment type, where each type defines its required documents.','Requirements depend on the equipment.'],
 ['FR-EQP-02','Let documents be uploaded, then verified or rejected by the coordinator.','Only checked equipment goes to work.'],
 ['FR-EQP-03','Mobilize an asset to a project only after verification; flag expiring documents automatically.','Safe, compliant equipment.'],
 ['FR-EQP-04','Log inspections and maintenance for each asset.','Equipment condition is known.'],
 ['FR-EQP-05','Demobilize assets while keeping their history, and import existing registers from spreadsheets.','Past records are kept; fast start.'],
 ['FR-EQP-06','Provide an equipment dashboard and reports.','Management view.'],
]);
// 6
C.push(h1('6. Quality requirements'));
C.push(table(['Area','Requirement'],[
 ['Security','Access only through secure connections; passwords protected; every action limited by role and project.'],
 ['Availability and recovery','Automatic backups; a restore path that is tested before major changes.'],
 ['Ease of use','The same look, wording and behaviour in every application; short, simple screens; works on desktop, tablet and phone.'],
 ['Cost','Only free or open-source components, so the platform has no licence cost.'],
 ['Reproducibility','Data structure changes are versioned and the source is documented, so the platform can be rebuilt and maintained by someone new.'],
],[2600,7300]));
C.push(h1('7. Assumptions'));
C.push(bullet('The platform runs on one company server reached over the internet.'));
C.push(bullet('The system owner creates users and assigns roles; there is no public sign-up.'));
C.push(bullet('The Incident Investigation card is not shown on the Portal today; its requirements remain in this document.'));

const doc=new Document({
 creator:'BUTEC HSE Platform',title:'BUTEC HSE Integrated Platform – Functional Requirements Document',
 styles:{default:{document:{run:{font:FONT,size:21}}},paragraphStyles:[
  {id:'Heading1',name:'Heading 1',basedOn:'Normal',next:'Normal',quickFormat:true,run:{size:30,bold:true,font:FONT,color:NAVY},paragraph:{spacing:{before:300,after:140},outlineLevel:0}},
  {id:'Heading2',name:'Heading 2',basedOn:'Normal',next:'Normal',quickFormat:true,run:{size:25,bold:true,font:FONT,color:NAVY},paragraph:{spacing:{before:260,after:80},outlineLevel:1}}]},
 numbering:{config:[{reference:'b',levels:[{level:0,format:LevelFormat.BULLET,text:'•',alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:540,hanging:270}}}}]}]},
 sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:1000,bottom:1000,left:1003,right:1003}}},
  headers:{default:new Header({children:[new Paragraph({tabStops:[{type:TabStopType.RIGHT,position:CW}],border:{bottom:{style:BorderStyle.SINGLE,size:4,color:LINE,space:4}},children:[r('BUTEC HSE Integrated Platform',{size:16,color:GREY}),r('\tFunctional Requirements Document · v2.0 Draft',{size:16,color:GREY})]})]})},
  footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[r('Page ',{size:16,color:GREY}),new TextRun({children:[PageNumber.CURRENT],font:FONT,size:16,color:GREY}),r(' of ',{size:16,color:GREY}),new TextRun({children:[PageNumber.TOTAL_PAGES],font:FONT,size:16,color:GREY})]})]})},
  children:C}]});
Packer.toBuffer(doc).then(b=>{fs.writeFileSync('../BUTEC-HSE-Platform-FRD.docx',b);console.log('ok',b.length);});
