const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const S = { // style per actor
  usr:{f:'#DCE9F7',s:'#2F6DB5',t:'#10294A'},
  rev:{f:'#FDEBD0',s:'#D98324',t:'#4A2A05'},
  sys:{f:'#EEF0F3',s:'#6B7280',t:'#1F2937',d:'5 4'},
  done:{f:'#D9F0E1',s:'#2E8B57',t:'#0F3D26'},
  ret:{f:'#F9DADA',s:'#C0392B',t:'#561510'},
  hdr:{f:'#12355B',s:'#12355B',t:'#FFFFFF'},
};
const PX=196, PY=118, W=172, H=70, M=24;
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
function render(d){
  const N={}; let maxc=0,maxr=0;
  d.nodes.forEach(n=>{n.span=n.span||1;n.w=n.span*PX-(PX-W);n.x=M+n.col*PX;n.y=M+n.row*PY;n.h=n.h||H;N[n.id]=n;maxc=Math.max(maxc,n.col+n.span);maxr=Math.max(maxr,n.row);});
  const width=M*2+(maxc-1)*PX+W+ (d.extraW||0), height=M*2+maxr*PY+H+(d.extraH||0);
  const port=(n,s,o=0)=>s=='r'?[n.x+n.w,n.y+n.h/2+o]:s=='l'?[n.x,n.y+n.h/2+o]:s=='t'?[n.x+n.w/2+o,n.y]:[n.x+n.w/2+o,n.y+n.h];
  let svg='';
  d.edges.forEach(e=>{
    const a=N[e[0]],b=N[e[2]],sa=e[1],sb=e[3],o=e[5]||{};
    const p1=port(a,sa,o.ao||0),p2=port(b,sb,o.bo||0);let pts;
    const horiz=s=>s=='r'||s=='l';
    if(horiz(sa)&&horiz(sb)){ if(Math.abs(p1[1]-p2[1])<1) pts=[p1,p2]; else {const mx=(p1[0]+p2[0])/2;pts=[p1,[mx,p1[1]],[mx,p2[1]],p2];}}
    else if(!horiz(sa)&&!horiz(sb)){ if(sa==sb){const yy=sa=='b'?Math.max(p1[1],p2[1])+26:Math.min(p1[1],p2[1])-26;pts=[p1,[p1[0],yy],[p2[0],yy],p2];}
      else if(Math.abs(p1[0]-p2[0])<1) pts=[p1,p2]; else {const my=(p1[1]+p2[1])/2;pts=[p1,[p1[0],my],[p2[0],my],p2];}}
    else if(!horiz(sa)&&horiz(sb)) pts=[p1,[p1[0],p2[1]],p2];
    else pts=[p1,[p2[0],p1[1]],p2];
    const dash=o.dash?'stroke-dasharray="6 5"':'';
    const col=o.c||'#475569';
    svg+=`<polyline points="${pts.map(p=>p.join(',')).join(' ')}" fill="none" stroke="${col}" stroke-width="2.2" ${dash} marker-end="url(#ah${o.c?'r':''})"/>`;
    if(e[4]){ // label on the longest segment
      let best=0,bi=0;for(let i=0;i<pts.length-1;i++){const l=Math.abs(pts[i][0]-pts[i+1][0])+Math.abs(pts[i][1]-pts[i+1][1]);if(l>best){best=l;bi=i;}}
      const mx=(pts[bi][0]+pts[bi+1][0])/2,my=(pts[bi][1]+pts[bi+1][1])/2;
      const vert=Math.abs(pts[bi][0]-pts[bi+1][0])<1;
      const lines=e[4].split('\n');
      lines.forEach((ln,i)=>{svg+=`<text x="${mx+(vert?8:0)}" y="${my+(vert?4:-7)+i*14-(vert?(lines.length-1)*7:(lines.length-1)*14)}" text-anchor="${vert?'start':'middle'}" font-size="12.5" font-style="italic" fill="${o.c||'#334155'}" stroke="#fff" stroke-width="4" paint-order="stroke">${esc(ln)}</text>`;});
    }
  });
  d.nodes.forEach(n=>{
    const st=S[n.k];const lines=n.t.split('\n');const lh=18;const y0=n.y+n.h/2-(lines.length-1)*lh/2+5;
    svg+=`<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="9" fill="${st.f}" stroke="${st.s}" stroke-width="2" ${st.d?`stroke-dasharray="${st.d}"`:''}/>`;
    lines.forEach((ln,i)=>{svg+=`<text x="${n.x+n.w/2}" y="${y0+i*lh}" text-anchor="middle" font-size="15" font-weight="${n.b?700:500}" fill="${st.t}">${esc(ln)}</text>`;});
    if(n.k=='sys') svg+=`<rect x="${n.x+n.w-54}" y="${n.y-9}" width="46" height="17" rx="8" fill="#6B7280"/><text x="${n.x+n.w-31}" y="${n.y+3.5}" text-anchor="middle" font-size="10" font-weight="700" fill="#fff" letter-spacing="1">AUTO</text>`;
  });
  return {svg:`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" font-family="Liberation Sans, Arial, sans-serif"><defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#475569"/></marker><marker id="ahr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#C0392B"/></marker></defs>${svg}</svg>`,width,height};
}
const R='#C0392B';
const reviewTail=(prefix)=>[]; // placeholder
const D={};
D.overview={nodes:[
 {id:'p',col:0,row:0,span:5,k:'hdr',b:1,t:'BUTEC PORTAL\nOne sign-in · one project & user register · notifications · search'},
 {id:'a1',col:0,row:1,k:'usr',b:1,t:'HSE Statistics\nmonthly project\nstatistics'},
 {id:'a2',col:1,row:1,k:'usr',b:1,t:'Audit and KPI\nmonthly KPI\nassessments'},
 {id:'a3',col:2,row:1,k:'usr',b:1,t:'Incident\nInvestigation\nevents & root cause'},
 {id:'a4',col:3,row:1,k:'usr',b:1,t:'OBS Tracker\nobservations &\ncorrective actions'},
 {id:'a5',col:4,row:1,k:'usr',b:1,t:'Task Instruction\nbriefing before\nwork starts'},
 {id:'a6',col:1.5,row:2,k:'usr',b:1,t:'Boarding System\nworker documents,\nmedical, access'},
 {id:'a7',col:2.5,row:2,k:'usr',b:1,t:'Equipment\nManagement\nassets & documents'},
 {id:'db',col:0,row:3,span:5,k:'done',b:1,t:'ONE CENTRAL DATABASE · full history kept · automatic backups'},
],edges:[]};
D.legend={nodes:[
 {id:'l1',col:0,row:0,k:'usr',t:'A user acts'},
 {id:'l2',col:1,row:0,k:'rev',t:'Reviewer / owner acts'},
 {id:'l3',col:2,row:0,k:'sys',t:'System does it\nautomatically'},
 {id:'l4',col:3,row:0,k:'done',t:'Final, kept\nin the records'},
 {id:'l5',col:4,row:0,k:'ret',t:'Returned for\ncorrection'},
],edges:[]};
D.portal={nodes:[
 {id:'n1',col:0,row:0,k:'rev',t:'Owner creates the\nproject and sets its\nleadership'},
 {id:'n2',col:1,row:0,k:'rev',t:'Owner adds users,\nroles and the\napplications they use'},
 {id:'n3',col:2,row:0,k:'usr',t:'User signs in once'},
 {id:'n4',col:3,row:0,k:'sys',t:'Portal shows only the\nuser\'s projects and\napplications'},
 {id:'n5',col:4,row:0,k:'usr',t:'User opens an\napplication and\nrecords the work'},
 {id:'n6',col:4,row:1,k:'sys',t:'Notifications and\nannouncements\nreach the user'},
 {id:'n7',col:3,row:1,k:'sys',t:'Every action is logged\nand backed up'},
 {id:'n8',col:2,row:1,k:'done',t:'Project closed:\narchived, still\nreadable'},
],edges:[['n1','r','n2','l'],['n2','r','n3','l'],['n3','r','n4','l'],['n4','r','n5','l'],['n5','b','n6','t'],['n6','l','n7','r'],['n7','l','n8','r']]};
const review=(first,second,third,fourth)=>({nodes:[
 {id:'n1',col:0,row:0,k:'sys',t:first},
 {id:'n2',col:1,row:0,k:'sys',t:second},
 {id:'n3',col:2,row:0,k:'usr',t:third},
 {id:'n4',col:3,row:0,k:'sys',t:fourth},
 {id:'n5',col:4,row:0,k:'rev',t:'Owner reviews\nline by line and\ncomments'},
 {id:'n6',col:1,row:1,k:'sys',t:'Not submitted in\n7 days: overdue\nnotice sent'},
 {id:'n7',col:3,row:1,k:'ret',t:'Returned: commented\nlines shown in red'},
 {id:'n8',col:4,row:1,k:'done',t:'Accepted:\nfinal and kept'},
],edges:[['n1','r','n2','l'],['n2','r','n3','l'],['n3','r','n4','l'],['n4','r','n5','l'],
 ['n2','b','n6','t',null,{dash:1}],['n5','b','n7','t','',{ao:-40,bo:0}],['n5','b','n8','t',null,{ao:40,bo:40}],
 ['n7','l','n3','b','Assignee replies\nand resubmits',{c:R}]]});
