(()=>{
const g=window.gsap,rm=matchMedia('(prefers-reduced-motion: reduce)').matches,L=document.getElementById('loader');
const showCounts=()=>document.querySelectorAll('[data-count]').forEach(e=>e.textContent=e.dataset.count);
if(!g||rm){showCounts();document.documentElement.classList.add('no-motion');L?.remove();window.__ready();return}
const st=window.ScrollTrigger;if(st)g.registerPlugin(st);else showCounts();
if(L){g.from('.tile',{scale:.4,opacity:0,y:20,stagger:.08,duration:.7,ease:'back.out(1.6)'});
 const go=()=>setTimeout(()=>g.to(L,{opacity:0,duration:.6,onComplete:()=>{L.remove();window.__ready()}}),1000);
 document.readyState==='complete'?go():addEventListener('load',go)}else window.__ready();
const h=document.querySelector('[data-split]'),has=s=>document.querySelector(s);
if(h){h.innerHTML=h.textContent.trim().split(/\s+/).map(w=>`<span class="w"><span>${w}</span></span>`).join(' ');
 const tl=g.timeline({paused:true,defaults:{ease:'power3.out'}});
 tl.from('.w>span',{yPercent:110,stagger:.07,duration:.9});
 const txt=g.utils.toArray('.eyebrow,.lead,.btns').filter(e=>e.closest('.hero,.phero'));
 if(txt.length)tl.from(txt,{y:24,opacity:0,stagger:.12},'-=.5');
 if(has('.hero-img'))tl.from('.hero-img',{clipPath:'inset(0 0 100% 0)',duration:1.1},'<');
 if(has('.bento-deco'))tl.from('.bento-deco i',{scale:0,stagger:.08},'-=.4');
 if(has('.float')){tl.from('.float',{scale:.7,opacity:0,stagger:.15},'-=.4');g.to('.float',{y:-12,repeat:-1,yoyo:true,duration:2.4,ease:'sine.inOut',stagger:.5})}
 if(has('.pv-about'))tl.from('.ph-arch',{clipPath:'circle(0% at 50% 50%)',scale:1.2,duration:1.2},'<').from('.pbadge',{y:30,opacity:0,stagger:.2},'-=.4');
 if(has('.pv-services')){tl.from('.pchip',{y:-120,opacity:0,rotation:()=>g.utils.random(-25,25),ease:'bounce.out',stagger:.12,duration:1},'<');tl.add(()=>g.to('.pchip',{y:-8,repeat:-1,yoyo:true,duration:2,ease:'sine.inOut',stagger:{each:.3,from:'random'}}))}
 if(has('.pv-blog'))tl.from('.pcard3d',{rotationY:-40,x:80,opacity:0,transformPerspective:900,duration:1.2},'<').from('.topics span',{scale:.6,opacity:0,stagger:.08},'-=.4');
 if(has('.pv-contact'))tl.from('.pinfo',{x:70,opacity:0,stagger:.18,duration:.8},'<+.2');
 window.appReady.then(()=>tl.play())}
if(document.querySelector('.nf')){g.from('.nf .num,.nf h1,.nf p,.nf .btns',{y:30,opacity:0,stagger:.12,duration:.8});g.to('.nf .num',{y:-10,repeat:-1,yoyo:true,duration:2.5,ease:'sine.inOut'})}
if(st){
 g.utils.toArray('.reveal').forEach(el=>g.from(el,{y:40,opacity:0,duration:.8,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));
 g.utils.toArray('[data-count]').forEach(el=>{const o={v:0};g.to(o,{v:+el.dataset.count,duration:1.8,ease:'power1.out',onUpdate:()=>el.textContent=Math.round(o.v).toLocaleString(),scrollTrigger:{trigger:el,start:'top 90%',once:true}})});
 g.utils.toArray('.parallax img').forEach(i=>g.fromTo(i,{yPercent:-8,scale:1.15},{yPercent:8,ease:'none',scrollTrigger:{trigger:i.parentElement,scrub:true}}));
 g.utils.toArray('.mask').forEach(el=>g.from(el,{clipPath:'inset(0 100% 0 0)',duration:1.1,ease:'power3.inOut',scrollTrigger:{trigger:el,start:'top 85%',once:true}}));
 g.utils.toArray('.step').forEach(el=>g.from(el,{opacity:.3,x:30,duration:.7,scrollTrigger:{trigger:el,start:'top 80%',toggleClass:{targets:el,className:'on'},once:true}}));
 if(has('.tl'))g.fromTo('.tl-line i',{scaleY:0},{scaleY:1,ease:'none',scrollTrigger:{trigger:'.tl',start:'top 60%',end:'bottom 70%',scrub:true}});
 if(has('.flips'))g.from('.flip',{y:60,opacity:0,rotation:3,stagger:.12,duration:.8,scrollTrigger:{trigger:'.flips',start:'top 80%',once:true}});
 if(has('.tgrid')){g.from('.tcard',{opacity:0,scale:.92,stagger:.15,duration:.8,scrollTrigger:{trigger:'.tgrid',start:'top 80%',once:true}});g.utils.toArray('.tcard').forEach((c,i)=>g.to(c,{y:i%2?10:-10,repeat:-1,yoyo:true,duration:2.6+i*.4,ease:'sine.inOut'}))}
 if(document.querySelector('footer'))g.from('footer .foot-col,footer .big-type',{y:36,opacity:0,stagger:.1,duration:.8,scrollTrigger:{trigger:'footer',start:'top 90%',once:true}});
}
if(matchMedia('(hover:hover) and (pointer:fine)').matches)document.querySelectorAll('.btn').forEach(b=>{
 const x=g.quickTo(b,'x',{duration:.4}),y=g.quickTo(b,'y',{duration:.4});
 b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();x((e.clientX-r.left-r.width/2)*.2);y((e.clientY-r.top-r.height/2)*.3)});
 b.addEventListener('mouseleave',()=>{x(0);y(0)})});
})();
