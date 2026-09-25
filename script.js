const $=id=>document.getElementById(id);const givenComplexityBox=$("givenComplexityBox"),givenComplexity=$("givenComplexity"),givenDetails=$("givenDetails"),stabilityBox=$("stabilityBox"),stability=$("stability"),stabilityDetails=$("stabilityDetails");const dataInput=$("dataInput"),targetInput=$("targetInput"),targetWrap=$("targetWrap"),sourceInput=$("sourceInput"),sourceWrap=$("sourceWrap"),applyBtn=$("applyBtn"),randomBtn=$("randomBtn");const playBtn=$("playBtn"),pauseBtn=$("pauseBtn"),resetBtn=$("resetBtn"),speed=$("speed"),speedValue=$("speedValue");const visualizer=$("visualizer"),message=$("message"),stepIcon=$("stepIcon"),stepCount=$("stepCount"),totalSteps=$("totalSteps"),visualTitle=$("visualTitle"),visualHint=$("visualHint"),algoIcon=$("algoIcon"),infoTitle=$("infoTitle"),infoText=$("infoText"),learningSteps=$("logicSteps"),inputError=$("inputError"),best=$("best"),average=$("average"),worst=$("worst"),space=$("space"),visitedPanel=$("visitedPanel"),visitedArray=$("visitedArray"),queueInfo=$("queueInfo");
const info={bubble:{icon:"🫧",title:"Bubble Sort",hint:"Compare adjacent values, swap when needed, and repeat pass by pass.",text:"Bubble Sort moves larger values toward the end. Each complete pass places one more largest value in its final position.",steps:["Start a pass from the left","Compare adjacent values","Swap if left > right","The largest unsorted value settles","Repeat the next pass"],best:"O(n)",avg:"O(n²)",worst:"O(n²)",space:"O(1)"},merge:{icon:"🔀",title:"Merge Sort",hint:"Split the array into smaller arrays, then combine sorted pieces.",text:"Merge Sort is a divide-and-conquer algorithm. The visualization shows the actual arrays being split and then merged back in sorted order.",steps:["Split the array in half","Keep splitting until single values","Compare the front of each half","Take the smaller value","Combine sorted halves"],best:"O(n log n)",avg:"O(n log n)",worst:"O(n log n)",space:"O(n)"},binary:{icon:"🔎",title:"Binary Search",hint:"Use the middle value to eliminate half of a sorted array each time.",text:"Binary Search requires sorted data. First, the input is arranged in ascending order; then LOW, MID and HIGH are used to discard half the search range at each step.",steps:["Place the data in sorted (ascending) order","Find the middle index","Compare middle with target","Discard one half","Repeat until found"],best:"O(1)",avg:"O(log n)",worst:"O(log n)",space:"O(1)"},bfs:{icon:"🌐",title:"BFS — Breadth First Search",hint:"Explore the graph level by level using a queue.",text:"BFS visits a node, adds its unvisited neighbors to a queue, and processes that queue from front to back.",steps:["Start at A","Add A to the queue","Visit its neighbors","Process the next queue item","Continue level by level"],best:"O(V+E)",avg:"O(V+E)",worst:"O(V+E)",space:"O(V)"},dfs:{icon:"🧭",title:"DFS — Depth First Search",hint:"Follow one path deeply, then backtrack when no unvisited neighbor remains.",text:"DFS explores as deeply as possible before returning. The visited array shows the exact traversal order as it grows.",steps:["Start at A","Mark the node visited","Choose an unvisited neighbor","Go deeper","Backtrack when stuck"],best:"O(V+E)",avg:"O(V+E)",worst:"O(V+E)",space:"O(V)"}};
let current="bubble",array=[],steps=[],idx=0,playing=false,timer=null;
const defaultNodes=[["A",50,12],["B",24,35],["C",76,35],["D",12,67],["E",38,67],["F",62,67],["G",88,67]],defaultEdges=[["A","B"],["A","C"],["B","D"],["B","E"],["C","E"],["C","F"],["C","G"],["E","F"]];
let graphNodes=[...defaultNodes],graphEdges=[...defaultEdges],graphStart="A";
function setInfo(){const x=info[current];algoIcon.textContent=x.icon;visualTitle.textContent=x.title;visualHint.textContent=x.hint;infoTitle.textContent=x.title;infoText.textContent=x.text;best.textContent=x.best;average.textContent=x.avg;worst.textContent=x.worst;space.textContent=x.space;targetWrap.style.display=current==="binary"?"flex":"none";sourceWrap.style.display=(current==="bfs"||current==="dfs")?"flex":"none";const isGraph=current==="bfs"||current==="dfs";$("dataLabel").textContent=isGraph?"Graph data":"Numbers";$("dataFormat").textContent=isGraph?"edges or nodes":"comma separated";$("dataInput").placeholder=isGraph?"A-B, A-C, B-D, B-E, C-F":"45, 12, 78, 23";$("graphInputNote").style.display=isGraph?"block":"none";learningSteps.innerHTML=x.steps.map((s,i)=>`<div class="logic-step"><b>${i+1}</b>${s}</div>`).join("");visitedPanel.classList.toggle("hidden",!isGraph);updateSortFacts()}

