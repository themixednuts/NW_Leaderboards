import{S as ge,i as ye,s as Te,k,q as N,a as z,l as g,m,r as D,c as C,h as c,n as d,b as p,E as b,u as F,O as Y,G as Ee,H as Ne,P as ue,Q as ce,e as J,I as M,J as we,g as x,d as ee,f as Be,C as fe,F as Oe,v as Pe,y as Se,z as Ue,A as Ae,B as Ie}from"../chunks/index.448aff83.js";import{p as De}from"../chunks/stores.20d56513.js";import{l as je}from"../chunks/leaderboardmap.90637e4a.js";function _e(a,e,n){const t=a.slice();return t[28]=e[n],t}function be(a,e,n){const t=a.slice();return t[28]=e[n],t}function de(a){let e,n,t,l;return{c(){e=k("div"),n=ue("svg"),t=ue("path"),this.h()},l(r){e=g(r,"DIV",{class:!0,"data-tip":!0});var i=m(e);n=ce(i,"svg",{xmlns:!0,fill:!0,viewBox:!0,class:!0});var s=m(n);t=ce(s,"path",{"stroke-linecap":!0,"stroke-linejoin":!0,"stroke-width":!0,d:!0}),m(t).forEach(c),s.forEach(c),i.forEach(c),this.h()},h(){d(t,"stroke-linecap","round"),d(t,"stroke-linejoin","round"),d(t,"stroke-width","2"),d(t,"d","M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"),d(n,"xmlns","http://www.w3.org/2000/svg"),d(n,"fill","none"),d(n,"viewBox","0 0 24 24"),d(n,"class","w-4 h-4 stroke-current"),d(e,"class","tooltip tooltip-info"),d(e,"data-tip",l=a[4].CategoryAdditionalHeader.replace(/<[^>]*>/g,""))},m(r,i){p(r,e,i),b(e,n),b(n,t)},p(r,i){i[0]&16&&l!==(l=r[4].CategoryAdditionalHeader.replace(/<[^>]*>/g,""))&&d(e,"data-tip",l)},d(r){r&&c(e)}}}function he(a){let e,n,t=a[28]+1+"",l,r,i,s=(a[4].Value==="Time"?ve(a[0][a[28]].value):a[0][a[28]].value)+"",o,T,j,I=a[0][a[28]].server+"",A,V;return{c(){e=k("tr"),n=k("td"),l=N(t),r=z(),i=k("td"),o=N(s),T=z(),j=k("td"),A=N(I),V=z()},l(E){e=g(E,"TR",{});var v=m(e);n=g(v,"TD",{});var h=m(n);l=D(h,t),h.forEach(c),r=C(v),i=g(v,"TD",{});var R=m(i);o=D(R,s),R.forEach(c),T=C(v),j=g(v,"TD",{});var L=m(j);A=D(L,I),L.forEach(c),V=C(v),v.forEach(c)},m(E,v){p(E,e,v),b(e,n),b(n,l),b(e,r),b(e,i),b(i,o),b(e,T),b(e,j),b(j,A),b(e,V)},p(E,v){v[0]&8&&t!==(t=E[28]+1+"")&&F(l,t),v[0]&25&&s!==(s=(E[4].Value==="Time"?ve(E[0][E[28]].value):E[0][E[28]].value)+"")&&F(o,s),v[0]&9&&I!==(I=E[0][E[28]].server+"")&&F(A,I)},d(E){E&&c(e)}}}function me(a){let e,n=a[0][a[28]]&&he(a);return{c(){n&&n.c(),e=J()},l(t){n&&n.l(t),e=J()},m(t,l){n&&n.m(t,l),p(t,e,l)},p(t,l){t[0][t[28]]?n?n.p(t,l):(n=he(t),n.c(),n.m(e.parentNode,e)):n&&(n.d(1),n=null)},d(t){n&&n.d(t),t&&c(e)}}}function Ve(a){let e,n=a[7],t=[];for(let l=0;l<n.length;l+=1)t[l]=pe(_e(a,n,l));return{c(){for(let l=0;l<t.length;l+=1)t[l].c();e=J()},l(l){for(let r=0;r<t.length;r+=1)t[r].l(l);e=J()},m(l,r){for(let i=0;i<t.length;i+=1)t[i]&&t[i].m(l,r);p(l,e,r)},p(l,r){if(r[0]&388){n=l[7];let i;for(i=0;i<n.length;i+=1){const s=_e(l,n,i);t[i]?t[i].p(s,r):(t[i]=pe(s),t[i].c(),t[i].m(e.parentNode,e))}for(;i<t.length;i+=1)t[i].d(1);t.length=n.length}},d(l){Ee(t,l),l&&c(e)}}}function He(a){let e,n=a[7][0]+"",t,l,r,i,s,o,T,j,I,A,V;function E(u,y){return u[2]-1>2&&u[2]-1<=u[6]-3?Le:u[2]-1>=u[6]-3?Ce:ze}let v=E(a),h=v(a);function R(u,y){return u[2]>3&&u[2]<u[6]-1?$e:u[2]>=1&&u[2]<4?Re:Me}let L=R(a),B=L(a);function q(u,y){return u[2]+1<u[6]-1&&u[2]+1>u[7][2]?Ge:u[2]+1<=u[7][2]?Fe:qe}let H=q(a),S=H(a);return{c(){e=k("button"),t=N(n),r=z(),h.c(),i=z(),B.c(),s=z(),S.c(),o=z(),T=k("button"),j=N(a[6]),this.h()},l(u){e=g(u,"BUTTON",{class:!0});var y=m(e);t=D(y,n),y.forEach(c),r=C(u),h.l(u),i=C(u),B.l(u),s=C(u),S.l(u),o=C(u),T=g(u,"BUTTON",{class:!0});var Q=m(T);j=D(Q,a[6]),Q.forEach(c),this.h()},h(){d(e,"class",l="btn btn-sm "+(a[2]===a[7][0]?"btn-active":"")),d(T,"class",I="btn btn-sm "+(a[2]===a[6]?"btn-active":""))},m(u,y){p(u,e,y),b(e,t),p(u,r,y),h.m(u,y),p(u,i,y),B.m(u,y),p(u,s,y),S.m(u,y),p(u,o,y),p(u,T,y),b(T,j),A||(V=[M(e,"click",a[13]),M(T,"click",a[23])],A=!0)},p(u,y){y[0]&4&&l!==(l="btn btn-sm "+(u[2]===u[7][0]?"btn-active":""))&&d(e,"class",l),v===(v=E(u))&&h?h.p(u,y):(h.d(1),h=v(u),h&&(h.c(),h.m(i.parentNode,i))),L===(L=R(u))&&B?B.p(u,y):(B.d(1),B=L(u),B&&(B.c(),B.m(s.parentNode,s))),H===(H=q(u))&&S?S.p(u,y):(S.d(1),S=H(u),S&&(S.c(),S.m(o.parentNode,o))),y[0]&4&&I!==(I="btn btn-sm "+(u[2]===u[6]?"btn-active":""))&&d(T,"class",I)},d(u){u&&c(e),u&&c(r),h.d(u),u&&c(i),B.d(u),u&&c(s),S.d(u),u&&c(o),u&&c(T),A=!1,we(V)}}}function pe(a){let e,n=a[28]+"",t,l,r,i;return{c(){e=k("button"),t=N(n),this.h()},l(s){e=g(s,"BUTTON",{class:!0});var o=m(e);t=D(o,n),o.forEach(c),this.h()},h(){d(e,"class",l="btn btn-sm "+(a[2]===a[28]?"btn-active":""))},m(s,o){p(s,e,o),b(e,t),r||(i=M(e,"click",a[24]),r=!0)},p(s,o){o[0]&4&&l!==(l="btn btn-sm "+(s[2]===s[28]?"btn-active":""))&&d(e,"class",l)},d(s){s&&c(e),r=!1,i()}}}function ze(a){let e,n=a[7][1]+"",t,l,r,i;return{c(){e=k("button"),t=N(n),this.h()},l(s){e=g(s,"BUTTON",{class:!0});var o=m(e);t=D(o,n),o.forEach(c),this.h()},h(){d(e,"class",l="btn btn-sm "+(a[2]===a[7][1]?"btn-active":""))},m(s,o){p(s,e,o),b(e,t),r||(i=M(e,"click",a[16]),r=!0)},p(s,o){o[0]&4&&l!==(l="btn btn-sm "+(s[2]===s[7][1]?"btn-active":""))&&d(e,"class",l)},d(s){s&&c(e),r=!1,i()}}}function Ce(a){let e,n=a[6]-3+"",t,l,r,i;return{c(){e=k("button"),t=N(n),this.h()},l(s){e=g(s,"BUTTON",{class:!0});var o=m(e);t=D(o,n),o.forEach(c),this.h()},h(){d(e,"class",l="btn btn-sm "+(a[2]===a[6]-3?"btn-active":""))},m(s,o){p(s,e,o),b(e,t),r||(i=M(e,"click",a[15]),r=!0)},p(s,o){o[0]&4&&l!==(l="btn btn-sm "+(s[2]===s[6]-3?"btn-active":""))&&d(e,"class",l)},d(s){s&&c(e),r=!1,i()}}}function Le(a){let e,n=a[2]-1+"",t,l,r,i;return{c(){e=k("button"),t=N(n),this.h()},l(s){e=g(s,"BUTTON",{class:!0});var o=m(e);t=D(o,n),o.forEach(c),this.h()},h(){d(e,"class",l="btn btn-sm "+(a[2]===a[2]-1?"btn-active":""))},m(s,o){p(s,e,o),b(e,t),r||(i=M(e,"click",a[14]),r=!0)},p(s,o){o[0]&4&&n!==(n=s[2]-1+"")&&F(t,n),o[0]&4&&l!==(l="btn btn-sm "+(s[2]===s[2]-1?"btn-active":""))&&d(e,"class",l)},d(s){s&&c(e),r=!1,i()}}}function Me(a){let e,n=a[6]-2+"",t,l,r,i;return{c(){e=k("button"),t=N(n),this.h()},l(s){e=g(s,"BUTTON",{class:!0});var o=m(e);t=D(o,n),o.forEach(c),this.h()},h(){d(e,"class",l="btn btn-sm "+(a[2]===a[6]-2?"btn-active":""))},m(s,o){p(s,e,o),b(e,t),r||(i=M(e,"click",a[19]),r=!0)},p(s,o){o[0]&4&&l!==(l="btn btn-sm "+(s[2]===s[6]-2?"btn-active":""))&&d(e,"class",l)},d(s){s&&c(e),r=!1,i()}}}function Re(a){let e,n=a[7][2]+"",t,l,r,i;return{c(){e=k("button"),t=N(n),this.h()},l(s){e=g(s,"BUTTON",{class:!0});var o=m(e);t=D(o,n),o.forEach(c),this.h()},h(){d(e,"class",l="btn btn-sm "+(a[2]===a[7][2]?"btn-active":""))},m(s,o){p(s,e,o),b(e,t),r||(i=M(e,"click",a[18]),r=!0)},p(s,o){o[0]&4&&l!==(l="btn btn-sm "+(s[2]===s[7][2]?"btn-active":""))&&d(e,"class",l)},d(s){s&&c(e),r=!1,i()}}}function $e(a){let e,n,t,l,r;return{c(){e=k("button"),n=N(a[2]),this.h()},l(i){e=g(i,"BUTTON",{class:!0});var s=m(e);n=D(s,a[2]),s.forEach(c),this.h()},h(){d(e,"class",t="btn btn-sm "+(a[2]===a[2]?"btn-active":""))},m(i,s){p(i,e,s),b(e,n),l||(r=M(e,"click",a[17]),l=!0)},p(i,s){s[0]&4&&F(n,i[2]),s[0]&4&&t!==(t="btn btn-sm "+(i[2]===i[2]?"btn-active":""))&&d(e,"class",t)},d(i){i&&c(e),l=!1,r()}}}function qe(a){let e,n=a[6]-1+"",t,l,r,i;return{c(){e=k("button"),t=N(n),this.h()},l(s){e=g(s,"BUTTON",{class:!0});var o=m(e);t=D(o,n),o.forEach(c),this.h()},h(){d(e,"class",l="btn btn-sm "+(a[2]===a[6]-1?"btn-active":""))},m(s,o){p(s,e,o),b(e,t),r||(i=M(e,"click",a[22]),r=!0)},p(s,o){o[0]&4&&l!==(l="btn btn-sm "+(s[2]===s[6]-1?"btn-active":""))&&d(e,"class",l)},d(s){s&&c(e),r=!1,i()}}}function Fe(a){let e,n=a[7][3]+"",t,l,r,i;return{c(){e=k("button"),t=N(n),this.h()},l(s){e=g(s,"BUTTON",{class:!0});var o=m(e);t=D(o,n),o.forEach(c),this.h()},h(){d(e,"class",l="btn btn-sm "+(a[2]===a[7][3]?"btn-active":""))},m(s,o){p(s,e,o),b(e,t),r||(i=M(e,"click",a[21]),r=!0)},p(s,o){o[0]&4&&l!==(l="btn btn-sm "+(s[2]===s[7][3]?"btn-active":""))&&d(e,"class",l)},d(s){s&&c(e),r=!1,i()}}}function Ge(a){let e,n=a[2]+1+"",t,l,r,i;return{c(){e=k("button"),t=N(n),this.h()},l(s){e=g(s,"BUTTON",{class:!0});var o=m(e);t=D(o,n),o.forEach(c),this.h()},h(){d(e,"class",l="btn btn-sm "+(a[2]===a[2]+1?"btn-active":""))},m(s,o){p(s,e,o),b(e,t),r||(i=M(e,"click",a[20]),r=!0)},p(s,o){o[0]&4&&n!==(n=s[2]+1+"")&&F(t,n),o[0]&4&&l!==(l="btn btn-sm "+(s[2]===s[2]+1?"btn-active":""))&&d(e,"class",l)},d(s){s&&c(e),r=!1,i()}}}function Je(a){let e,n=(isNaN(Number(a[4].DisplayName))?a[4].DisplayName:`${a[1]}, ${a[4].DisplayName}`)+"",t,l,r,i,s,o,T,j,I,A,V=a[4].Value+"",E,v,h,R,L,B,q,H,S,u,y,Q=Qe(a[5])+"",X,U=a[4].CategoryAdditionalHeader&&de(a),G=a[3],P=[];for(let f=0;f<G.length;f+=1)P[f]=me(be(a,G,f));function _(f,O){return f[6]>5?He:Ve}let $=_(a)(a);return{c(){e=k("div"),t=N(n),l=z(),U&&U.c(),r=z(),i=k("table"),s=k("thead"),o=k("tr"),T=k("th"),j=N("Rank"),I=z(),A=k("th"),E=N(V),v=z(),h=k("th"),R=N("Server"),L=z(),B=k("tbody");for(let f=0;f<P.length;f+=1)P[f].c();q=z(),H=k("div"),$.c(),S=z(),u=k("div"),y=N("Date Pulled: "),X=N(Q),this.h()},l(f){e=g(f,"DIV",{class:!0});var O=m(e);t=D(O,n),l=C(O),U&&U.l(O),O.forEach(c),r=C(f),i=g(f,"TABLE",{class:!0});var w=m(i);s=g(w,"THEAD",{});var Z=m(s);o=g(Z,"TR",{});var W=m(o);T=g(W,"TH",{});var ne=m(T);j=D(ne,"Rank"),ne.forEach(c),I=C(W),A=g(W,"TH",{});var se=m(A);E=D(se,V),se.forEach(c),v=C(W),h=g(W,"TH",{});var re=m(h);R=D(re,"Server"),re.forEach(c),W.forEach(c),Z.forEach(c),L=C(w),B=g(w,"TBODY",{});var ie=m(B);for(let le=0;le<P.length;le+=1)P[le].l(ie);ie.forEach(c),w.forEach(c),q=C(f),H=g(f,"DIV",{class:!0});var oe=m(H);$.l(oe),oe.forEach(c),S=C(f),u=g(f,"DIV",{class:!0});var te=m(u);y=D(te,"Date Pulled: "),X=D(te,Q),te.forEach(c),this.h()},h(){d(e,"class","flex justify-center capitalize sticky top-10 z-50 bg-base-300 py-4 w-full"),d(i,"class","table table-zebra w-full table-compact md:table-normal table-fixed overflow-clip"),d(H,"class","flex justify-center btn-group place-self-center py-2 my-0"),d(u,"class","flex justify-center text-sm md:text-base")},m(f,O){p(f,e,O),b(e,t),b(e,l),U&&U.m(e,null),p(f,r,O),p(f,i,O),b(i,s),b(s,o),b(o,T),b(T,j),b(o,I),b(o,A),b(A,E),b(o,v),b(o,h),b(h,R),b(i,L),b(i,B);for(let w=0;w<P.length;w+=1)P[w]&&P[w].m(B,null);p(f,q,O),p(f,H,O),$.m(H,null),p(f,S,O),p(f,u,O),b(u,y),b(u,X)},p(f,O){if(O[0]&18&&n!==(n=(isNaN(Number(f[4].DisplayName))?f[4].DisplayName:`${f[1]}, ${f[4].DisplayName}`)+"")&&F(t,n),f[4].CategoryAdditionalHeader?U?U.p(f,O):(U=de(f),U.c(),U.m(e,null)):U&&(U.d(1),U=null),O[0]&16&&V!==(V=f[4].Value+"")&&F(E,V),O[0]&25){G=f[3];let w;for(w=0;w<G.length;w+=1){const Z=be(f,G,w);P[w]?P[w].p(Z,O):(P[w]=me(Z),P[w].c(),P[w].m(B,null))}for(;w<P.length;w+=1)P[w].d(1);P.length=G.length}$.p(f,O)},i:Y,o:Y,d(f){f&&c(e),U&&U.d(),f&&c(r),f&&c(i),Ee(P,f),f&&c(q),f&&c(H),$.d(),f&&c(S),f&&c(u)}}}let ae=10;function ve(a){const e=Math.floor(a/60),n=a%60;return`${e.toString().padStart(2,"0")}:${n.toString().padStart(2,"0")}`}function Qe(a){const e=new Date(a),n={year:"2-digit",month:"numeric",day:"numeric"},t={hour:"numeric",minute:"numeric"};return`${e.toLocaleDateString("en-US",n)} ${e.toLocaleTimeString("en-US",t)}`}function Ye(a,e,n){let t,l,r,i,s,o;Ne(a,De,_=>n(12,o=_));let{table:T}=e;const j=je,I=T[0].date,A=Math.ceil(T.length/10),V=Array.from({length:A},(_,K)=>K+1);let E=1;const v=Array(ae).fill(0);for(let _=0;_<v.length;_++)v[_]=_;function h(_){const K=_.target;n(2,E=parseInt(K.innerText)),R(E)}function R(_){const K=(_-1)*ae;for(let $=0;$<ae;$++){const f=K+$;f<T.length?n(3,v[$]=f,v):n(3,v[$]=null,v)}}const L=_=>h(_),B=_=>h(_),q=_=>h(_),H=_=>h(_),S=_=>h(_),u=_=>h(_),y=_=>h(_),Q=_=>h(_),X=_=>h(_),U=_=>h(_),G=_=>h(_),P=_=>h(_);return a.$$set=_=>{"table"in _&&n(0,T=_.table)},a.$$.update=()=>{a.$$.dirty[0]&4096&&n(11,t=o.url.searchParams.get("firstlevelcategory")),a.$$.dirty[0]&4096&&n(1,l=o.url.searchParams.get("category")),a.$$.dirty[0]&4096&&n(10,r=o.url.searchParams.get("subcategory")),a.$$.dirty[0]&4096&&o.url.searchParams.get("regions"),a.$$.dirty[0]&4096&&n(9,i=o.url.searchParams.get("leaderboardid")),a.$$.dirty[0]&3586&&n(4,s=j[t][l][r].find(_=>_.LeaderboardDefinitionId===i))},[T,l,E,v,s,I,A,V,h,i,r,t,o,L,B,q,H,S,u,y,Q,X,U,G,P]}class Ke extends ge{constructor(e){super(),ye(this,e,Ye,Je,Te,{table:0},null,[-1,-1])}}function ke(a){let e,n,t,l={ctx:a,current:null,token:null,hasCatch:!0,pending:Ze,then:Xe,catch:We,value:4,error:5,blocks:[,,,]};return fe(n=a[1](a[0]),l),{c(){e=J(),l.block.c()},l(r){e=J(),l.block.l(r)},m(r,i){p(r,e,i),l.block.m(r,l.anchor=i),l.mount=()=>e.parentNode,l.anchor=e,t=!0},p(r,i){a=r,l.ctx=a,i&1&&n!==(n=a[1](a[0]))&&fe(n,l)||Oe(l,a,i)},i(r){t||(x(l.block),t=!0)},o(r){for(let i=0;i<3;i+=1){const s=l.blocks[i];ee(s)}t=!1},d(r){r&&c(e),l.block.d(r),l.token=null,l=null}}}function We(a){let e,n=a[5].message+"",t;return{c(){e=k("div"),t=N(n),this.h()},l(l){e=g(l,"DIV",{class:!0});var r=m(e);t=D(r,n),r.forEach(c),this.h()},h(){d(e,"class","flex justify-center text-2xl")},m(l,r){p(l,e,r),b(e,t)},p(l,r){r&1&&n!==(n=l[5].message+"")&&F(t,n)},i:Y,o:Y,d(l){l&&c(e)}}}function Xe(a){let e,n;return e=new Ke({props:{table:a[4].data}}),{c(){Se(e.$$.fragment)},l(t){Ue(e.$$.fragment,t)},m(t,l){Ae(e,t,l),n=!0},p(t,l){const r={};l&1&&(r.table=t[4].data),e.$set(r)},i(t){n||(x(e.$$.fragment,t),n=!0)},o(t){ee(e.$$.fragment,t),n=!1},d(t){Ie(e,t)}}}function Ze(a){let e,n,t;return{c(){e=k("div"),n=k("button"),t=N("loading"),this.h()},l(l){e=g(l,"DIV",{class:!0});var r=m(e);n=g(r,"BUTTON",{class:!0});var i=m(n);t=D(i,"loading"),i.forEach(c),r.forEach(c),this.h()},h(){d(n,"class","btn loading"),d(e,"class","flex justify-center text-2xl")},m(l,r){p(l,e,r),b(e,n),b(n,t)},p:Y,i:Y,o:Y,d(l){l&&c(e)}}}function xe(a){let e,n,t=a[0]&&ke(a);return{c(){t&&t.c(),e=J()},l(l){t&&t.l(l),e=J()},m(l,r){t&&t.m(l,r),p(l,e,r),n=!0},p(l,[r]){l[0]?t?(t.p(l,r),r&1&&x(t,1)):(t=ke(l),t.c(),x(t,1),t.m(e.parentNode,e)):t&&(Pe(),ee(t,1,1,()=>{t=null}),Be())},i(l){n||(x(t),n=!0)},o(l){ee(t),n=!1},d(l){t&&t.d(l),l&&c(e)}}}function et(a,e,n){let t,l,r;Ne(a,De,s=>n(2,r=s));async function i(s){const o=await fetch(`https://lb.jakel.rocks/json/${s}/${l}?size=1000`);if(o.status!==200)throw new Error("Leaderboard not found");return await o.json()}return a.$$.update=()=>{a.$$.dirty&4&&n(0,t=r.url.searchParams.get("leaderboardid")),a.$$.dirty&4&&(l=r.url.searchParams.get("bracket")||"s1")},[t,i,r]}class nt extends ge{constructor(e){super(),ye(this,e,et,xe,Te,{})}}export{nt as default};
