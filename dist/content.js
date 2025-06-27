chrome.runtime.onMessage.addListener((o,s,n)=>{switch(o.action){case"fillForm":p(o.profile);break;case"showLoginPrompt":a("Please log in to Blurmy first","error");break;case"showProfilePrompt":a("Please complete your profile in Blurmy","warning");break;case"showError":a(o.error,"error");break}});function p(o){const s=document.querySelectorAll("input, textarea, select");let n=0;s.forEach(e=>{var l,c,d;const t=e,r=((l=t.name)==null?void 0:l.toLowerCase())||"",f=((c=t.id)==null?void 0:c.toLowerCase())||"",u=((d=t.type)==null?void 0:d.toLowerCase())||"";if(t.type==="hidden"||t.type==="submit"||t.type==="button")return;let i="";if(u==="email")i=o.email;else if(r.includes("name")||f.includes("name")){const m=o.rawProfileData.match(/name is ([A-Za-z\s]+)/i);m&&(i=m[1].trim())}i&&i.trim()&&(t.value=i,t.dispatchEvent(new Event("input",{bubbles:!0})),t.dispatchEvent(new Event("change",{bubbles:!0})),n++)}),n>0?a(`Successfully filled ${n} fields!`,"success"):a("No matching fields found to fill","info")}function a(o,s){const n=document.getElementById("blurmy-notification");n&&n.remove();const e=document.createElement("div");switch(e.id="blurmy-notification",e.style.cssText=`
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 16px;
    border-radius: 8px;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    z-index: 10000;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    animation: blurmy-slide-in 0.3s ease-out;
  `,s){case"success":e.style.backgroundColor="#10b981";break;case"error":e.style.backgroundColor="#ef4444";break;case"warning":e.style.backgroundColor="#f59e0b";break;case"info":e.style.backgroundColor="#3b82f6";break}e.textContent=o;const t=document.createElement("style");t.textContent=`
    @keyframes blurmy-slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `,document.head.appendChild(t),document.body.appendChild(e),setTimeout(()=>{if(e.parentNode){e.style.animation="blurmy-slide-out 0.3s ease-in",e.style.animationFillMode="forwards";const r=document.createElement("style");r.textContent=`
        @keyframes blurmy-slide-out {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `,document.head.appendChild(r),setTimeout(()=>{e.parentNode&&e.remove()},300)}},5e3)}console.log("Blurmy content script loaded");
