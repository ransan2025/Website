document.addEventListener('DOMContentLoaded',()=>{
  const toggle=document.querySelector('[data-menu-toggle]');
  const menu=document.querySelector('[data-mobile-menu]');
  if(toggle&&menu){toggle.addEventListener('click',()=>{const open=menu.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'Close menu':'Menu';});}
  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
  const form=document.querySelector('#inquiryForm');
  if(form){form.addEventListener('submit',e=>{
    e.preventDefault();if(!form.reportValidity())return;
    const val=id=>document.getElementById(id).value.trim();
    const subject=`Project enquiry: ${val('service')}`;
    const body=`Name: ${val('fullName')}\nEmail: ${val('email')}\nPhone: ${val('phone')}\nService: ${val('service')}\n\nProject details:\n${val('message')}\n\nI understand the email must be sent from my email application.`;
    const mail='mailto:sales@ransangroups.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    const result=document.querySelector('#formResponse');
    result.hidden=false;
    result.textContent='Your email application should open with a pre-filled message. Please press Send there to submit your enquiry. Nothing has been sent automatically. If it does not open, email sales@ransangroups.com directly.';
    window.location.href=mail;
  });}
});
