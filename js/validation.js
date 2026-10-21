(()=>{
const L='A-Za-zÀ-ÖØ-öø-ÿ';
const RX={name:new RegExp(`^[${L}]+(?:[ '’-][${L}]+)*$`),email:/^[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/};
const R={
 name:(v,l)=>!v?`${l} is required.`:RX.name.test(v)?'':`${l} may only contain letters, spaces, hyphens and apostrophes.`,
 email:v=>!v?'Email is required.':/\s/.test(v)?'Email cannot contain spaces.':RX.email.test(v)?'':'Enter a valid email, like name@example.com.',
 password:v=>!v?'Password is required.':v.length<8?'Password must be at least 8 characters.':'',
 confirm:(v,l,f)=>!v?'Please confirm your password.':v!==f.querySelector('[data-v=password]').value?'Passwords do not match.':'',
 message:v=>v.length<10?'Please write at least 10 characters.':'',
 terms:v=>v?'':'Please accept the terms to continue.'
};
function check(el){
 const t=el.dataset.v,pw=t==='password'||t==='confirm';
 const v=t==='terms'?el.checked:pw?el.value:el.value.trim();
 const m=R[t](v,el.dataset.label||'This field',el.form);
 const out=document.getElementById(el.id+'-err');
 if(out)out.textContent=m;
 m?el.setAttribute('aria-invalid','true'):el.removeAttribute('aria-invalid');
 return !m;
}
document.querySelectorAll('form[data-validate]').forEach(f=>{
 f.noValidate=true;
 const fields=[...f.querySelectorAll('[data-v]')];
 fields.forEach(el=>{
  el.setAttribute('aria-describedby',el.id+'-err');
  el.addEventListener('blur',()=>check(el));
  el.addEventListener('input',()=>{
   if(el.hasAttribute('aria-invalid'))check(el);
   if(el.dataset.v==='password'){const c=f.querySelector('[data-v=confirm]');if(c&&c.hasAttribute('aria-invalid'))check(c)}
  });
 });
 f.addEventListener('submit',e=>{
  e.preventDefault();
  const bad=fields.filter(el=>!check(el));
  const ok=f.querySelector('.form-ok');
  if(bad.length){bad[0].focus();if(ok)ok.hidden=true;return}
  if(ok){ok.textContent=f.dataset.ok;ok.hidden=false}
  const go=f.querySelector('[data-go]:checked')?.dataset.go;f.reset();if(go)setTimeout(()=>location.href=go,900);
 });
});
document.querySelectorAll('.pw-toggle').forEach(b=>b.addEventListener('click',()=>{
 const i=document.getElementById(b.dataset.target),show=i.type==='password';
 i.type=show?'text':'password';b.textContent=show?'Hide':'Show';
 b.setAttribute('aria-pressed',show);b.setAttribute('aria-label',show?'Hide password':'Show password');
}));
const fb=document.getElementById('forgot-btn'),fp=document.getElementById('forgot');
fb?.addEventListener('click',()=>{const o=fp.hidden;fp.hidden=!o;fb.setAttribute('aria-expanded',o);if(o)fp.querySelector('input').focus()});
})();
