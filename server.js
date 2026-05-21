const express=require('express');const fs=require('fs');const app=express();const PORT=process.env.PORT||3000;
app.use(express.json());app.use(express.static('public'));
const f=(n,d)=>!fs.existsSync(n)&&fs.writeFileSync(n,JSON.stringify(d));
f('tokens.json',{used:[]});f('inventory.json',{お菓子:50});f('history.json',[]);f('count.json',{count:0});
const PASS='gakuen123';
app.post('/admin/login',(req,res)=>res.json({success:req.body.password===PASS}));
app.post('/count',(q,r)=>{let d=JSON.parse(fs.readFileSync('count.json'));d.count++;fs.writeFileSync('count.json',JSON.stringify(d));r.json(d)});
app.get('/count',(q,r)=>r.json(JSON.parse(fs.readFileSync('count.json'))));
app.post('/lottery',(q,r)=>{let inv=JSON.parse(fs.readFileSync('inventory.json'));let a=Object.keys(inv).filter(k=>inv[k]>0);if(a.length==0)return r.json({prize:'在庫切れ'});
let p=a[Math.floor(Math.random()*a.length)];inv[p]--;fs.writeFileSync('inventory.json',JSON.stringify(inv));
let t=Math.random().toString(36).slice(2);let h=JSON.parse(fs.readFileSync('history.json'));h.push({token:t,prize:p,time:new Date()});fs.writeFileSync('history.json',JSON.stringify(h));
r.json({prize:p,token:t});});
app.post('/use',(q,r)=>{let d=JSON.parse(fs.readFileSync('tokens.json'));if(d.used.includes(q.body.token))return r.json({success:false});d.used.push(q.body.token);fs.writeFileSync('tokens.json',JSON.stringify(d));r.json({success:true});});
app.get('/inventory',(q,r)=>r.json(JSON.parse(fs.readFileSync('inventory.json'))));
app.post('/inventory',(q,r)=>{let d=JSON.parse(fs.readFileSync('inventory.json'));d[q.body.name]=q.body.stock;fs.writeFileSync('inventory.json',JSON.stringify(d));r.json({success:true});});
app.get('/history',(q,r)=>r.json(JSON.parse(fs.readFileSync('history.json')).reverse()));
app.listen(PORT,()=>console.log('RUN'))