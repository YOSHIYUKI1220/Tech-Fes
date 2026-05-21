const MAX=10;
let stamps=JSON.parse(localStorage.getItem('stamps')||'[]');
let scanner;

function save(){localStorage.setItem('stamps',JSON.stringify(stamps));}

function render(){
 document.getElementById('progress').innerText=`進捗 ${stamps.length}/${MAX}`;
 let html='';
 for(let i=1;i<=MAX;i++){html+=stamps.includes(i)?'✅':'⬜';}
 document.getElementById('stamps').innerHTML=html;
 if(stamps.length===MAX){document.getElementById('clear').style.display='block';}
}

function startScan(){
 scanner=new Html5Qrcode('reader');
 scanner.start({facingMode:'environment'},{fps:10,qrbox:250},(txt)=>{
   const m=txt.match(/stamp\/(\d+)/);
   if(!m)return alert('無効');
   const id=Number(m[1]);
   if(!stamps.includes(id)){stamps.push(id);save();render();}
   scanner.stop();
 },()=>{});
}

async function lottery(){
 const res=await fetch('/lottery',{method:'POST'});
 const data=await res.json();
 document.getElementById('result').innerHTML=`<h3>${data.prize}</h3><button onclick="useToken('${data.token}')">受取</button>`;
}

async function useToken(t){
 const res=await fetch('/use',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:t})});
 const d=await res.json();
 if(d.success){alert('完了');localStorage.clear();location.reload();}
}

render();