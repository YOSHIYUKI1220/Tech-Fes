const MAX=10;let s=JSON.parse(localStorage.getItem('s')||'[]'),sc;
if(!localStorage.visited){fetch('/count',{method:'POST'});localStorage.visited=1}
function save(){localStorage.setItem('s',JSON.stringify(s))}
function msg(t){let d=document.createElement('div');d.innerText=t;Object.assign(d.style,{position:'fixed',top:'20px',left:'50%',transform:'translateX(-50%)',background:'#333',color:'#fff',padding:'10px'});document.body.append(d);setTimeout(()=>d.remove(),2000)}
function draw(){document.getElementById('progress').innerText=`${s.length}/${MAX}`;let h='';for(let i=1;i<=MAX;i++){let img=s.includes(i)?`images/stamp${i}.png`:'images/stamp_off.png';h+=`<img src='${img}' width='50'>`}document.getElementById('stamps').innerHTML=h;
if(s.length===MAX)document.getElementById('clear').style.display='block'}
function scan(){sc=new Html5Qrcode('reader');sc.start({facingMode:'environment'},{fps:10,qrbox:250},txt=>{let m=txt.match(/stamp\/(\d+)/);if(!m)return msg('無効');let id=+m[1];
if(!s.includes(id)){s.push(id);save();draw();document.getElementById('ok').play();msg('取得');}
else{document.getElementById('ng').play();msg('取得済み');}sc.stop();reader.innerHTML='';});}
async function lottery(){let r=await fetch('/lottery',{method:'POST'});let d=await r.json();result.innerHTML=`<h2>${d.prize}</h2><button onclick="use('${d.token}')">OK</button>`}
async function use(t){let r=await fetch('/use',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:t})});let d=await r.json();if(d.success){msg('完了');localStorage.clear();location.reload()}}
draw();