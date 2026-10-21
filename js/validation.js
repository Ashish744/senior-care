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
const errorTimers=new WeakMap();
const successTimers=new WeakMap();
function check(el){
 const t=el.dataset.v,pw=t==='password'||t==='confirm';
 const v=t==='terms'?el.checked:pw?el.value:el.value.trim();
 const m=R[t](v,el.dataset.label||'This field',el.form);
 const out=document.getElementById(el.id+'-err');
 if(out){
  clearTimeout(errorTimers.get(out));
  out.textContent=m;
  if(m)errorTimers.set(out,setTimeout(()=>{out.textContent='';errorTimers.delete(out)},2000));
 }
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
  if(bad.length){
   bad[0].focus();
   if(ok){clearTimeout(successTimers.get(ok));ok.hidden=true}
   return
  }
  if(ok){
   clearTimeout(successTimers.get(ok));
   ok.textContent=f.dataset.ok;ok.hidden=false;
   successTimers.set(ok,setTimeout(()=>{ok.hidden=true;ok.textContent='';successTimers.delete(ok)},2000));
  }
  const go=f.dataset.redirect||f.querySelector('[data-go]:checked')?.dataset.go;
  const selectedRole=f.dataset.roleRedirect&&f.querySelector('[data-account-role]:checked')?.value;
  f.reset();
  if(go)setTimeout(()=>{
   if(selectedRole){
    const redirect=new URL(go,location.href);
    redirect.searchParams.set('role',selectedRole);
    location.href=redirect.href;
   }else location.href=go;
  },900);
 });
});
const requestedRole=new URLSearchParams(location.search).get('role');
if(requestedRole){
 const role=[...document.querySelectorAll('input[name="role"][value]')].find(input=>input.value===requestedRole);
 if(role)role.checked=true;
}
document.querySelectorAll('.pw-toggle').forEach(b=>b.addEventListener('click',()=>{
 const i=document.getElementById(b.dataset.target),show=i.type==='password';
 i.type=show?'text':'password';b.textContent=show?'Hide':'Show';
 b.setAttribute('aria-pressed',show);b.setAttribute('aria-label',show?'Hide password':'Show password');
}));
})();