function updateSortFacts(){
  const show=current==="bubble"||current==="merge";
  givenComplexityBox.classList.toggle("hidden",!show);
  stabilityBox.classList.toggle("hidden",!show);
  if(!show)return;
  const n=array.length;
  const sorted=array.every((v,i)=>i===0||array[i-1]<=v);
  if(current==="bubble"){
    givenComplexity.textContent=sorted?"O(n)":"O(n²)";
    givenDetails.textContent=sorted?"Already sorted → one pass":"Unsorted input → multiple passes";
    stability.textContent="YES";
    stabilityDetails.textContent="Equal values keep their relative order";
  }else{
    givenComplexity.textContent=n>1?"O(n log n)":"O(1)";
    givenDetails.textContent=`For ${n} value${n===1?"":"s"} → divide and merge`;
    stability.textContent="YES";
    stabilityDetails.textContent="Uses ≤ when equal values are merged";
  }
}
function parseData(){if(current==="bfs"||current==="dfs")return parseGraphData();const nums=dataInput.value.split(",").map(s=>s.trim()).filter(Boolean).map(Number);if(nums.length<2||nums.some(n=>!Number.isFinite(n))){inputError.textContent="Enter at least 2 valid numbers separated by commas.";return false}if(nums.length>40){inputError.textContent="Use up to 40 numbers so the array remains readable.";return false}array=nums;inputError.textContent="";updateSortFacts();return true}
function parseGraphData(){const raw=dataInput.value.trim();if(!raw){graphNodes=[...defaultNodes];graphEdges=[...defaultEdges];graphStart=(sourceInput.value.trim()||"A");if(!graphNodes.some(n=>n[0]===graphStart))graphStart="A";inputError.textContent="";sourceInput.value=graphStart;return true}const parts=raw.split(/[,;]+/).map(x=>x.trim()).filter(Boolean);const edgePattern=/^([A-Za-z0-9_]+)\s*(?:-|–|>)\s*([A-Za-z0-9_]+)$/;const edgesParsed=[];const nodeSet=new Set();let allEdges=true;for(const p of parts){const m=p.match(edgePattern);if(!m){allEdges=false;break}if(m[1]===m[2])continue;edgesParsed.push([m[1],m[2]]);nodeSet.add(m[1]);nodeSet.add(m[2])}if(allEdges&&edgesParsed.length){graphStart=sourceInput.value.trim()||edgesParsed[0][0];if(!nodeSet.has(graphStart)){inputError.textContent=`Starting node "${graphStart}" is not present in the graph.`;return false}graphNodes=[...nodeSet].map((name,i)=>{const angle=-Math.PI/2+(i*Math.PI*2)/nodeSet.size;return [name,50+38*Math.cos(angle),50+38*Math.sin(angle)]});graphEdges=edgesParsed;inputError.textContent="";return true}const nodesOnly=parts.filter(x=>/^[A-Za-z0-9_]+$/.test(x));if(nodesOnly.length>=2&&nodesOnly.length===parts.length){graphStart=sourceInput.value.trim()||nodesOnly[0];if(!nodesOnly.includes(graphStart)){inputError.textContent=`Starting node "${graphStart}" is not present in the graph.`;return false}graphNodes=nodesOnly.map((name,i)=>{const angle=-Math.PI/2+(i*Math.PI*2)/nodesOnly.length;return [name,50+38*Math.cos(angle),50+38*Math.sin(angle)]});graphEdges=nodesOnly.slice(1).map((name,i)=>[nodesOnly[i],name]);inputError.textContent="";return true}inputError.textContent="For BFS/DFS use edges like 0-1, 0-2, 1-3, 1-4, 2-5.";return false}
function add(type,data,text,icon,meta={}){steps.push({type,data,text,icon,...meta})}
function makeBubble(){steps=[];let a=[...array];for(let pass=1;pass<a.length;pass++){let swapped=false;for(let j=0;j<a.length-pass;j++){add("bubble",{a:[...a],compare:[j,j+1],pass,swap:false},`Pass ${pass}: Compare ${a[j]} and ${a[j+1]}. Is the left value larger?`,"👀");if(a[j]>a[j+1]){[a[j],a[j+1]]=[a[j+1],a[j]];swapped=true;add("bubble",{a:[...a],active:[j,j+1],move:[j,j+1],pass,swap:true},`Pass ${pass}: Swap ${a[j]} and ${a[j+1]}. The larger value moves one position right.`,"↔️")}}add("bubble",{a:[...a],done:a.length-pass,pass},`Pass ${pass} complete: ${a[a.length-pass]} is now in its final position.`,`✅`);if(!swapped)break}add("bubble",{a,all:true,pass:"Done"},"🎉 Bubble Sort complete — every value is in sorted order.","🎉")}
function makeMerge(){
 steps=[];
 let a=[...array];
 function splitStep(l,r,m){
  const left=a.slice(l,m+1),right=a.slice(m+1,r+1);
  add("merge",{a:[...a],l,r,m,phase:"split",left:[...left],right:[...right]},`Split the current section into [${left.join(", ")}] and [${right.join(", ")}].`,"✂️");
 }
 function sort(l,r){
  if(l>=r){
   add("merge",{a:[...a],l,r,phase:"single"},`Single value ${a[l]} needs no more splitting.`,"•");
   return;
  }
  const m=Math.floor((l+r)/2);
  splitStep(l,r,m);
  sort(l,m);
  sort(m+1,r);
  let L=a.slice(l,m+1),R=a.slice(m+1,r+1),i=0,j=0,k=l;
  add("merge",{a:[...a],l,r,m,phase:"merge",left:[...L],right:[...R]},`Now merge the sorted parts [${L.join(", ")}] and [${R.join(", ")}].`,"🔗");
  while(i<L.length&&j<R.length){
   const left=L[i],right=R[j];
   add("merge",{a:[...a],l,r,m,phase:"compare",left:[...L],right:[...R],compareValues:[left,right],place:k},`Compare ${left} and ${right}. Take the smaller value first.`,"👀");
   a[k]=left<=right?L[i++]:R[j++];
   add("merge",{a:[...a],l,r,m,phase:"place",left:[...L],right:[...R],placed:a[k],place:k},`Place ${a[k]} into the merged section at position ${k}.`,"⬇️");
   k++;
  }
  while(i<L.length){
   a[k]=L[i++];
   add("merge",{a:[...a],l,r,m,phase:"place",left:[...L],right:[...R],placed:a[k],place:k},`Copy remaining value ${a[k]} into the merged section.`,"➡️");
   k++;
  }
  while(j<R.length){
   a[k]=R[j++];
   add("merge",{a:[...a],l,r,m,phase:"place",left:[...L],right:[...R],placed:a[k],place:k},`Copy remaining value ${a[k]} into the merged section.`,"➡️");
   k++;
  }
  add("merge",{a:[...a],l,r,m,phase:"merged",left:a.slice(l,m+1),right:a.slice(m+1,r+1)},`Merged section [${a.slice(l,r+1).join(", ")}] is now sorted.`,"✅");
 }
 sort(0,a.length-1);
 add("merge",{a,all:true,phase:"complete"},"🎉 Merge Sort complete — all sorted sections are combined.","🎉");
}
function makeBinary(){steps=[];const original=[...array],a=[...array].sort((x,y)=>x-y),target=Number(targetInput.value);add("binary",{a:original,l:0,r:original.length-1,m:-1,preparing:true},`Binary Search needs sorted data. First, arrange the input in ascending order: [${a.join(", ")}].`,"↕️");if(!Number.isFinite(target)){inputError.textContent="Enter a valid search target.";return}let l=0,r=a.length-1;while(l<=r){const m=Math.floor((l+r)/2);add("binary",{a,l,r,m,target},`Check MID = ${a[m]} against target ${target}.`,"🎯");if(a[m]===target){add("binary",{a,l,r,m,target,found:true},`🎉 Found ${target} at index ${m}.`,"🎉");return}if(a[m]<target){add("binary",{a,l,r,m,target,discard:[l,m]},`MID ${a[m]} is smaller than ${target}. Discard the LEFT half.`,"➡️");l=m+1}else{add("binary",{a,l,r,m,target,discard:[m,r]},`MID ${a[m]} is larger than ${target}. Discard the RIGHT half.`,"⬅️");r=m-1}}add("binary",{a,l,r,m:-1,target,notfound:true},`❌ ${target} is not present in the sorted array.`,"❌")}
function makeGraph(mode){
  steps=[];
  const adj={};
  graphNodes.forEach(([name])=>adj[name]=[]);
  graphEdges.forEach(([a,b])=>{
    if(adj[a] && adj[b]){
      if(!adj[a].includes(b)) adj[a].push(b);
      if(!adj[b].includes(a)) adj[b].push(a);
    }
  });
  Object.keys(adj).forEach(k=>adj[k].sort((a,b)=>String(a).localeCompare(String(b),undefined,{numeric:true})));
  const start=graphStart;
  if(!adj[start]) return;
  const visited=new Set(), order=[];

  if(mode==='bfs'){
    const queue=[start];
    visited.add(start);
    add('graph',{visited:[...visited],active:start,queue:[...queue],order:[...order],phase:'start'},
      `Start at ${start}. Add ${start} to the queue.`, '🚩');
    while(queue.length){
      const u=queue.shift();
      order.push(u);
      add('graph',{visited:[...visited],active:u,queue:[...queue],order:[...order],phase:'visit'},
        `Visit ${u}. Remove it from the front of the queue.`, '📥');
      for(const v of adj[u]){
        add('graph',{visited:[...visited],active:u,queue:[...queue],order:[...order],edge:[u,v],phase:'inspect'},
          `Inspect edge ${u} → ${v}.`, '🔎');
        if(visited.has(v)){
          add('graph',{visited:[...visited],active:u,queue:[...queue],order:[...order],edge:[u,v],phase:'skip'},
            `${v} is already visited, so skip this edge.`, '↩️');
          continue;
        }
        visited.add(v);
        queue.push(v);
        add('graph',{visited:[...visited],active:v,queue:[...queue],order:[...order],edge:[u,v],phase:'discover'},
          `Discover ${v}. Mark it visited and add it to the queue.`, '➕');
      }
    }
  } else {
    function dfs(u,parent=null){
      visited.add(u);
      order.push(u);
      add('graph',{visited:[...visited],active:u,order:[...order],edge:parent?[parent,u]:null,phase:'visit'},
        parent ? `Move from ${parent} to ${u}. Visit ${u}.` : `Start at ${u}. Mark it visited.`, '🧭');
      for(const v of adj[u]){
        add('graph',{visited:[...visited],active:u,order:[...order],edge:[u,v],phase:'inspect'},
          `Inspect edge ${u} → ${v}.`, '🔎');
        if(visited.has(v)){
          add('graph',{visited:[...visited],active:u,order:[...order],edge:[u,v],phase:'skip'},
            `${v} is already visited, so skip this edge.`, '↩️');
          continue;
        }
        dfs(v,u);
      }
      if(parent){
        add('graph',{visited:[...visited],active:u,order:[...order],backtrack:[u,parent],phase:'backtrack'},
          `No unvisited neighbor remains at ${u}. Backtrack to ${parent}.`, '↩️');
      }
    }
    dfs(start);
  }
  add('graph',{visited:[...visited],order:[...order],phase:'complete'},
    `🎉 Traversal complete: ${order.join(' → ')}`, '🎉');
}
function prepare(){stop();if(!parseData())return;idx=0;if(current==="bubble")makeBubble();else if(current==="merge")makeMerge();else if(current==="binary")makeBinary();else makeGraph(current);stepCount.textContent="0";totalSteps.textContent=` / ${steps.length}`;message.textContent="Ready — press Play to begin.";stepIcon.textContent="💡";renderInitial()}
function renderInitial(){if(current==="bfs"||current==="dfs")renderGraph({visited:[],order:[]});else if(current==="merge")renderMerge({a:array});else if(current==="binary")renderBinary({a:[...array].sort((a,b)=>a-b),l:0,r:array.length-1,m:-1});else renderArray(array,{})}
function addBannerArrow(cell,kind,label){const ar=document.createElement("div");ar.className="cell-arrow";ar.innerHTML=`<span>${label}</span>${kind}`;cell.appendChild(ar)}
function renderArray(vals,s={}){visualizer.innerHTML="";const stage=document.createElement("div");stage.className="array-stage";visualizer.appendChild(stage);vals.forEach((v,i)=>{const c=document.createElement("div");c.className="array-cell";c.textContent=v;if(s.compare?.includes(i))c.classList.add("comparing");if(s.active?.includes?.(i)||s.active===i)c.classList.add("active");if(s.done?.includes?.(i)||s.done===i||s.all)c.classList.add("done");if(s.target===i)c.classList.add("target");if(s.outside?.includes(i))c.classList.add("outside");const ind=document.createElement("div");ind.className="index";ind.textContent=`index ${i}`;c.appendChild(ind);stage.appendChild(c)});if(s.move){const a=stage.querySelectorAll(".array-cell");if(a[s.move[0]])addBannerArrow(a[s.move[0]],"↔","SWAP");if(a[s.move[1]])addBannerArrow(a[s.move[1]],"↔","")}if(s.discard){const a=stage.querySelectorAll(".array-cell");const mid=Math.floor((s.discard[0]+s.discard[1])/2);if(a[mid])addBannerArrow(a[mid],s.discard[0]<mid?"↗":"↖",s.discard[0]<mid?"KEEP RIGHT":"KEEP LEFT")}}
function renderMerge(s){
 visualizer.innerHTML="";
 const wrap=document.createElement("div");wrap.className="merge-layout";
 const a=s.a||array;
 if(s.all){
  const title=document.createElement("div");title.className="merge-label merge-title";title.textContent="FINAL SORTED ARRAY";;wrap.appendChild(title);
  const row=document.createElement("div");row.className="merge-row final-row pulse-merge";a.forEach((v,i)=>row.appendChild(cell(v,i,"done")));wrap.appendChild(row);visualizer.appendChild(wrap);return;
 }
 const l=s.l??0,r=s.r??a.length-1,m=s.m??Math.floor((l+r)/2);
 const section=a.slice(l,r+1);
 const title=document.createElement("div");title.className="merge-label merge-title";
 title.textContent=s.phase==="split"?"SPLITTING THIS SECTION":s.phase==="merged"?"MERGED + SORTED":"WORKING ON THIS SECTION";
 wrap.appendChild(title);
 // Keep the complete array visible in the background so the learner never loses context.
 const overview=document.createElement("div");overview.className="merge-overview";
 const overviewLabel=document.createElement("div");overviewLabel.className="merge-context-label";overviewLabel.textContent="FULL ARRAY • CONTEXT";overview.appendChild(overviewLabel);
 const overviewRow=document.createElement("div");overviewRow.className="merge-row merge-context-row";
 a.forEach((v,i)=>{const c=cell(v,i);c.classList.add("context-cell");if(i>=l&&i<=r)c.classList.add("context-active");overviewRow.appendChild(c)});
 overview.appendChild(overviewRow);wrap.appendChild(overview);
 if(s.phase==="split"){
  const source=document.createElement("div");source.className="merge-row merge-source split-active";
  section.forEach((v,i)=>{const c=cell(v,l+i,"split-pop");c.classList.add("merge-splitting");source.appendChild(c)});
  wrap.appendChild(source);
  const arrow=document.createElement("div");arrow.className="split-arrow active-split";arrow.innerHTML="↓<span>SPLIT</span>↓";wrap.appendChild(arrow);
  const groups=document.createElement("div");groups.className="merge-groups";
  const left=document.createElement("div");left.className="merge-bracket split-group left-group";s.left.forEach((v,i)=>left.appendChild(cell(v,l+i,"split-pop")));
  const right=document.createElement("div");right.className="merge-bracket split-group right-group";s.right.forEach((v,i)=>right.appendChild(cell(v,m+1+i,"split-pop")));
  groups.append(left,right);wrap.appendChild(groups);
 } else if(s.phase==="single"){
  const row=document.createElement("div");row.className="merge-row single-row";row.appendChild(cell(a[l],l,"single-pop"));wrap.appendChild(row);
 } else {
  const groups=document.createElement("div");groups.className="merge-groups";
  const left=document.createElement("div");left.className="merge-bracket merge-group";s.left?.forEach((v,i)=>{const c=cell(v,l+i);if(s.compareValues?.includes(v))c.classList.add("comparing");left.appendChild(c)});
  const right=document.createElement("div");right.className="merge-bracket merge-group";s.right?.forEach((v,i)=>{const c=cell(v,m+1+i);if(s.compareValues?.includes(v))c.classList.add("comparing");right.appendChild(c)});
  groups.append(left,right);wrap.appendChild(groups);
  const action=document.createElement("div");action.className="merge-action";
  if(s.phase==="compare") action.innerHTML=`<span class="merge-arrow">↓</span> Compare <b>${s.compareValues[0]}</b> and <b>${s.compareValues[1]}</b>`;
  else if(s.phase==="place") action.innerHTML=`<span class="merge-arrow placing">↓</span> Place <b class="placed-number">${s.placed}</b> at index <b>${s.place}</b>`;
  else if(s.phase==="merged") action.innerHTML=`<span class="merge-arrow">↑</span> <b>${section.join(" , ")}</b> is sorted`;
  else action.textContent=`Merge [${s.left?.join(", ")||""}] + [${s.right?.join(", ")||""}]`;
  wrap.appendChild(action);
  if(s.phase==="merged"){const row=document.createElement("div");row.className="merge-row merged-result pulse-merge";section.forEach((v,i)=>row.appendChild(cell(v,l+i,"merge-pop")));wrap.appendChild(row);}
 }
 visualizer.appendChild(wrap);
}
function cell(v,i,state){const c=document.createElement("div");c.className="array-cell";if(state)c.classList.add(state);c.textContent=v;const ind=document.createElement("div");ind.className="index";ind.textContent=i;c.appendChild(ind);return c}
function renderBinary(s){visualizer.innerHTML="";const wrap=document.createElement("div");wrap.className="binary-layout";const row=document.createElement("div");row.className="binary-array";s.a.forEach((v,i)=>{const c=cell(v,i);if(i<s.l||i>s.r)c.classList.add("outside");if(i===s.m)c.classList.add(s.found?"target":"active");if(i===s.m)addBannerArrow(c,"↓",`MID • ${v}`);row.appendChild(c)});wrap.appendChild(row);const range=document.createElement("div");range.className="binary-range";range.innerHTML=`<span>LOW <b>${Math.max(0,s.l)}</b></span><span>MID <b>${s.m>=0?s.m:"—"}</b></span><span>HIGH <b>${Math.max(-1,s.r)}</b></span>`;wrap.appendChild(range);const action=document.createElement("div");action.className="binary-action";if(s.discard)action.innerHTML=`<div class="binary-arrow">${s.discard[0]<s.m?"↗":"↖"}</div>Half outside the active range is faded`;else if(s.found)action.textContent="🎯 Target found at MID";else action.textContent="Search the active range";wrap.appendChild(action);visualizer.appendChild(wrap)}
function renderGraph(s){
  visualizer.innerHTML='';
  const wrap=document.createElement('div');
  wrap.className='graph';
  const pos={};
  graphNodes.forEach(([name,x,y])=>pos[name]={x,y});

  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('class','graph-svg');
  svg.setAttribute('viewBox','0 0 100 100');
  svg.setAttribute('preserveAspectRatio','none');
  const defs=document.createElementNS('http://www.w3.org/2000/svg','defs');
  const marker=document.createElementNS('http://www.w3.org/2000/svg','marker');
  marker.setAttribute('id','graphArrow'); marker.setAttribute('viewBox','0 0 10 10');
  marker.setAttribute('refX','8'); marker.setAttribute('refY','5'); marker.setAttribute('markerWidth','5'); marker.setAttribute('markerHeight','5'); marker.setAttribute('orient','auto-start-reverse');
  const path=document.createElementNS('http://www.w3.org/2000/svg','path'); path.setAttribute('d','M 0 0 L 10 5 L 0 10 z'); marker.appendChild(path); defs.appendChild(marker); svg.appendChild(defs);

  graphEdges.forEach(([a,b])=>{
    const A=pos[a],B=pos[b]; if(!A||!B)return;
    const line=document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1',A.x); line.setAttribute('y1',A.y); line.setAttribute('x2',B.x); line.setAttribute('y2',B.y);
    line.setAttribute('class','graph-edge-line');
    if(s.edge && ((s.edge[0]===a&&s.edge[1]===b)||(s.edge[0]===b&&s.edge[1]===a))) line.classList.add('active');
    svg.appendChild(line);
  });
  if(s.backtrack){
    const A=pos[s.backtrack[0]],B=pos[s.backtrack[1]];
    if(A&&B){const line=document.createElementNS('http://www.w3.org/2000/svg','line');line.setAttribute('x1',A.x);line.setAttribute('y1',A.y);line.setAttribute('x2',B.x);line.setAttribute('y2',B.y);line.setAttribute('class','graph-back-line');line.setAttribute('marker-end','url(#graphArrow)');svg.appendChild(line);}
  }
  wrap.appendChild(svg);

  graphNodes.forEach(([name,x,y])=>{
    const d=document.createElement('div'); d.className='node'; d.style.left=`calc(${x}% - 31px)`; d.style.top=`calc(${y}% - 31px)`; d.textContent=name;
    if((s.visited||[]).includes(name))d.classList.add('visited');
    if(s.active===name)d.classList.add('active');
    if(name===graphStart)d.classList.add('start');
    wrap.appendChild(d);
  });

  if(s.edge){
    const A=pos[s.edge[0]],B=pos[s.edge[1]];
    if(A&&B){const ar=document.createElement('div');ar.className='node-arrow';ar.style.left=`${(A.x+B.x)/2}%`;ar.style.top=`${(A.y+B.y)/2}%`;ar.textContent=s.phase==='inspect'?'→':s.phase==='discover'?'➜':'↔';wrap.appendChild(ar);}
  }

  const ord=document.createElement('div'); ord.className='graph-order';
  ord.innerHTML=`<span>TRAVERSAL ORDER</span><strong>${(s.order||[]).join(' → ')||'—'}</strong>`;
  wrap.appendChild(ord);
  visualizer.appendChild(wrap);
  visitedArray.innerHTML=(s.visited||[]).map((v,i)=>`<div class="visit-chip ${i===(s.visited.length-1)?'current':'done'}">${v}</div>`).join('');
  queueInfo.textContent=current==='bfs'?`Queue: ${(s.queue||[]).join(' → ')||'empty'}`:`Visited so far: ${(s.visited||[]).join(' → ')||'none'}`;
}
function render(st){if(!st)return;message.textContent=st.text;stepIcon.textContent=st.icon||"👀";if(st.type==="graph")renderGraph(st.data);else if(st.type==="merge")renderMerge(st.data);else if(st.type==="binary")renderBinary(st.data);else renderArray(st.data.a,st.data)}
const delays=[5000,3500,2200,1300,650,300,120],names=["Study Ultra Slow","Study Extra Slow","Study Slow","Very Slow","Slow","Medium","Fast"];function delay(){return delays[Number(speed.value)-1]}function tick(){if(!playing)return;if(idx>=steps.length){stop();return}render(steps[idx]);stepCount.textContent=String(++idx);timer=setTimeout(tick,delay())}function play(){if(playing)return;if(!steps.length){prepare();if(!steps.length)return}playing=true;tick()}function stop(){playing=false;clearTimeout(timer)}function pause(){stop();if(idx>0)render(steps[idx-1]);const p=visualizer.querySelector(".pause-badge");if(p)p.remove();const b=document.createElement("div");b.className="pause-badge";b.textContent="⏸ PAUSED — read this step, then press Play";visualizer.appendChild(b)}
document.querySelectorAll(".algo").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".algo").forEach(x=>x.classList.remove("active"));b.classList.add("active");current=b.dataset.algo;setInfo();prepare()}));applyBtn.addEventListener("click",prepare);resetBtn.addEventListener("click",prepare);playBtn.addEventListener("click",play);pauseBtn.addEventListener("click",pause);randomBtn.addEventListener("click",()=>{if(current==="bfs"||current==="dfs"){dataInput.value="0-1, 0-2, 1-3, 1-4, 2-5";sourceInput.value="0";}else{dataInput.value=Array.from({length:10},()=>Math.floor(Math.random()*90)+10).join(", ");if(current==="binary"){const n=dataInput.value.split(",").map(Number);targetInput.value=n[Math.floor(Math.random()*n.length)]}}prepare()});speed.addEventListener("input",()=>speedValue.textContent=names[Number(speed.value)-1]);
document.addEventListener("keydown",e=>{
 if(e.ctrlKey && e.key.toLowerCase()==="k"){
  e.preventDefault();
  if(playing) pause(); else play();
 }
});
setInfo();prepare();