D.stats=review('1st of the month:\nreport created for\neach project','Assigned to the\nproject HSE Manager\n(notified)','Fills in the\nindicators and\nsubmits','Checks nothing is\nmissing, calculates\ntargets met / not met');
D.kpi=review('Monthly assessment\ncreated per project\n(auto or manual)','Assigned to a\nperson (same as\nlast time)','Scores each line\n(never above its\nweight, N/A allowed)','Checks nothing is\nmissing, calculates\nthe total score');
D.inc={nodes:[
 {id:'n1',col:0,row:0,k:'usr',t:'Event reported:\ndate, place,\nwhat happened'},
 {id:'n2',col:1,row:0,k:'sys',t:'Severity assessed;\ngoverning level\nLow / Medium / High'},
 {id:'n3',col:2,row:0,k:'rev',t:'Investigation opened;\ndeadline of 3, 7 or\n14 days from event'},
 {id:'n4',col:3,row:0,k:'usr',t:'Facts, witness\nstatements and root\ncause (SCAT)'},
 {id:'n5',col:4,row:0,k:'rev',t:'Report reviewed\nline by line'},
 {id:'n6',col:2,row:1,k:'sys',t:'Late investigations\nflagged by deadline\nwatch'},
 {id:'n7',col:3,row:1,k:'ret',t:'Returned with\ncomments'},
 {id:'n8',col:4,row:1,k:'done',t:'Approved and\ncirculated: fixed\ncopy kept'},
 {id:'n9',col:4,row:2,k:'usr',t:'Corrective actions\ntracked to closure'},
 {id:'n10',col:3,row:2,k:'done',t:'Event closed;\nhistory locked'},
 {id:'n11',col:2,row:2,k:'sys',t:'Figures flow into\nHSE Statistics'},
],edges:[['n1','r','n2','l'],['n2','r','n3','l'],['n3','r','n4','l'],['n4','r','n5','l'],
 ['n3','b','n6','t',null,{dash:1}],['n5','b','n7','t','',{ao:-40,bo:40}],['n5','b','n8','t',null,{ao:40,bo:40}],
 ['n7','t','n4','b','Corrects and\nresubmits',{c:R,ao:-40,bo:-40}],['n8','b','n9','t'],['n9','l','n10','r'],['n10','l','n11','r']]};
