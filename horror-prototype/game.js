(function(){
  "use strict";
  var cases=[
    {time:"00:17",title:"닫힌 출구",cam:0,caller:"내선 204 · 발신 위치 미상",quote:"“2번 출구가 열렸어요. 밖으로 나가도 된다고 안내해 주세요.”",sub:"통화선 뒤편에서 셔터가 올라가는 소리가 들린다.",rows:[["00:10","2번 출구","전기 공사 구역","폐쇄"],["00:30","역무 점검","출구 잠금 확인","예정"],["00:45","막차","전 구간 운행 종료","완료"]],record:"C01 영상 기록: 00:16 셔터 잠금 확인. 출구 앞 보행자 없음.",caption:"철제 셔터가 내려와 있다.",correct:0,options:[["2번 출구는 폐쇄되었습니다.","셔터 잠금등이 초록색으로 바뀐다. 전화선의 숨소리가 멎었다."],["2번 출구가 열렸습니다. 밖으로 나가셔도 됩니다.","셔터가 소리 없이 올라간다. 카메라에 없던 바깥 풍경이 열린다."],["방송하지 않고 통화를 종료한다.","수화기에서 발신음이 이어진다. 수화기를 내려놓았는데도."]]},
    {time:"00:26",title:"없는 열차",cam:1,caller:"승강장 비상 전화 · 위치 확인",quote:"“3번 승강장입니다. 열차가 들어온다고 안내해 주세요. 곧 도착한대요.”",sub:"통화 중 저주파 진동이 들리지만 책상 위 컵의 물은 흔들리지 않는다.",rows:[["00:21","3번 승강장","막차 운행 취소","취소"],["00:26","선로 점검","진입 열차 없음","진행 중"],["00:45","전 구간","운행 종료","완료"]],record:"C02 영상 기록: 선로와 플랫폼에 움직임 없음. 진동 감지기 정상.",caption:"터널 안쪽은 어둡고 비어 있다.",correct:1,options:[["3번 승강장에 열차가 들어오고 있습니다.","터널 끝에 헤드라이트 두 점이 켜진다. 운행표의 취소 표시가 번진다."],["3번 승강장에는 운행 열차가 없습니다.","전광판이 취소 안내를 반복한다. 터널의 진동이 멀어진다."],["방송하지 않고 기록만 남긴다.","진동이 멎는다. 모니터 구석에 젖은 손자국이 하나 남는다."]]},
    {time:"00:35",title:"노란 선 너머",cam:1,caller:"승강장 순찰 호출 · 음성 잡음",quote:"“사람이 한 명 서 있어요. 노란 선에 너무 가까워요. 뭐라고 방송하죠?”",sub:"C02에는 승객 한 명이 보인다. 머리 위 형광등만 그 자리에서 깜박인다.",rows:[["00:28","3번 승강장","막차 운행 취소","취소"],["00:35","안전 안내","노란 선 뒤 대기","상시"],["00:45","전 구간","운행 종료","완료"]],record:"C02 영상 기록: 인물 1명. 승강장 끝에서 약 1m, 열차 진입 없음.",caption:"한 사람이 노란 선 가까이에 서 있다.",correct:0,options:[["노란 선 뒤로 물러나 주십시오.","인물이 한 걸음 물러난다. 깜박이던 등이 다시 켜진다."],["열차가 곧 도착합니다. 안전선 안쪽으로 이동해 주세요.","선로에서 문 열리는 소리. 비어 있는 화면에 인원 한 명이 더 잡힌다."],["방송하지 않고 순찰자에게 재확인을 요청한다.","인물이 카메라 쪽으로 고개를 든다. 얼굴 부분만 영상에서 지워져 있다."]]},
    {time:"00:44",title:"퇴직자의 내선",cam:2,caller:"역무실 유선 · 내선 101",quote:"“나 아직 역무실 복도에 있어. 문 좀 열어 줘. 그리고 내가 들어왔다고 방송해.”",sub:"내선 101은 6년간 연결 이력이 없다. 오늘 야간 근무자는 당신뿐이다.",rows:[["00:40","근무 일지","야간 관제 1인 근무","확인"],["00:44","내선 101","사용 중지 · 연결 기록 없음","해지"],["00:45","역무실","출입문 자동 잠금","잠김"]],record:"C03 영상 기록: 복도 비어 있음. 역무실 출입문 잠금 상태.",caption:"복도는 비어 있고 출입문은 잠겨 있다.",correct:2,options:[["문을 열겠습니다. 잠시만 기다리세요.","복도 끝 문이 열린다. 내부 센서에는 출입 기록이 없다."],["직원이 역무실에 도착했습니다.","복도 스피커가 당신의 목소리로 답한다. “이제 네 차례야.”"],["아무 말 없이 내선을 끊고 기록한다.","통화가 끊긴다. 잠시 후 수화기 안쪽에서 짧은 숨이 새어 나온다."]]},
    {time:"00:58",title:"마지막 안내",cam:0,caller:"방송실 마이크 · 입력 없음",quote:"“끝내려면 마지막 안내를 해. 다음 역은 네가 있는 곳이야.”",sub:"세 화면의 시계가 00:58에서 멈췄다. 이 호출은 전화가 아니라 마이크에서 들려온다.",rows:[["00:45","전 구간","정기 운행 종료","완료"],["00:58","회송 열차","다음 역 정보 없음","미확인"],["01:00","관제실","야간 근무 종료","예정"]],record:"C01 영상 기록: 출구 표지판의 목적지 칸이 비어 있다. 시계 신호 없음.",caption:"출구 표지판의 목적지 칸이 비어 있다.",correct:0,options:[["다음 역은 없습니다.","모든 안내등이 꺼진다. 마지막으로 남은 것은 당신의 숨소리다."],["다음 역으로 계속 운행합니다.","모니터에 역 이름이 나타난다. 마지막 칸에는 당신의 근무 번호."],["마이크를 끄고 근무 종료를 요청한다.","전원이 내려간다. 꺼진 화면에서 방송실이 비친다."]]}
  ];
  var cams=[["C01 / EXIT 02","C01 · 2번 출구"],["C02 / PLATFORM 03","C02 · 3번 승강장"],["C03 / STAFF HALL","C03 · 역무실 복도"]];
  var s={started:false,n:0,cam:0,view:"cctv",answered:false,score:0,echo:0,log:[],choice:null,audio:false,ctx:null,drone:null,gain:null};
  var $=function(id){return document.getElementById(id)}, screen=$("screen");
  function esc(x){return String(x).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
  function human(x,y,k,color){return '<g transform="translate('+x+' '+y+') scale('+k+')" fill="'+color+'" opacity=".94"><ellipse cy="-27" rx="7" ry="9"/><path d="M-7-17Q0-21 7-17L10 6 7 8 6 31 2 31 0 10-3 31-7 31-6 8-10 6Z"/></g>'}
  function art(cam,c,wrong){
    var defs='<defs><linearGradient id="wall" x2="0" y2="1"><stop stop-color="#283b36"/><stop offset="1" stop-color="#0b1615"/></linearGradient><linearGradient id="floor" x2="0" y2="1"><stop stop-color="#34403a"/><stop offset="1" stop-color="#101716"/></linearGradient><radialGradient id="tunnel"><stop stop-color="#202b27"/><stop offset="1" stop-color="#030809"/></radialGradient></defs>',a="";
    if(cam===0){
      var open=c===0&&s.answered&&wrong,fill=open?"#050908":"#1d2b27";
      a='<rect width="720" height="405" fill="url(#wall)"/><path d="M0 265 248 201h232l240 64v140H0Z" fill="url(#floor)"/><path d="M0 265 248 201M720 265 480 201M0 322h720M0 365h720" stroke="#64746b" stroke-opacity=".42" stroke-width="2"/><rect x="268" y="88" width="116" height="188" fill="#435148"/><rect x="279" y="101" width="94" height="163" fill="'+fill+'" stroke="#91a095" stroke-width="3"/>';
      if(!open)a+='<path d="M282 131v132m18-132v132m18-132v132m18-132v132m18-132v132m18-132v132M274 140h105m-105 25h105m-105 25h105m-105 25h105m-105 25h105" stroke="#607168" stroke-width="3"/>';
      a+='<rect x="293" y="72" width="65" height="14" fill="#b6c6ae"/><text x="325" y="83" text-anchor="middle" fill="#293731" font-size="9" font-family="monospace">EXIT 02</text><rect x="74" y="120" width="145" height="28" rx="3" fill="#283934" stroke="#708178"/><text x="145" y="139" text-anchor="middle" fill="#b7cdbb" font-size="13" font-family="monospace">출구 2</text><rect x="503" y="142" width="84" height="113" fill="#14201d" stroke="#53645a" stroke-width="3"/><path d="M518 242v-78m14 78v-78m14 78v-78m14 78v-78m14 78v-78" stroke="#53645a" stroke-width="3"/><circle cx="383" cy="288" r="6" fill="'+(c===0&&s.answered&&!wrong?"#9ce8c9":"#df8e70")+'"/>';
      if(open)a+=human(327,235,1.2,"#080e0d");if(c===0&&s.answered&&!wrong)a+='<path d="M284 260h86" stroke="#9ce8c9" stroke-width="3"/>';
    }else if(cam===1){
      var train=c===1&&s.answered&&wrong;
      a='<rect width="720" height="405" fill="#15221f"/><path d="M0 225h720v180H0Z" fill="#29352f"/><path d="M0 264 270 238h450v167H0Z" fill="url(#floor)"/><path d="M0 285h720" stroke="#dfbf70" stroke-width="8"/><path d="M0 294h720" stroke="#0c1211" stroke-width="3"/><path d="M0 355h720m-720 19h720M76 308l36 97m78-105 26 105m122-111 12 111m138-115-7 115m164-118-28 118" stroke="#78857a" stroke-width="3" opacity=".7"/><path d="M185 0h365L428 230H278Z" fill="#1b2c28"/><path d="M205 0h325L428 229H278Z" fill="url(#tunnel)"/><path d="m230 0 55 230M504 0l-81 230" stroke="#53645a" stroke-width="5"/><rect x="50" y="92" width="180" height="25" rx="3" fill="#233530" stroke="#62786a"/><text x="140" y="109" text-anchor="middle" fill="#b7ceb9" font-size="12" font-family="monospace">3번 승강장</text><rect x="550" y="191" width="96" height="11" rx="5" fill="#6b796e"/><path d="M566 202v22m67-22v22" stroke="#606c62" stroke-width="5"/><rect x="104" y="62" width="68" height="42" fill="#0d1614" stroke="#617269"/><text x="138" y="80" text-anchor="middle" fill="#c5d1c5" font-size="8" font-family="monospace">00:26</text><text x="138" y="95" text-anchor="middle" fill="#e5c889" font-size="8" font-family="monospace">운행취소</text>';
      if(c===2)a+=human(481,257,1.35,"#111816");if(c===2&&s.answered&&!wrong)a+=human(481,243,1.22,"#293731");if(c===2&&s.answered&&wrong)a+=human(485,270,1.55,"#050807");
      if(train)a+='<circle cx="340" cy="136" r="10" fill="#fff1c5"/><circle cx="385" cy="136" r="10" fill="#fff1c5"/><path d="M330 160h65l21 70H306Z" fill="#26342e" stroke="#9eb19f" stroke-width="3"/>';
    }else{
      var ghost=c===3&&s.answered&&wrong;
      a='<rect width="720" height="405" fill="url(#wall)"/><path d="M0 0 250 67v222L0 405ZM720 0 470 67v222l250 116Z" fill="#14201d"/><path d="M0 405 250 289h220l250 116Z" fill="url(#floor)"/><path d="M0 98 250 130M720 98 470 130M0 187h250m470 0H470M0 283l250-33m470 33-250-33" stroke="#617067" stroke-opacity=".5" stroke-width="3"/><rect x="278" y="82" width="164" height="212" fill="#16211e" stroke="#75847a" stroke-width="4"/><rect x="291" y="95" width="138" height="186" fill="#0c1412"/><circle cx="412" cy="190" r="4" fill="#d2bf81"/><rect x="58" y="96" width="94" height="52" fill="#172320" stroke="#6e7b70"/><text x="105" y="117" text-anchor="middle" fill="#b8cbb9" font-size="9" font-family="monospace">STAFF</text><text x="105" y="134" text-anchor="middle" fill="#b8cbb9" font-size="9" font-family="monospace">ONLY</text><rect x="529" y="111" width="78" height="118" fill="#15211e" stroke="#67766d" stroke-width="3"/><path d="M541 125h52m-52 15h52m-52 15h52" stroke="#53645a"/><rect x="322" y="58" width="76" height="11" rx="5" fill="#e0cc92" opacity=".75"/>';
      if(ghost)a+=human(359,271,1.75,"#030606")+'<circle cx="358" cy="226" r="2.2" fill="#e4e6d8"/>';
    }
    if(c===4&&s.answered&&!wrong)a+='<text x="360" y="205" text-anchor="middle" fill="#c8e8d5" font-size="24" font-family="monospace" letter-spacing="6">다음 역은 없습니다</text>';
    if(c===4&&s.answered&&wrong)a+='<text x="360" y="205" text-anchor="middle" fill="#d88d81" font-size="19" font-family="monospace" letter-spacing="3">관제실 / 호출 중</text>';
    return '<svg class="scene" viewBox="0 0 720 405" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'+defs+a+'</svg>';
  }
  function cur(){return cases[s.n]}
  function renderScene(){
    var e=cur(),old=screen.querySelector(".scene"),wrong=s.choice&&s.choice.index!==e.correct;if(old)old.remove();
    screen.insertAdjacentHTML("afterbegin",art(s.cam,s.n,wrong));$("cameraName").textContent=cams[s.cam][0];$("cameraTime").textContent=e.time+":08";$("cameraCaption").innerHTML="<b>영상 상태</b> · "+esc(s.cam===e.cam?e.caption:cams[s.cam][1]+"의 일반 영상.");screen.setAttribute("aria-label",cams[s.cam][1]+" CCTV 화면");
    document.querySelectorAll(".cam-tab").forEach(function(b){b.setAttribute("aria-pressed",String(Number(b.dataset.cam)===s.cam))})
  }
  function renderTable(){
    var e=cur(),rows=e.rows.map(function(r){var cl=["폐쇄","취소","미확인"].indexOf(r[3])>=0?"status-closed":"";return"<tr><td>"+esc(r[0])+"</td><td>"+esc(r[1])+"</td><td>"+esc(r[2])+"</td><td class='"+cl+"'>"+esc(r[3])+"</td></tr>"}).join("");
    $("timetablePanel").innerHTML='<div class="data-panel-inner"><div class="data-kicker">운행 관리 시스템 · LOCAL COPY</div><h3 class="data-heading">당일 운행 및 시설 기록</h3><table class="timetable"><thead><tr><th>시각</th><th>구역</th><th>기록</th><th>상태</th></tr></thead><tbody>'+rows+'</tbody></table><div class="record-note"><strong>현장 메모</strong><br>'+esc(e.record)+'</div></div>'
  }
  function renderCalls(){
    $("callsPanel").innerHTML='<div class="data-panel-inner"><div class="data-kicker">유선 교환기 · INCOMING</div><h3 class="data-heading">호출 기록</h3><div class="phone-log">'+cases.slice(0,s.n+1).map(function(e,i){return'<div class="phone-entry '+(i===s.n?"current":"")+'"><div class="phone-meta"><span>'+(i===s.n?"현재 수신":"수신 기록")+" · "+esc(e.time)+'</span><span>'+esc(e.caller.split("·")[0].trim())+'</span></div><p>'+esc(e.quote)+'</p></div>'}).join("")+'</div></div>'
  }
  function setView(view){
    s.view=view;document.querySelectorAll(".view-tab").forEach(function(b){b.setAttribute("aria-selected",String(b.dataset.view===view))});
    $("cameraTabs").hidden=view!=="cctv";$("cctvPanel").hidden=view!=="cctv";$("timetablePanel").hidden=view!=="timetable";$("callsPanel").hidden=view!=="calls";
    if(view==="timetable")renderTable();if(view==="calls")renderCalls()
  }
  function progress(){
    $("progressTrack").innerHTML=cases.map(function(_,i){return'<i class="progress-step '+(i<s.n?"done":i===s.n?"active":"")+'"></i>'}).join("");
    $("callCount").textContent=String(s.n+1).padStart(2,"0")+" / 05";$("caseCounter").textContent="CASE "+String(s.n+1).padStart(2,"0");$("recordScore").textContent=s.score+" / 5";$("scoreMeter").style.width=s.score*20+"%";
    $("echoLabel").textContent=["낮음","감지됨","가까움","방송실 안","방송실 안"][s.echo];$("echoMeter").style.width=Math.min(100,s.echo*25)+"%";$("syncLabel").textContent=s.answered?"불안정":"확인 중"
  }
  function renderOptions(){
    var e=cur();$("responseList").innerHTML=e.options.map(function(o,i){return'<button class="response-option '+(i===2?"silence":"")+'" type="button" data-i="'+i+'" '+(s.answered?"disabled":"")+'><span class="number">'+(i+1)+'</span><span>'+esc(o[0])+'</span><span class="arrow">↗</span></button>'}).join("");
    $("responseList").querySelectorAll("button").forEach(function(b){b.addEventListener("click",function(){choose(Number(b.dataset.i))})})
  }
  function renderCase(){
    var e=cur();s.cam=e.cam;s.answered=false;s.choice=null;$("callTime").textContent=e.time;$("shiftClock").textContent=e.time;$("incidentTitle").textContent=e.title;$("callerInfo").textContent=e.caller;$("callQuote").textContent=e.quote;$("callSub").textContent=e.sub;$("micState").textContent="MIC / STANDBY";
    $("responseFeedback").className="response-feedback";$("responseFeedback").textContent="";$("nextButton").hidden=true;$("nextButton").innerHTML=s.n===4?'근무 종료 기록 제출 <span>→</span>':'기록하고 다음 호출 대기 <span>→</span>';
    renderOptions();renderScene();setView("cctv");progress()
  }
  function tone(freq,duration){if(!s.audio||!s.ctx)return;try{var o=s.ctx.createOscillator(),g=s.ctx.createGain();o.type="triangle";o.frequency.value=freq;g.gain.setValueAtTime(.035,s.ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,s.ctx.currentTime+duration);o.connect(g);g.connect(s.ctx.destination);o.start();o.stop(s.ctx.currentTime+duration)}catch(e){}}
  function choose(index){
    if(!s.started||s.answered)return;var e=cur(),o=e.options[index],ok=index===e.correct;s.answered=true;s.choice={index:index};if(ok)s.score++;else s.echo=Math.min(4,s.echo+1);
    s.log.push({title:e.title,time:e.time,choice:o[0],ok:ok});$("micState").textContent=index===2?"MIC / MUTED":"MIC / TRANSMITTING";
    $("responseFeedback").className="response-feedback visible"+(ok?"":" warning");$("responseFeedback").innerHTML='<span class="feedback-label">'+(index===2?"방송 기록 · 무송출":"방송 기록 · 송출 완료")+"</span>"+esc(o[1]);
    $("nextButton").hidden=false;renderOptions();renderScene();progress();tone(ok?660:155,ok?.1:.2)
  }
  function next(){if(!s.answered)return;if(s.n===4){finish();return}s.n++;renderCase()}
  function finish(){
    var grade,copy;if(s.score===5){grade="정상";copy="근무 기록은 모두 사실과 일치합니다. 01:00, 퇴근 처리가 완료되었습니다. 출입문 바깥 안내판에는 역 이름 대신 당신의 근무 번호가 표시됩니다."}
    else if(s.score>=3){grade="보류";copy="대부분의 기록은 확인됐지만 방송실 잔향이 남았습니다. 퇴근 뒤에도 누군가 당신의 목소리로 다음 근무자를 부르고 있습니다."}
    else{grade="미귀가";copy="역은 마지막 방송을 정상 안내로 기록했습니다. 근무자 수는 여전히 1명입니다. 출입 기록에는 입실만 남아 있습니다."}
    $("endingTitle").textContent=s.score===5?"기록이 닫혔습니다":"근무 기록";$("endingCopy").textContent=copy;$("endingScore").textContent=s.score+" / 5";$("endingEcho").textContent=String(s.echo);$("endingGrade").textContent=grade;
    $("endingLog").innerHTML=s.log.map(function(x,i){return"<strong>"+String(i+1).padStart(2,"0")+" · "+esc(x.time)+" "+esc(x.title)+"</strong><br>"+esc(x.choice)+" — "+(x.ok?"기록 일치":"기록 불일치")}).join("<br><br>");
    $("endingOverlay").hidden=false;$("restartButton").focus()
  }
  function start(){$("startOverlay").hidden=true;s.started=true;renderCase();document.querySelector(".view-tab").focus()}
  function restart(){s.started=false;s.n=0;s.cam=0;s.view="cctv";s.answered=false;s.score=0;s.echo=0;s.log=[];s.choice=null;$("endingOverlay").hidden=true;$("startOverlay").hidden=false;renderCase();$("startButton").focus()}
  function toggleSound(){
    s.audio=!s.audio;try{if(!s.ctx){var AC=window.AudioContext||window.webkitAudioContext;if(!AC)throw Error();s.ctx=new AC();s.drone=s.ctx.createOscillator();s.drone.type="sine";s.drone.frequency.value=48;s.gain=s.ctx.createGain();s.gain.gain.value=0;s.drone.connect(s.gain);s.gain.connect(s.ctx.destination);s.drone.start()}if(s.ctx.state==="suspended")s.ctx.resume();s.gain.gain.setTargetAtTime(s.audio ? .018 : 0,s.ctx.currentTime,.12)}catch(e){s.audio=false}
    $("soundToggle").textContent=s.audio?"소리 켜짐":"소리 꺼짐";$("soundToggle").setAttribute("aria-pressed",String(s.audio))
  }
  document.querySelectorAll(".view-tab").forEach(function(b){b.addEventListener("click",function(){setView(b.dataset.view)})});
  document.querySelectorAll(".cam-tab").forEach(function(b){b.addEventListener("click",function(){s.cam=Number(b.dataset.cam);renderScene()})});
  $("startButton").addEventListener("click",start);$("nextButton").addEventListener("click",next);$("restartButton").addEventListener("click",restart);$("soundToggle").addEventListener("click",toggleSound);
  document.addEventListener("keydown",function(e){
    if(!s.started&&(e.key==="Enter"||e.key===" ")){if(!$("endingOverlay").hidden)return;e.preventDefault();start();return}
    if(!$("endingOverlay").hidden&&(e.key==="Enter"||e.key===" ")){e.preventDefault();restart();return}
    if(!s.started||!$("startOverlay").hidden||!$("endingOverlay").hidden)return;
    if(e.key==="Enter"&&s.answered){e.preventDefault();next();return}
    if(!s.answered&&/^[1-3]$/.test(e.key)){var b=$("responseList").querySelectorAll("button")[Number(e.key)-1];if(b){e.preventDefault();b.click()}}
  });
  renderCase()
}());
