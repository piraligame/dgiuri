'use strict';
const KEY='dgiuri_web_v011';
const LANGS=[['ka','ქართული'],['en','English'],['ru','Русский'],['zh','中文'],['es','Español'],['de','Deutsch'],['fr','Français']];
const L={
 home:['დღეს','Today','Сегодня','今天','Hoy','Heute',"Aujourd’hui"],
 calendar:['კალენდარი','Calendar','Календарь','日历','Calendario','Kalender','Calendrier'],
 joker:['ჯოკერი','Joker','Джокер','小丑','Joker','Joker','Joker'],
 timer:['ტაიმერი','Timer','Таймер','计时器','Temporizador','Timer','Minuteur'],
 alarm:['მაღვიძარა','Alarm','Будильник','闹钟','Alarma','Wecker','Réveil'],
 insights:['შედეგები','Results','Результаты','统计','Resultados','Ergebnisse','Résultats'],
 settings:['პარამეტრები','Settings','Настройки','设置','Ajustes','Einstellungen','Réglages'],
 day:['დღე','Day','День','日','Día','Tag','Jour'],
 week:['კვირა','Week','Неделя','周','Semana','Woche','Semaine'],
 month:['თვე','Month','Месяц','月','Mes','Monat','Mois'],
 year:['წელი','Year','Год','年','Año','Jahr','Année'],
 add:['დამატება','Add','Добавить','添加','Añadir','Hinzufügen','Ajouter'],
 today:['დღეს','Today','Сегодня','今天','Hoy','Heute',"Aujourd’hui"],
 title:['სათაური','Title','Название','标题','Título','Titel','Titre'],
 save:['შენახვა','Save','Сохранить','保存','Guardar','Speichern','Enregistrer'],
 cancel:['გაუქმება','Cancel','Отмена','取消','Cancelar','Abbrechen','Annuler'],
 history:['ისტორია','History','История','历史','Historial','Verlauf','Historique']
};
const ICONS={home:'⌂',calendar:'▦',joker:'♠',timer:'⏱',alarm:'⏰',insights:'▥',settings:'⚙'};
const DEFAULT=()=>({tasks:[],theme:'light',lang:'ka',reminderDefault:5,quiet:false,
 joker:{names:['მოთამაშე 1','მოთამაშე 2','მოთამაშე 3','მოთამაშე 4'],rounds:[],matches:[]},
 timerUntil:0,alarm:{enabled:false,h:'08',m:'00',label:'მაღვიძარა',next:0,last:0}});