D.obs={nodes:[
 {id:'n1',col:0,row:0,k:'usr',t:'Observation raised\n(app or public\nQR page)'},
 {id:'n2',col:1,row:0,k:'rev',t:'Assigned to an\naction owner;\npriority sets deadline'},
 {id:'n3',col:2,row:0,k:'usr',t:'Discussion and\naction in progress'},
 {id:'n4',col:3,row:0,k:'usr',t:'Close-out submitted\nwith evidence'},
 {id:'n5',col:4,row:0,k:'rev',t:'Validation by\nreviewer\n(24 h clock)'},
 {id:'n6',col:1,row:1,k:'sys',t:'Deadline missed:\nflagged overdue and\nescalated'},
 {id:'n7',col:3,row:1,k:'ret',t:'Rejected: back to\nthe action owner'},
 {id:'n8',col:4,row:1,k:'done',t:'Closed:\nkept with all\nevidence'},
],edges:[['n1','r','n2','l'],['n2','r','n3','l'],['n3','r','n4','l'],['n4','r','n5','l'],
 ['n2','b','n6','t',null,{dash:1}],['n5','b','n7','t','',{ao:-40}],['n5','b','n8','t',null,{ao:40,bo:40}],
 ['n7','l','n3','b','Corrects and\nresubmits',{c:R}]]};
D.ti={nodes:[
 {id:'n1',col:0,row:0,k:'usr',t:'Supervisor prepares\nthe instruction from\nthe controlled catalogue'},
 {id:'n2',col:1,row:0,k:'usr',t:'Crew selected\nfrom the project\nroster'},
 {id:'n3',col:2,row:0,k:'rev',t:'HSE team\nreviews'},
 {id:'n4',col:3,row:0,k:'sys',t:'Issued: crew opens\nit by link or\nQR code'},
 {id:'n5',col:4,row:0,k:'done',t:'Work completed:\ninstruction closed\nand kept'},
 {id:'n6',col:2,row:1,k:'ret',t:'Returned for\ncorrection'},
],edges:[['n1','r','n2','l'],['n2','r','n3','l'],['n3','r','n4','l'],['n4','r','n5','l'],
 ['n3','b','n6','t'],['n6','l','n1','b','Corrects and\nresubmits',{c:R}]]};
D.brd={nodes:[
 {id:'n1',col:0,row:0,k:'usr',t:'Worker record\ncreated (person,\ncompany, project)'},
 {id:'n2',col:1,row:0,k:'usr',t:'Documents\nregistered with\nexpiry dates'},
 {id:'n3',col:2,row:0,k:'usr',t:'Medical assessment:\nfit / restricted /\nunfit'},
 {id:'n4',col:3,row:0,k:'usr',t:'Induction and\ntraining attendance\nrecorded'},
 {id:'n5',col:4,row:0,k:'rev',t:'Access pass and\nID card issued'},
 {id:'n6',col:1,row:1,k:'sys',t:'Expiry reminders\nfor documents\nand passes'},
 {id:'n7',col:4,row:1,k:'usr',t:'Gate log:\nentry and exit\nrecorded'},
 {id:'n8',col:3,row:1,k:'usr',t:'Transfer to\nanother project'},
 {id:'n9',col:4,row:2,k:'done',t:'Offboarding: pass\nrevoked, record kept'},
],edges:[['n1','r','n2','l'],['n2','r','n3','l'],['n3','r','n4','l'],['n4','r','n5','l'],
 ['n2','b','n6','t',null,{dash:1}],['n5','b','n7','t'],['n7','l','n8','r'],['n7','b','n9','t','leaves']]};
D.eqp={nodes:[
 {id:'n1',col:0,row:0,k:'usr',t:'Asset registered\n(type, ID, owner)'},
 {id:'n2',col:1,row:0,k:'usr',t:'Required documents\nuploaded'},
 {id:'n3',col:2,row:0,k:'usr',t:'Submitted for\nverification'},
 {id:'n4',col:3,row:0,k:'rev',t:'Documents verified\nor rejected by the\ncoordinator'},
 {id:'n5',col:4,row:0,k:'done',t:'Mobilized to\nthe project\n(active)'},
 {id:'n6',col:0,row:1,k:'sys',t:'Expiring documents\nflagged\nautomatically'},
 {id:'n7',col:3,row:1,k:'ret',t:'Rejected: owner of\nthe asset corrects'},
 {id:'n8',col:4,row:1,k:'usr',t:'Inspections and\nmaintenance\nlogged'},
 {id:'n9',col:4,row:2,k:'done',t:'Demobilized:\nhistory kept'},
],edges:[['n1','r','n2','l'],['n2','r','n3','l'],['n3','r','n4','l'],['n4','r','n5','l'],
 ['n2','b','n6','t',null,{dash:1}],['n4','b','n7','t'],['n7','l','n2','b','Owner corrects\nand resubmits',{c:R,bo:40}],['n5','b','n8','t'],['n8','b','n9','t']]};
// route n7->n2: use b of n2? keep simple
(async()=>{
  const br=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const pg=await br.newPage({deviceScaleFactor:2});
  const meta={};
  for(const k of Object.keys(D)){
    const r=render(D[k]);
    await pg.setViewportSize({width:r.width,height:r.height});
    await pg.setContent(`<body style="margin:0;background:#fff">${r.svg}</body>`);
    await pg.screenshot({path:`img-${k}.png`,clip:{x:0,y:0,width:r.width,height:r.height}});
    meta[k]=[r.width,r.height];
  }
  fs.writeFileSync('meta.json',JSON.stringify(meta));
  await br.close();console.log(meta);
})();