function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||'null');const d=DEFAULT();if(!x||typeof x!=='object')return d;return {...d,...x,tasks:Array.isArray(x.tasks)?x.tasks:[],joker:{...d.joker,...(x.joker||{})},alarm:{...d.alarm,...(x.alarm||{})}}}catch{return DEFAULT()}}
let state=load();let ui={page:'home',date:todayKey(),view:'day',filter:'all',sort:'time',search:'',history:true,toastTimeout:0,timerInputs:['0','5','0']};
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{notify('ვერ მოხერხდა ბრაუზერში შენახვა')}}
function txt(key){const arr=L[key];return arr?(arr[LANGS.findIndex(a=>a[0]===state.lang)]||arr[0]):key}
function E(x){return String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function attr(x){return E(x)}
function pad(n){return String(n).padStart(2,'0')}
function keyOf(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
function todayKey(){return keyOf(new Date())}
function D(key){const a=(key||todayKey()).split('-').map(Number);return new Date(a[0],a[1]-1,a[2],12)}
function shift(key,n,unit){const d=D(key);if(unit==='week')d.setDate(d.getDate()+7*n);else if(unit==='month')d.setMonth(d.getMonth()+n);else if(unit==='year')d.setFullYear(d.getFullYear()+n);else d.setDate(d.getDate()+n);return keyOf(d)}
function monthText(date,opts){const locale=state.lang==='ka'?'ka-GE':state.lang;return new Intl.DateTimeFormat(locale,opts||{month:'long',year:'numeric'}).format(D(date))}
function weekday(date){return new Intl.DateTimeFormat(state.lang==='ka'?'ka-GE':state.lang,{weekday:'short'}).format(D(date))}
function uid(){return 't_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8)}
function occurs(task,date){if(date<task.date)return false;if(!task.repeat||task.repeat==='none')return date===task.date;
 if(task.repeat==='daily')return true;
 if(task.repeat==='weekly')return Math.round((D(date)-D(task.date))/86400000)%7===0;
 if(task.repeat==='monthly')return D(date).getDate()===D(task.date).getDate();
 return date===task.date;
}
function done(task,date){return (task.done||[]).includes(date)}
function tasksFor(date){return state.tasks.filter(t=>occurs(t,date)).sort((a,b)=>(a.time||'99:99').localeCompare(b.time||'99:99')||a.title.localeCompare(b.title))}
function tally(date){const a=tasksFor(date);return {all:a.length,done:a.filter(t=>done(t,date)).length}}
function notify(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('show');clearTimeout(ui.toastTimeout);ui.toastTimeout=setTimeout(()=>el.classList.remove('show'),3300)}
function button(text,action,cls,extra){return '<button class="'+(cls||'btn')+'" data-action="'+action+'" '+(extra||'')+'>'+text+'</button>'}
function card(x,cls){return '<section class="card '+(cls||'')+'">'+x+'</section>'}
function navDate(unit){const date=ui.date;const yr=unit==='year';return '<div class="date-nav">'+
 button('‹','date-prev','date-arrow','aria-label="წინა"')+
 '<div class="date-title"><strong>'+(yr?D(date).getFullYear():monthText(date,unit==='month'?{month:'long',year:'numeric'}:{day:'numeric',month:'long',year:'numeric'}))+'</strong><small>'+(yr?'12 თვის მიმოხილვა':weekday(date))+'</small></div>'+
 button('›','date-next','date-arrow','aria-label="შემდეგი"')+button(txt('today'),'date-today','btn ghost small')+'</div>'}
function taskItem(t,date){const checked=done(t,date);const rank=Number((t.priority||{})[date]||0);
 return '<div class="task">'+
 '<input type="checkbox" data-action="toggle-done" data-id="'+attr(t.id)+'" '+(checked?'checked':'')+' aria-label="შესრულებული">'+
 '<div class="grow" data-action="edit-task" data-id="'+attr(t.id)+'" role="button" tabindex="0"><div class="title '+(checked?'done':'')+'">'+E(t.title)+'</div>'+
 '<div class="meta">'+(t.time?E(t.time)+' · ':'')+E(t.category||'პირადი')+(t.repeat&&t.repeat!=='none'?' · ↻':'')+(Number(t.reminder)>=0?' · ♩':'')+'</div></div>'+
 '<button class="star" data-action="priority" data-id="'+attr(t.id)+'" aria-label="TOP 3">'+(rank?'★':'☆')+'</button>'+
 '<button class="edit" data-action="edit-task" data-id="'+attr(t.id)+'" aria-label="რედაქტირება">✎</button></div>'}
function renderNav(){const names=['home','calendar','joker','timer','alarm','insights','settings'];document.querySelector('#nav').innerHTML=names.map(k=>
 '<button class="nav-item '+(ui.page===k?'active':'')+'" data-page="'+k+'" '+(ui.page===k?'aria-current="page"':'')+'><span class="ico">'+ICONS[k]+'</span><span>'+txt(k)+'</span></button>').join('')}
function render(){document.body.classList.toggle('dark',state.theme==='dark');document.documentElement.lang=state.lang;document.querySelector('#brand-name').textContent=state.lang==='ka'?'დღიური':'DGIURI';
 document.querySelector('#brand-sub').textContent=state.lang==='ka'?'შენი დღეები, ლამაზად დაგეგმილი':'Your days, beautifully planned';
 renderNav();const el=document.querySelector('#app');el.innerHTML=({home:renderHome,calendar:renderCalendar,joker:renderJoker,timer:renderTimer,alarm:renderAlarm,insights:renderInsights,settings:renderSettings}[ui.page]||renderHome)();
}
function head(title,desc,add){return '<div class="section-head"><div><h1>'+title+'</h1><p>'+desc+'</p></div>'+(add?button('＋','new-task','btn small'):'')+'</div>'}
function renderHome(){const list=tasksFor(ui.date);const count=tally(ui.date);const top=list.filter(t=>(t.priority||{})[ui.date]>0).sort((a,b)=>a.priority[ui.date]-b.priority[ui.date]);const overdue=state.tasks.filter(t=>!t.repeat||t.repeat==='none').filter(t=>t.date<todayKey()&&!done(t,t.date));
 let shown=list.filter(t=> (ui.search===''||(t.title+' '+(t.details||'')).toLowerCase().includes(ui.search.toLowerCase()))&&(ui.filter==='all'||(ui.filter==='done'&&done(t,ui.date))||(ui.filter==='open'&&!done(t,ui.date))));
 if(ui.sort==='name')shown.sort((a,b)=>a.title.localeCompare(b.title));if(ui.sort==='status')shown.sort((a,b)=>Number(done(a,ui.date))-Number(done(b,ui.date)));
 return head('ჩემი დღე','მთავარზე კონცენტრირდი',true)+navDate('day')+
 card('<div class="add-row"><input class="field grow" id="quick-title" placeholder="სწრაფად დაამატე საქმე..." maxlength="160" aria-label="სწრაფი დამატება">'+button('＋','quick-add','btn')+'</div>')+
 (ui.date===todayKey()&&overdue.length?card('<h2>დაგვიანებული საქმეები · '+overdue.length+'</h2>'+overdue.slice(0,4).map(t=>'<div class="row between"><div><strong>'+E(t.title)+'</strong><br><small>'+E(t.date)+'</small></div>'+button('დღეს გადმოტანა','move-today','btn outline small','data-id="'+attr(t.id)+'"')+'</div>').join('')):'')+
 card('<div class="row between"><h2>★ TOP 3</h2><strong style="color:var(--pine)">'+top.length+'/3</strong></div>'+
 (top.length?top.map((t,i)=>'<div class="top-entry"><b>'+(i+1)+'.</b><span class="grow">'+E(t.title)+'</span><button class="mini-btn" data-action="prio-up" data-id="'+attr(t.id)+'">↑</button><button class="mini-btn" data-action="prio-down" data-id="'+attr(t.id)+'">↓</button></div>').join(''):'<div class="empty">საქმეზე ☆ ვარსკვლავს დააჭირე — სამეულს მხოლოდ შენ ირჩევ.</div>'),'soft')+
 card('<div class="row between"><h2>საათობრივი განრიგი</h2><strong>'+count.done+'/'+count.all+'</strong></div>'+
 '<div class="bar"><span style="width:'+(count.all?(count.done/count.all*100):0)+'%"></span></div>'+
 '<div class="chipbar" style="margin-top:12px">'+[['time','დრო'],['name','სახელი'],['status','სტატუსი']].map(([v,n])=>'<button class="chip '+(ui.sort===v?'active':'')+'" data-sort="'+v+'">'+n+'</button>').join('')+'</div>'+
 '<div style="margin-top:12px"><input class="field" id="task-search" placeholder="საქმის ძიება..." value="'+attr(ui.search)+'"></div>'+
 '<div class="chipbar" style="margin-top:10px">'+[['all','ყველა'],['open','გასაკეთებელი'],['done','შესრულებული']].map(([v,n])=>'<button class="chip '+(ui.filter===v?'active':'')+'" data-filter="'+v+'">'+n+'</button>').join('')+'</div>'+
 (shown.length?shown.map(t=>taskItem(t,ui.date)).join(''):'<div class="empty">'+(list.length?'საქმე ვერ მოიძებნა.':'ამ დღისთვის ჯერ საქმე არ არის. დაამატე პირველი!')+'</div>'))+
 (ui.date===todayKey()?card('<div class="row between"><span>ხვალ · '+tasksFor(shift(ui.date,1)).filter(t=>!done(t,shift(ui.date,1))).length+' საქმე</span>'+button('ნახვა','tomorrow','btn ghost small')+'</div>'):'');
}
function renderCalendar(){const opts=['day','week','month','year'];let body='';const date=ui.date,selected=D(date);
 if(ui.view==='week'){const first=D(date);first.setDate(first.getDate()-((first.getDay()+6)%7));body='<div class="grid" style="grid-template-columns:repeat(7,minmax(0,1fr));gap:4px">'+Array.from({length:7},(_,i)=>{const dt=new Date(first);dt.setDate(dt.getDate()+i);const k=keyOf(dt);return '<button class="month-tile '+(k===date?'selected':'')+'" style="padding:10px 1px" data-date="'+k+'">'+weekday(k).slice(0,2)+'<br>'+dt.getDate()+(tasksFor(k).length?' •':'')+'</button>'}).join('')+'</div>'}
 if(ui.view==='month'){const first=new Date(selected.getFullYear(),selected.getMonth(),1,12);const offset=(first.getDay()+6)%7;first.setDate(1-offset);
 body='<div class="month-grid">'+['ორ','სამ','ოთხ','ხუთ','პარ','შაბ','კვ'].map(w=>'<span class="weekday">'+w+'</span>').join('')+
 Array.from({length:42},(_,i)=>{const dt=new Date(first);dt.setDate(dt.getDate()+i);const k=keyOf(dt);return '<button data-date="'+k+'" class="day-tile '+(dt.getMonth()!==selected.getMonth()?'outside ':'')+(k===date?'selected ':'')+(k===todayKey()?'today':'')+'">'+dt.getDate()+(tasksFor(k).length?'<span class="dot"></span>':'')+'</button>'}).join('')+'</div>'}
 if(ui.view==='year')body='<div class="year-grid">'+Array.from({length:12},(_,i)=>{const k=selected.getFullYear()+'-'+pad(i+1)+'-01';const n=state.tasks.filter(t=>t.date.startsWith(k.slice(0,7))).length;return '<button class="month-tile '+(i===selected.getMonth()?'selected':'')+'" data-month="'+(i+1)+'">'+monthText(k,{month:'short'})+'<small>'+(n?n+' საქმე':'—')+'</small></button>'}).join('')+'</div>';
 const tasks=tasksFor(date);
 return head(txt('calendar'),'დღე, კვირა, თვე და წელი',true)+
 '<div class="chipbar" style="margin-bottom:14px">'+opts.map(v=>'<button class="chip '+(ui.view===v?'active':'')+'" data-view="'+v+'">'+txt(v)+'</button>').join('')+'</div>'+
 navDate(ui.view)+(body?card(body):'')+
 card('<div class="row between"><h2>არჩეული დღის საქმეები</h2><span class="pill">'+tasks.length+'</span></div>'+(tasks.length?tasks.map(t=>taskItem(t,date)).join(''):'<div class="empty">საქმეები არ არის.</div>'));
}

const JCARDS=[1,2,3,4,5,6,7,8,9,9,9,9,8,7,6,5,4,3,2,1,9,9,9,9];
const JGROUPS=[[0,8],[8,12],[12,20],[20,24]];
function jpoints(n,b,t){if(b===n&&t===n)return n*100;if(b===t)return (b+1)*50;if(b>0&&t===0)return -200;return t*10}
function jokerScores(rounds){const groups=[],bonuses=[];for(const [from,to] of JGROUPS){const rs=rounds.slice(from,to),base=Array.from({length:4},(_,p)=>rs.reduce((sum,r)=>sum+jpoints(r.cards,r.bids[p],r.taken[p]),0)),bonus=[0,0,0,0];
 if(rs.length===to-from){const exact=[0,1,2,3].filter(p=>rs.every(r=>r.bids[p]===r.taken[p]));for(const p of exact){const v=Math.max(0,...rs.slice(0,-1).map(r=>jpoints(r.cards,r.bids[p],r.taken[p])));bonus[p]+=v}if(exact.length===1){for(let p=0;p<4;p++)if(p!==exact[0])bonus[p]-=Math.max(0,...rs.slice(0,-1).map(r=>jpoints(r.cards,r.bids[p],r.taken[p])))}}
 groups.push(base.map((v,i)=>v+bonus[i]));bonuses.push(bonus)}
 return {groups,bonuses,totals:[0,1,2,3].map(p=>groups.reduce((s,g)=>s+g[p],0))}}
function jokerRow(){const rounds=state.joker.rounds,n=rounds.length,score=jokerScores(rounds);return {n,cards:JCARDS[n]??0,score}}
function renderJoker(){const j=state.joker,{n,cards,score}=jokerRow();
 return head(txt('joker'),'4 მოთამაშე • 24 დარიგება • ქულები და ისტორია')+
 card('<h2>მიმდინარე პარტია · დარიგება '+Math.min(n+1,24)+'/24</h2><p class="small" style="margin-bottom:15px">კარტების რაოდენობა: <strong style="color:var(--pine)">'+cards+'</strong></p>'+
 '<div class="joker-row joker-head"><span>მოთამაშე</span><span>თქვა</span><span>აიღო</span><span style="text-align:right">ქულა</span></div>'+
 j.names.map((name,i)=>'<div class="joker-row"><input class="field" data-j-name="'+i+'" maxlength="28" aria-label="მოთამაშე '+(i+1)+'" value="'+attr(name)+'">'+
 '<input class="field" data-j-bid="'+i+'" type="number" inputmode="numeric" min="0" max="'+cards+'" value="0" aria-label="თქვა">'+
 '<input class="field" data-j-taken="'+i+'" type="number" inputmode="numeric" min="0" max="'+cards+'" value="0" aria-label="აიღო">'+
 '<span class="score">'+score.totals[i]+'</span></div>').join('')+
 '<p class="notice">აღებული ხელების ჯამი უნდა უდრიდეს დარიგებულ კარტებს ('+cards+').</p>'+
 button('დარიგების შენახვა','j-save','btn wide')+
 '<div style="margin-top:8px">'+button('ბოლო დარიგების დაბრუნება','j-undo','btn outline wide',n?'':'disabled')+'</div>')+
 card('<h2>პულკები • ჯამი და პრემია</h2>'+JGROUPS.map(([from,to],g)=>'<div class="joker-group"><div class="row between" style="margin-bottom:11px"><strong>პულკი '+(g+1)+'</strong><small>'+Math.max(0,Math.min(to-from,n-from))+'/'+(to-from)+'</small></div>'+
 '<div class="grid">'+j.names.map((name,p)=>'<div><small style="display:block">'+E(name)+'</small><strong>'+score.groups[g][p]+'</strong><small style="display:block">'+(score.bonuses[g][p]?'('+score.bonuses[g][p]+')':'—')+'</small></div>').join('')+'</div></div>').join(''))+
 card('<div class="row between"><h2>ნათამაშები პარტიები ('+j.matches.length+')</h2>'+button(ui.history?'დამალვა':'ნახვა','j-history','btn ghost small')+'</div>'+
 '<div class="row wrap" style="margin:12px 0">'+button('ისტორიის ექსპორტი','j-export','btn outline small')+button('იმპორტი','j-import','btn outline small')+'</div>'+
 (ui.history?(j.matches.length?j.matches.map((m,i)=>'<div class="played"><button class="played-open" data-action="j-details" data-index="'+i+'"><strong>'+E(m.date)+'</strong><small>'+m.names.map((name,p)=>E(name)+' '+m.points[p]).join(' • ')+'</small></button><button class="x" data-action="j-delete" data-index="'+i+'" aria-label="წაშლა">✕</button></div>').join(''):'<div class="empty">ჯერ ნათამაშები პარტია არ არის. 24 დარიგების შემდეგ აქ შეინახება.</div>'):'')+
 '<p class="notice">პასი = 50 • ზუსტად = (თქვა+1)×50 • ყველა კარტი = ×100 • ხიშტი = −200 • პულკის პრემია.</p>');
}
function timeLeft(deadline){const sec=Math.max(0,Math.ceil((Number(deadline)-Date.now())/1000));return pad(Math.floor(sec/3600))+':'+pad(Math.floor(sec/60)%60)+':'+pad(sec%60)}
function renderTimer(){const running=Number(state.timerUntil)>Date.now(),s=running?timeLeft(state.timerUntil):ui.timerInputs.map(v=>pad(Math.max(0,Number(v)||0))).join(':');
 return head(txt('timer'),'დროის უკუთვლა • ხმოვანი შეხსენება')+
 card('<div class="clock-display" id="timer-display">'+s+'</div>'+
 (running?button('გაუქმება / Cancel','timer-stop','btn outline wide'):
 '<div class="grid three">'+['საათი','წუთი','წამი'].map((n,i)=>'<label><span class="field-title">'+n+'</span><input class="field" data-timer-input="'+i+'" type="number" min="0" max="'+(i===0?'168':'59')+'" inputmode="numeric" value="'+attr(ui.timerInputs[i])+'"></label>').join('')+'</div>'+
 '<div style="margin-top:13px">'+button('დაწყება / Start','timer-start','btn wide')+'</div>')+
 '<p class="notice" style="margin-top:14px">ბრაუზერის ვერსიაში სიგნალი საიმედოდ მუშაობს მხოლოდ მაშინ, როცა გვერდი ღიაა; დახურულ ბრაუზერში Android-ის ფონის მაღვიძარა არ მუშაობს.</p>')+
 card('<h2>შეტყობინებები</h2><p class="small">ტაიმერის ხმა ტელეფონის ხმის რეჟიმზეა დამოკიდებული. ბეჭდვის შეტყობინებებისთვის საჭირო შეიძლება იყოს ბრაუზერის ნებართვა.</p><div style="margin-top:12px">'+button('შეტყობინებების დაშვება','notifications','btn outline small')+'</div>');
}
function formatDateTime(ts){return ts?new Intl.DateTimeFormat('ka-GE',{dateStyle:'medium',timeStyle:'short'}).format(new Date(ts)):'—'}
function renderAlarm(){const a=state.alarm;return head(txt('alarm'),'ყოველდღიური მაღვიძარა • დრო და სახელი')+
 card('<div class="clock-display">'+pad(a.h)+':'+pad(a.m)+'</div>'+
 '<div class="grid two"><label><span class="field-title">საათი</span><input class="field" type="number" min="0" max="23" data-alarm-h value="'+attr(a.h)+'"></label>'+
 '<label><span class="field-title">წუთი</span><input class="field" type="number" min="0" max="59" data-alarm-m value="'+attr(a.m)+'"></label></div>'+
 '<label style="display:block;margin-top:12px"><span class="field-title">მაღვიძარის სახელი</span><input class="field" data-alarm-label maxlength="80" value="'+attr(a.label)+'"></label>'+
 (a.enabled?'<p class="notice" style="color:var(--pine);margin-top:12px">● მაღვიძარა ჩართულია</p><p class="notice">შემდეგი: '+formatDateTime(a.next)+'</p><div style="margin-top:12px">'+button('გამორთვა','alarm-stop','btn outline wide')+'</div>':
 '<div style="margin-top:14px">'+button('მაღვიძარის ჩართვა','alarm-start','btn wide')+'</div>')+
 '<p class="notice" style="margin-top:13px">ბრაუზერი ვერ უზრუნველყოფს დარეკვას დახურულ გვერდზე. სრული ფონური მაღვიძარა მუშაობს მხოლოდ Android აპში.</p>');
}
function renderInsights(){const days=Array.from({length:7},(_,i)=>shift(todayKey(),i-6)),counts=days.map(tally),total=counts.reduce((s,x)=>s+x.all,0),finished=counts.reduce((s,x)=>s+x.done,0);
 const d=D(todayKey()),month=String(d.getFullYear())+'-'+pad(d.getMonth()+1);
 let mtotal=0,mdone=0;for(let i=1;i<=d.getDate();i++){const q=tally(month+'-'+pad(i));mtotal+=q.all;mdone+=q.done}
 let streak=0;for(let i=0;i<365;i++){const k=shift(todayKey(),-i),a=tally(k);if(a.done)streak++;else if(i===0)continue;else break}
 return head(txt('insights'),'ბოლო 7 დღის მიმოხილვა')+
 '<div class="stats" style="margin-bottom:14px"><div class="stat"><b>'+finished+'</b><span>შესრულებულია</span></div><div class="stat"><b>'+(total?Math.round(finished/total*100):0)+'%</b><span>შესრულება</span></div>'+
 '<div class="stat"><b>'+mdone+'/'+mtotal+'</b><span>ამ თვეში</span></div><div class="stat"><b>'+streak+'</b><span>აქტიური დღეები</span></div></div>'+
 card('<h2>დღიური აქტივობა</h2><div class="chart">'+days.map((k,i)=>'<div class="chart-col"><div class="chart-track"><i style="height:'+(counts[i].all?100*counts[i].done/counts[i].all:0)+'%"></i></div><span>'+weekday(k).slice(0,2)+'<br>'+counts[i].done+'/'+counts[i].all+'</span></div>').join('')+'</div>')+
 card('<h2>კვირის შეჯამება</h2><p class="small">'+(total?'შესრულებულია '+finished+' საქმე '+total+'-დან.':'შექმენი პირველი დავალება, რომ აქ გამოჩნდეს შედეგები.')+'</p>');
}
function renderSettings(){return head(txt('settings'),'მოარგე დღიური შენს გემოვნებას')+
 card('<div class="lines"><div class="setting-line"><strong>ეკრანის ფონი</strong><select id="theme-select" aria-label="ეკრანის ფონი">'+
 [['light','☀ ღია'],['dark','☾ შავი / მუქი']].map(([v,n])=>'<option value="'+v+'" '+(state.theme===v?'selected':'')+'>'+n+'</option>').join('')+'</select></div>'+
 '<div class="setting-line"><strong>ენა / Language</strong><select id="lang-select" aria-label="ენა">'+
 LANGS.map(([v,n])=>'<option value="'+v+'" '+(state.lang===v?'selected':'')+'>'+n+'</option>').join('')+'</select></div></div>')+
 card('<h2>შეხსენების ნაგულისხმევი რეჟიმი</h2><select class="field" id="reminder-select">'+
 [[-1,'გამორთული'],[0,'საქმის დაწყებისას'],[5,'5 წუთით ადრე'],[15,'15 წუთით ადრე'],[30,'30 წუთით ადრე'],[1440,'1 დღით ადრე']].map(([v,n])=>'<option value="'+v+'" '+(Number(state.reminderDefault)===v?'selected':'')+'>'+n+'</option>').join('')+'</select>'+
 '<p class="notice">არსებულ დავალებებს საკუთარი შეხსენების დრო უნარჩუნდება. ბრაუზერში Android-ის ფონური შეხსენებები არ მოქმედებს.</p>')+
 card('<h2>ჩუმი საათები</h2><label class="row"><input type="checkbox" id="quiet-checkbox" '+(state.quiet?'checked':'')+'><span class="small">შეხსენებების ჩუმი რეჟიმი (ბრაუზერული წინასწარი ნახვა)</span></label>')+
 card('<h2>ჩვენი საზოგადოება და თამაშები</h2>'+
 '<a class="friend-link" href="https://www.facebook.com/share/1FTD6S8ifN/" target="_blank" rel="noopener"><span class="logo blue">GGG</span><span class="grow"><strong>Georgian Gamers Guild</strong><small>Facebook • ჩვენი საზოგადოება</small></span><span class="arr">↗</span></a>'+
 '<a class="friend-link" href="https://play.google.com/apps/testing/ge.piraligame.pirali" target="_blank" rel="noopener"><span class="logo">ფ</span><span class="grow"><strong>PIRALI • ფირალი</strong><small>Google Play • მხოლოდ ტესტერებისთვის</small></span><span class="arr">↗</span></a>'+
 '<a class="friend-link" href="https://play.google.com/apps/testing/com.piraligame.georgia" target="_blank" rel="noopener"><span class="logo orange">GE</span><span class="grow"><strong>GEORGIA: Narikala Defense</strong><small>Google Play • მხოლოდ ტესტერებისთვის</small></span><span class="arr">↗</span></a>')+
 card('<h2>მონაცემები და კონფიდენციალურობა</h2><p class="small">ამ ვებვერსიის მონაცემები შენს ბრაუზერში ინახება და Android აპის მონაცემებთან არ სინქრონდება. შეგიძლია შენახვა ან აღდგენა JSON ფაილით.</p>'+
 '<div class="row wrap" style="margin-top:13px">'+button('ასლის შენახვა','backup-export','btn outline small')+button('ასლის აღდგენა','backup-import','btn outline small')+'</div>')+
 card('<p class="small"><strong>WEEKLY+ / დღიური α 0.11</strong><br>ეს არის GitHub Pages ბრაუზერული სატესტო ვერსია. Android-ის სისტემური შეტყობინებებისა და ფონური მაღვიძარის ყველა შესაძლებლობა აქ ვერ მუშაობს.</p>');
}

function openTask(id){const task=id?state.tasks.find(t=>t.id===id):null;
 const t=task||{title:'',date:ui.date,time:'',duration:0,category:'პირადი',repeat:'none',reminder:state.reminderDefault,details:''};
 const options=(arr,v)=>arr.map(([k,name])=>'<option value="'+k+'" '+(String(v)===String(k)?'selected':'')+'>'+name+'</option>').join('');
 document.querySelector('#overlay').innerHTML='<div class="modal" role="dialog" aria-modal="true" aria-label="საქმე">'+
 '<form id="task-form" data-edit-id="'+attr(task?.id||'')+'"><h2>'+(task?'საქმის რედაქტირება':'ახალი საქმე')+'</h2>'+
 '<div class="stack"><label><span class="field-title">'+txt('title')+'</span><input id="f-title" class="field" value="'+attr(t.title)+'" maxlength="160" required autofocus></label>'+
 '<div class="grid two"><label><span class="field-title">თარიღი</span><input id="f-date" class="field" type="date" value="'+attr(t.date)+'" required></label>'+
 '<label><span class="field-title">დრო</span><input id="f-time" class="field" type="time" value="'+attr(t.time||'')+'"></label></div>'+
 '<div class="grid two"><label><span class="field-title">ხანგრძლივობა</span><select id="f-duration" class="field">'+options([[0,'არ არის'],[15,'15 წუთი'],[30,'30 წუთი'],[60,'1 საათი'],[90,'1ს 30წ'],[120,'2 საათი']],t.duration)+'</select></label>'+
 '<label><span class="field-title">კატეგორია</span><select id="f-category" class="field">'+options([['პირადი','პირადი'],['სამუშაო','სამუშაო'],['ჯანმრთელობა','ჯანმრთელობა'],['სწავლა','სწავლა'],['საყიდლები','საყიდლები']],t.category)+'</select></label></div>'+
 '<div class="grid two"><label><span class="field-title">გამეორება</span><select id="f-repeat" class="field">'+options([['none','ერთჯერადი'],['daily','ყოველდღე'],['weekly','ყოველკვირა'],['monthly','ყოველთვე']],t.repeat)+'</select></label>'+
 '<label><span class="field-title">შეხსენება</span><select id="f-reminder" class="field">'+options([[-1,'გამორთული'],[0,'დაწყებისას'],[5,'5 წუთით ადრე'],[15,'15 წუთით ადრე'],[30,'30 წუთით ადრე'],[1440,'1 დღით ადრე']],t.reminder)+'</select></label></div>'+
 '<label><span class="field-title">შენიშვნა</span><textarea id="f-notes" class="field" rows="3">'+E(t.details||'')+'</textarea></label></div>'+
 '<footer>'+(task?button('წაშლა','delete-task','btn outline danger','type="button" data-id="'+attr(task.id)+'"'):'')+
 button(txt('cancel'),'close-overlay','btn ghost','type="button"')+
 '<button class="btn" type="submit">'+txt('save')+'</button></footer></form></div>';
 const f=document.querySelector('#f-title');if(f)f.focus();
}
function saveTaskForm(form){const title=document.querySelector('#f-title').value.trim(),date=document.querySelector('#f-date').value,time=document.querySelector('#f-time').value,reminder=Number(document.querySelector('#f-reminder').value);
 if(!title){notify('შეიყვანე სათაური');return}if(reminder>=0&&!time){notify('შეხსენებისთვის დრო აირჩიე');return}
 const id=form.dataset.editId,old=state.tasks.find(t=>t.id===id);
 const task={...old,id:old?.id||uid(),title,date,time,duration:Number(document.querySelector('#f-duration').value),category:document.querySelector('#f-category').value,
 repeat:document.querySelector('#f-repeat').value,reminder,details:document.querySelector('#f-notes').value,done:old?.done||[],priority:old?.priority||{}};
 if(old)state.tasks=state.tasks.map(t=>t.id===id?task:t);else state.tasks.push(task);
 save();closeOverlay();render();notify('საქმე შენახულია');
}
function closeOverlay(){document.querySelector('#overlay').innerHTML=''}
function getTask(id){return state.tasks.find(t=>t.id===id)}
function togglePriority(id){const task=getTask(id);if(!task)return;const date=ui.date;const all=tasksFor(date).filter(t=>(t.priority||{})[date]>0).sort((a,b)=>a.priority[date]-b.priority[date]);
 const existing=all.findIndex(t=>t.id===id);
 if(existing>=0){all.splice(existing,1);delete task.priority[date]}else{if(all.length>=3){notify('TOP 3 უკვე შევსებულია. ჯერ ერთი მოხსენი.');return}all.push(task)}
 all.forEach((t,i)=>{t.priority=t.priority||{};t.priority[date]=i+1});save();render();
}
function movePriority(id,change){const date=ui.date,all=tasksFor(date).filter(t=>(t.priority||{})[date]>0).sort((a,b)=>a.priority[date]-b.priority[date]);const i=all.findIndex(t=>t.id===id),j=i+change;
 if(i<0||j<0||j>=all.length)return;
 [all[i],all[j]]=[all[j],all[i]];all.forEach((t,n)=>{t.priority[date]=n+1});save();render();
}
function jSave(){const j=state.joker,n=j.rounds.length;if(n>=24){notify('პარტია უკვე დასრულებულია');return}
 j.names=Array.from({length:4},(_,p)=>document.querySelector('[data-j-name="'+p+'"]').value.trim().slice(0,28)||('მოთამაშე '+(p+1)));
 const bids=Array.from({length:4},(_,p)=>Number(document.querySelector('[data-j-bid="'+p+'"]').value));
 const taken=Array.from({length:4},(_,p)=>Number(document.querySelector('[data-j-taken="'+p+'"]').value));
 const cards=JCARDS[n];
 if([...bids,...taken].some(x=>!Number.isInteger(x)||x<0||x>cards)||taken.reduce((s,x)=>s+x,0)!==cards){notify('შეამოწმე კარტების რაოდენობა და აღებული ჯამი ('+cards+')');return}
 j.rounds.push({cards,bids,taken});
 if(j.rounds.length===24){const points=jokerScores(j.rounds).totals;
 j.matches.unshift({date:new Date().toLocaleString('ka-GE'),names:[...j.names],rounds:JSON.parse(JSON.stringify(j.rounds)),points});
 j.matches=j.matches.slice(0,150);j.rounds=[];notify('პარტია დასრულდა და შეინახა ისტორიაში');
 }else notify('დარიგება '+n+' შენახულია');save();render();
}
function showJokerDetails(i){const m=state.joker.matches[i];if(!m)return;
 document.querySelector('#overlay').innerHTML='<div class="modal" role="dialog" aria-modal="true"><h2>ჯოკერი • პარტიის შედეგი</h2><p class="small">'+E(m.date)+'</p><div style="margin-top:15px">'+m.names.map((name,p)=>'<div class="setting-line"><strong>'+E(name)+'</strong><strong>'+m.points[p]+'</strong></div>').join('')+'</div><p class="notice">24 დარიგება • 4 პულკი</p><footer>'+button('დახურვა','close-overlay','btn')+'</footer></div>';
}
function downloadJSON(name,payload){const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'});const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000)}
let importTarget='backup';
function alarmNext(h,m){const now=new Date(),at=new Date(now.getFullYear(),now.getMonth(),now.getDate(),h,m,0);if(at<=now)at.setDate(at.getDate()+1);return at.getTime()}
let audioCtx=null;
function unlockAudio(){try{if(!audioCtx){const A=window.AudioContext||window.webkitAudioContext;if(A)audioCtx=new A()}audioCtx?.resume()}catch{}}
function ring(title,message){unlockAudio();if(audioCtx){const start=audioCtx.currentTime;for(let i=0;i<4;i++){const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.frequency.value=790;osc.type='sine';gain.gain.setValueAtTime(0.001,start+i*.37);gain.gain.exponentialRampToValueAtTime(.2,start+i*.37+.02);gain.gain.exponentialRampToValueAtTime(.001,start+i*.37+.25);osc.connect(gain);gain.connect(audioCtx.destination);osc.start(start+i*.37);osc.stop(start+i*.37+.27)}}notify(title+' — '+message);
 if('Notification' in window && Notification.permission==='granted' && !state.quiet){try{new Notification(title,{body:message,icon:'./favicon.svg'})}catch{}}
}
function checkClocks(){if(state.timerUntil&&Date.now()>=state.timerUntil){state.timerUntil=0;save();ring('⏱ ტაიმერი','დრო ამოიწურა');if(ui.page==='timer')render()}
 if(state.alarm.enabled&&state.alarm.next&&Date.now()>=state.alarm.next){state.alarm.last=state.alarm.next;state.alarm.next=alarmNext(Number(state.alarm.h),Number(state.alarm.m));save();ring('⏰ მაღვიძარა',state.alarm.label);if(ui.page==='alarm')render()}
 if(ui.page==='timer'&&state.timerUntil){const e=document.querySelector('#timer-display');if(e)e.textContent=timeLeft(state.timerUntil)}
}
document.addEventListener('submit',e=>{if(e.target.id==='task-form'){e.preventDefault();saveTaskForm(e.target)}});
document.addEventListener('input',e=>{const el=e.target;if(el.id==='task-search'){ui.search=el.value;const position=el.selectionStart;render();const f=document.querySelector('#task-search');if(f){f.focus();f.setSelectionRange(position,position)}}
 if(el.dataset.timerInput!==undefined){ui.timerInputs[Number(el.dataset.timerInput)]=el.value;const display=document.querySelector('#timer-display');if(display)display.textContent=ui.timerInputs.map(v=>pad(Math.max(0,Number(v)||0))).join(':')}
});
document.addEventListener('change',e=>{const el=e.target;
 if(el.id==='theme-select'){state.theme=el.value;save();render()}
 if(el.id==='lang-select'){state.lang=el.value;save();render()}
 if(el.id==='reminder-select'){state.reminderDefault=Number(el.value);save();render()}
 if(el.id==='quiet-checkbox'){state.quiet=el.checked;save()}
 if(el.dataset.jName!==undefined){state.joker.names[Number(el.dataset.jName)]=el.value.trim().slice(0,28);save()}
});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='quick-title'){e.preventDefault();document.querySelector('[data-action="quick-add"]')?.click()}
 if(e.key==='Enter'&&e.target.matches('[role=button][data-action=edit-task]')){e.preventDefault();openTask(e.target.dataset.id)}});
document.addEventListener('click',async e=>{
 if(e.target.id==='overlay'){closeOverlay();return}
 const p=e.target.closest('[data-page]');if(p){ui.page=p.dataset.page;window.scrollTo(0,0);render();return}
 const date=e.target.closest('[data-date]');if(date){ui.date=date.dataset.date;render();return}
 const month=e.target.closest('[data-month]');if(month){ui.date=ui.date.slice(0,5)+pad(Number(month.dataset.month))+'-01';ui.view='month';render();return}
 const view=e.target.closest('[data-view]');if(view){ui.view=view.dataset.view;render();return}
 const sort=e.target.closest('[data-sort]');if(sort){ui.sort=sort.dataset.sort;render();return}
 const filter=e.target.closest('[data-filter]');if(filter){ui.filter=filter.dataset.filter;render();return}
 const b=e.target.closest('[data-action]');if(!b)return;
 const action=b.dataset.action,id=b.dataset.id;
 if(action==='date-prev'||action==='date-next'){ui.date=shift(ui.date,action==='date-prev'?-1:1,ui.page==='calendar'?ui.view:'day');render()}
 if(action==='date-today'){ui.date=todayKey();render()}
 if(action==='tomorrow'){ui.date=shift(ui.date,1);render()}
 if(action==='new-task')openTask();
 if(action==='close-overlay')closeOverlay();
 if(action==='edit-task')openTask(id);
 if(action==='delete-task'&&confirm('წავშალოთ ეს საქმე?')){state.tasks=state.tasks.filter(t=>t.id!==id);save();closeOverlay();render();notify('საქმე წაიშალა')}
 if(action==='quick-add'){const el=document.querySelector('#quick-title'),title=el?.value.trim();if(!title)return;state.tasks.push({id:uid(),title,date:ui.date,time:'',category:'პირადი',repeat:'none',reminder:-1,details:'',done:[],priority:{}});save();render();notify('საქმე დაემატა')}
 if(action==='toggle-done'){const t=getTask(id);if(t){t.done=t.done||[];t.done=t.done.includes(ui.date)?t.done.filter(x=>x!==ui.date):[...t.done,ui.date];save();render()}}
 if(action==='priority')togglePriority(id);
 if(action==='prio-up')movePriority(id,-1);
 if(action==='prio-down')movePriority(id,1);
 if(action==='move-today'){const t=getTask(id);if(t){t.date=todayKey();t.done=(t.done||[]).filter(x=>x!==t.date);save();render();notify('გადმოტანილია დღევანდელ დღეზე')}}
 if(action==='j-save')jSave();
 if(action==='j-undo'){if(state.joker.rounds.length){state.joker.rounds.pop();save();render();notify('ბოლო დარიგება დაბრუნდა')}}
 if(action==='j-history'){ui.history=!ui.history;render()}
 if(action==='j-details')showJokerDetails(Number(b.dataset.index));
 if(action==='j-delete'&&confirm('წაიშალოს ნათამაშები პარტია?')){state.joker.matches.splice(Number(b.dataset.index),1);save();render()}
 if(action==='j-export')downloadJSON('DGIURI_joker_history.json',{schema:2,matches:state.joker.matches});
 if(action==='j-import'){importTarget='joker';document.querySelector('#import-file').click()}
 if(action==='timer-start'){const values=ui.timerInputs.map(Number),seconds=values[0]*3600+values[1]*60+values[2];if(values.some(v=>!Number.isFinite(v)||v<0)||seconds<1||seconds>604800){notify('დრო უნდა იყოს 1 წამიდან 7 დღემდე');return}unlockAudio();state.timerUntil=Date.now()+seconds*1000;save();render();notify('ტაიმერი დაიწყო')}
 if(action==='timer-stop'){state.timerUntil=0;save();render()}
 if(action==='alarm-start'){const h=Number(document.querySelector('[data-alarm-h]').value),m=Number(document.querySelector('[data-alarm-m]').value),label=document.querySelector('[data-alarm-label]').value.trim()||'მაღვიძარა';if(!Number.isInteger(h)||h<0||h>23||!Number.isInteger(m)||m<0||m>59){notify('აირჩიე საათი 00:00–23:59');return}unlockAudio();state.alarm={enabled:true,h:pad(h),m:pad(m),label,next:alarmNext(h,m),last:state.alarm.last};save();render();notify('მაღვიძარა ჩართულია')}
 if(action==='alarm-stop'){state.alarm.enabled=false;save();render()}
 if(action==='notifications'){if(!('Notification' in window)){notify('ამ ბრაუზერს შეტყობინებების API არ აქვს');return}try{const result=await Notification.requestPermission();notify(result==='granted'?'შეტყობინებები დაშვებულია':'ბრაუზერმა ნებართვა არ გასცა')}catch{notify('შეტყობინებების ჩართვა ვერ მოხერხდა')}}
 if(action==='backup-export')downloadJSON('DGIURI_web_backup_'+todayKey()+'.json',{schema:'dgiuri-web-v011',state});
 if(action==='backup-import'){importTarget='backup';document.querySelector('#import-file').click()}
});
document.querySelector('#import-file').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;
 try{const json=JSON.parse(await file.text());
 if(importTarget==='joker'){if(json.schema!==2||!Array.isArray(json.matches))throw Error('არასწორი ისტორიის ფორმატია');const valid=json.matches.filter(m=>Array.isArray(m.names)&&m.names.length===4&&Array.isArray(m.rounds)&&m.rounds.length===24&&Array.isArray(m.points)&&m.points.length===4);
 const added=valid.filter(m=>!state.joker.matches.some(n=>n.date===m.date&&JSON.stringify(n.names)===JSON.stringify(m.names)));state.joker.matches.unshift(...added.slice(0,150));state.joker.matches=state.joker.matches.slice(0,150);save();render();notify('დაემატა '+added.length+' პარტია');
 }else{if(json.schema!=='dgiuri-web-v011'||!json.state||!Array.isArray(json.state.tasks))throw Error('არასწორი ასლის ფორმატია');if(!confirm('მიმდინარე ვებმონაცემები ჩანაცვლდება. გაგრძელება?'))return;const fresh=DEFAULT();state={...fresh,...json.state,joker:{...fresh.joker,...(json.state.joker||{})},alarm:{...fresh.alarm,...(json.state.alarm||{})}};save();render();notify('მონაცემები აღდგენილია')}
 }catch(err){notify(err.message||'ფაილის წაკითხვა ვერ მოხერხდა')}finally{e.target.value=''}
});
render();checkClocks();setInterval(checkClocks,500);
