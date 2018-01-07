!function(t){"use strict";var s={};s.Constants={},s.Math={},s.Accumulator={},function(t){t.WGS84={a:6378137,f:1/298.257223563},t.version={major:1,minor:46,patch:0},t.version_string="1.46"}(s.Constants),function(t){t.digits=53,t.epsilon=Math.pow(.5,t.digits-1),t.degree=Math.PI/180,t.sq=function(t){return t*t},t.hypot=function(t,s){var i,e;return t=Math.abs(t),s=Math.abs(s),i=Math.max(t,s),e=Math.min(t,s)/(i?i:1),i*Math.sqrt(1+e*e)},t.cbrt=function(t){var s=Math.pow(Math.abs(t),1/3);return t<0?-s:s},t.log1p=function(t){var s=1+t,i=s-1;return 0===i?t:t*Math.log(s)/i},t.atanh=function(s){var i=Math.abs(s);return i=t.log1p(2*i/(1-i))/2,s<0?-i:i},t.copysign=function(t,s){return Math.abs(t)*(s<0||0===s&&1/s<0?-1:1)},t.sum=function(t,s){var i,e=t+s,a=e-s,n=e-a;return a-=t,n-=s,i=-(a+n),{s:e,t:i}},t.polyval=function(t,s,i,e){for(var a=t<0?0:s[i++];--t>=0;)a=a*e+s[i++];return a},t.AngRound=function(t){if(0===t)return t;var s=1/16,i=Math.abs(t);return i=i<s?s-(s-i):i,t<0?-i:i},t.AngNormalize=function(t){return t%=360,t<-180?t+360:t<180?t:t-360},t.LatFix=function(t){return Math.abs(t)>90?Number.NaN:t},t.AngDiff=function(s,i){var e=t.sum(t.AngNormalize(s),t.AngNormalize(-i)),a=-t.AngNormalize(e.s),n=e.t;return t.sum(180===a&&n<0?-180:a,-n)},t.sincosd=function(t){var s,i,e,a,n,h;switch(s=t%360,i=Math.floor(s/90+.5),s-=90*i,s*=this.degree,e=Math.sin(s),a=Math.cos(s),3&i){case 0:n=e,h=a;break;case 1:n=a,h=0-e;break;case 2:n=0-e,h=0-a;break;default:n=0-a,h=e}return{s:n,c:h}},t.atan2d=function(t,s){var i,e,a=0;switch(Math.abs(t)>Math.abs(s)&&(i=s,s=t,t=i,a=2),s<0&&(s=-s,++a),e=Math.atan2(t,s)/this.degree,a){case 1:e=(t>0?180:-180)-e;break;case 2:e=90-e;break;case 3:e=-90+e}return e}}(s.Math),function(t,s){t.Accumulator=function(t){this.Set(t)},t.Accumulator.prototype.Set=function(s){s||(s=0),s.constructor===t.Accumulator?(this._s=s._s,this._t=s._t):(this._s=s,this._t=0)},t.Accumulator.prototype.Add=function(t){var i=s.sum(t,this._t),e=s.sum(i.s,this._s);i=i.t,this._s=e.s,this._t=e.t,0===this._s?this._s=i:this._t+=i},t.Accumulator.prototype.Sum=function(s){var i;return s?(i=new t.Accumulator(this),i.Add(s),i._s):this._s},t.Accumulator.prototype.Negate=function(){this._s*=-1,this._t*=-1}}(s.Accumulator,s.Math),s.Geodesic={},s.GeodesicLine={},s.PolygonArea={},function(t,s,i,e,a){var n,h,r,o,c,_,l,p,u,f,A,C=6,g=C,m=C,d=C,M=d,E=20,N=E+e.digits+10,S=e.epsilon,D=200*S,L=Math.sqrt(S),y=S*D,b=1e3*L,I=0,G=31,T=32640;t.tiny_=Math.sqrt(Number.MIN_VALUE),t.nC1_=C,t.nC1p_=C,t.nC2_=C,t.nC3_=C,t.nC4_=C,n=t.nC3_*(t.nC3_-1)/2,h=t.nC4_*(t.nC4_+1)/2,t.CAP_C1=1,t.CAP_C1p=2,t.CAP_C2=4,t.CAP_C3=8,t.CAP_C4=16,t.NONE=0,t.ARC=64,t.LATITUDE=128|I,t.LONGITUDE=256|t.CAP_C3,t.AZIMUTH=512|I,t.DISTANCE=1024|t.CAP_C1,t.STANDARD=t.LATITUDE|t.LONGITUDE|t.AZIMUTH|t.DISTANCE,t.DISTANCE_IN=2048|t.CAP_C1|t.CAP_C1p,t.REDUCEDLENGTH=4096|t.CAP_C1|t.CAP_C2,t.GEODESICSCALE=8192|t.CAP_C1|t.CAP_C2,t.AREA=16384|t.CAP_C4,t.ALL=T|G,t.LONG_UNROLL=32768,t.OUT_MASK=T|t.LONG_UNROLL,t.SinCosSeries=function(t,s,i,e){var a=e.length,n=a-(t?1:0),h=2*(i-s)*(i+s),r=1&n?e[--a]:0,o=0;for(n=Math.floor(n/2);n--;)o=h*r-o+e[--a],r=h*o-r+e[--a];return t?2*s*i*r:i*(r-o)},r=function(t,s){var i,a,n,h,r,o,c,_,l,p,u,f,A=e.sq(t),C=e.sq(s),g=(A+C-1)/6;return 0===C&&g<=0?i=0:(a=A*C/4,n=e.sq(g),h=g*n,r=a*(a+2*h),o=g,r>=0?(c=a+h,c+=c<0?-Math.sqrt(r):Math.sqrt(r),_=e.cbrt(c),o+=_+(0!==_?n/_:0)):(l=Math.atan2(Math.sqrt(-r),-(a+h)),o+=2*g*Math.cos(l/3)),p=Math.sqrt(e.sq(o)+C),u=o<0?C/(p-o):o+p,f=(u-C)/(2*p),i=u/(Math.sqrt(u+e.sq(f))+f)),i},o=[1,4,64,0,256],t.A1m1f=function(t){var s=Math.floor(g/2),i=e.polyval(s,o,0,e.sq(t))/o[s+1];return(i+t)/(1-t)},c=[-1,6,-16,32,-9,64,-128,2048,9,-16,768,3,-5,512,-7,1280,-7,2048],t.C1f=function(s,i){var a,n,h=e.sq(s),r=s,o=0;for(a=1;a<=t.nC1_;++a)n=Math.floor((t.nC1_-a)/2),i[a]=r*e.polyval(n,c,o,h)/c[o+n+1],o+=n+2,r*=s},_=[205,-432,768,1536,4005,-4736,3840,12288,-225,116,384,-7173,2695,7680,3467,7680,38081,61440],t.C1pf=function(s,i){var a,n,h=e.sq(s),r=s,o=0;for(a=1;a<=t.nC1p_;++a)n=Math.floor((t.nC1p_-a)/2),i[a]=r*e.polyval(n,_,o,h)/_[o+n+1],o+=n+2,r*=s},l=[-11,-28,-192,0,256],t.A2m1f=function(t){var s=Math.floor(m/2),i=e.polyval(s,l,0,e.sq(t))/l[s+1];return(i-t)/(1+t)},p=[1,2,16,32,35,64,384,2048,15,80,768,7,35,512,63,1280,77,2048],t.C2f=function(s,i){var a,n,h=e.sq(s),r=s,o=0;for(a=1;a<=t.nC2_;++a)n=Math.floor((t.nC2_-a)/2),i[a]=r*e.polyval(n,p,o,h)/p[o+n+1],o+=n+2,r*=s},t.Geodesic=function(t,s){if(this.a=t,this.f=s,this._f1=1-this.f,this._e2=this.f*(2-this.f),this._ep2=this._e2/e.sq(this._f1),this._n=this.f/(2-this.f),this._b=this.a*this._f1,this._c2=(e.sq(this.a)+e.sq(this._b)*(0===this._e2?1:(this._e2>0?e.atanh(Math.sqrt(this._e2)):Math.atan(Math.sqrt(-this._e2)))/Math.sqrt(Math.abs(this._e2))))/2,this._etol2=.1*L/Math.sqrt(Math.max(.001,Math.abs(this.f))*Math.min(1,1-this.f/2)/2),!(isFinite(this.a)&&this.a>0))throw new Error("Major radius is not positive");if(!(isFinite(this._b)&&this._b>0))throw new Error("Minor radius is not positive");this._A3x=new Array(M),this._C3x=new Array(n),this._C4x=new Array(h),this.A3coeff(),this.C3coeff(),this.C4coeff()},u=[-3,128,-2,-3,64,-1,-3,-1,16,3,-1,-2,8,1,-1,2,1,1],t.Geodesic.prototype.A3coeff=function(){var t,s,i=0,a=0;for(t=d-1;t>=0;--t)s=Math.min(d-t-1,t),this._A3x[a++]=e.polyval(s,u,i,this._n)/u[i+s+1],i+=s+2},f=[3,128,2,5,128,-1,3,3,64,-1,0,1,8,-1,1,4,5,256,1,3,128,-3,-2,3,64,1,-3,2,32,7,512,-10,9,384,5,-9,5,192,7,512,-14,7,512,21,2560],t.Geodesic.prototype.C3coeff=function(){var s,i,a,n=0,h=0;for(s=1;s<t.nC3_;++s)for(i=t.nC3_-1;i>=s;--i)a=Math.min(t.nC3_-i-1,i),this._C3x[h++]=e.polyval(a,f,n,this._n)/f[n+a+1],n+=a+2},A=[97,15015,1088,156,45045,-224,-4784,1573,45045,-10656,14144,-4576,-858,45045,64,624,-4576,6864,-3003,15015,100,208,572,3432,-12012,30030,45045,1,9009,-2944,468,135135,5792,1040,-1287,135135,5952,-11648,9152,-2574,135135,-64,-624,4576,-6864,3003,135135,8,10725,1856,-936,225225,-8448,4992,-1144,225225,-1440,4160,-4576,1716,225225,-136,63063,1024,-208,105105,3584,-3328,1144,315315,-128,135135,-2560,832,405405,128,99099],t.Geodesic.prototype.C4coeff=function(){var s,i,a,n=0,h=0;for(s=0;s<t.nC4_;++s)for(i=t.nC4_-1;i>=s;--i)a=t.nC4_-i-1,this._C4x[h++]=e.polyval(a,A,n,this._n)/A[n+a+1],n+=a+2},t.Geodesic.prototype.A3f=function(t){return e.polyval(M-1,this._A3x,0,t)},t.Geodesic.prototype.C3f=function(s,i){var a,n,h=1,r=0;for(a=1;a<t.nC3_;++a)n=t.nC3_-a-1,h*=s,i[a]=h*e.polyval(n,this._C3x,r,s),r+=n+1},t.Geodesic.prototype.C4f=function(s,i){var a,n,h=1,r=0;for(a=0;a<t.nC4_;++a)n=t.nC4_-a-1,i[a]=h*e.polyval(n,this._C4x,r,s),r+=n+1,h*=s},t.Geodesic.prototype.Lengths=function(s,i,e,a,n,h,r,o,c,_,l,p,u){l&=t.OUT_MASK;var f,A,C,g,m,d={},M=0,E=0,N=0,S=0;if(l&(t.DISTANCE|t.REDUCEDLENGTH|t.GEODESICSCALE)&&(N=t.A1m1f(s),t.C1f(s,p),l&(t.REDUCEDLENGTH|t.GEODESICSCALE)&&(S=t.A2m1f(s),t.C2f(s,u),M=N-S,S=1+S),N=1+N),l&t.DISTANCE)f=t.SinCosSeries(!0,h,r,p)-t.SinCosSeries(!0,e,a,p),d.s12b=N*(i+f),l&(t.REDUCEDLENGTH|t.GEODESICSCALE)&&(A=t.SinCosSeries(!0,h,r,u)-t.SinCosSeries(!0,e,a,u),E=M*i+(N*f-S*A));else if(l&(t.REDUCEDLENGTH|t.GEODESICSCALE)){for(C=1;C<=t.nC2_;++C)u[C]=N*p[C]-S*u[C];E=M*i+(t.SinCosSeries(!0,h,r,u)-t.SinCosSeries(!0,e,a,u))}return l&t.REDUCEDLENGTH&&(d.m0=M,d.m12b=o*(a*h)-n*(e*r)-a*r*E),l&t.GEODESICSCALE&&(g=a*r+e*h,m=this._ep2*(c-_)*(c+_)/(n+o),d.M12=g+(m*h-r*E)*e/n,d.M21=g-(m*e-a*E)*h/o),d},t.Geodesic.prototype.InverseStart=function(s,i,a,n,h,o,c,_,l,p,u){var f,A,C,g,m,d,M,E,N,S,L,y,I,G,T,v,O,U,q,R,w,P,k,x={},z=n*i-h*s,H=h*i+n*s;return x.sig12=-1,f=n*i,f+=h*s,A=H>=0&&z<.5&&h*c<.5,A?(g=e.sq(s+n),g/=g+e.sq(i+h),x.dnm=Math.sqrt(1+this._ep2*g),C=c/(this._f1*x.dnm),m=Math.sin(C),d=Math.cos(C)):(m=_,d=l),x.salp1=h*m,x.calp1=d>=0?z+h*s*e.sq(m)/(1+d):f-h*s*e.sq(m)/(1-d),E=e.hypot(x.salp1,x.calp1),N=s*n+i*h*d,A&&E<this._etol2?(x.salp2=i*m,x.calp2=z-i*n*(d>=0?e.sq(m)/(1+d):1-d),M=e.hypot(x.salp2,x.calp2),x.salp2/=M,x.calp2/=M,x.sig12=Math.atan2(E,N)):Math.abs(this._n)>.1||N>=0||E>=6*Math.abs(this._n)*Math.PI*e.sq(i)||(k=Math.atan2(-_,-l),this.f>=0?(G=e.sq(s)*this._ep2,T=G/(2*(1+Math.sqrt(1+G))+G),y=this.f*i*this.A3f(T)*Math.PI,I=y*i,S=k/y,L=f/I):(v=h*i-n*s,O=Math.atan2(f,v),R=this.Lengths(this._n,Math.PI+O,s,-i,a,n,h,o,i,h,t.REDUCEDLENGTH,p,u),U=R.m12b,q=R.m0,S=-1+U/(i*h*q*Math.PI),I=S<-.01?f/S:-this.f*e.sq(i)*Math.PI,y=I/i,L=c/y),L>-D&&S>-1-b?this.f>=0?(x.salp1=Math.min(1,-S),x.calp1=-Math.sqrt(1-e.sq(x.salp1))):(x.calp1=Math.max(S>-D?0:-1,S),x.salp1=Math.sqrt(1-e.sq(x.calp1))):(w=r(S,L),P=y*(this.f>=0?-S*w/(1+w):-L*(1+w)/w),m=Math.sin(P),d=-Math.cos(P),x.salp1=h*m,x.calp1=f-h*s*e.sq(m)/(1-d))),x.salp1<=0?(x.salp1=1,x.calp1=0):(M=e.hypot(x.salp1,x.calp1),x.salp1/=M,x.calp1/=M),x},t.Geodesic.prototype.Lambda12=function(s,i,a,n,h,r,o,c,_,l,p,u,f,A){var C,g,m,d,M,E,N,S,D,L,y,b={};return 0===s&&0===c&&(c=-t.tiny_),g=o*i,m=e.hypot(c,o*s),b.ssig1=s,d=g*s,b.csig1=M=c*i,C=e.hypot(b.ssig1,b.csig1),b.ssig1/=C,b.csig1/=C,b.salp2=h!==i?g/h:o,b.calp2=h!==i||Math.abs(n)!==-s?Math.sqrt(e.sq(c*i)+(i<-s?(h-i)*(i+h):(s-n)*(s+n)))/h:Math.abs(c),b.ssig2=n,E=g*n,b.csig2=N=b.calp2*h,C=e.hypot(b.ssig2,b.csig2),b.ssig2/=C,b.csig2/=C,b.sig12=Math.atan2(Math.max(0,b.csig1*b.ssig2-b.ssig1*b.csig2),b.csig1*b.csig2+b.ssig1*b.ssig2),b.somg12=Math.max(0,M*E-d*N),b.comg12=M*N+d*E,D=Math.atan2(b.somg12*l-b.comg12*_,b.comg12*l+b.somg12*_),L=e.sq(m)*this._ep2,b.eps=L/(2*(1+Math.sqrt(1+L))+L),this.C3f(b.eps,A),S=t.SinCosSeries(!0,b.ssig2,b.csig2,A)-t.SinCosSeries(!0,b.ssig1,b.csig1,A),b.lam12=D-this.f*this.A3f(b.eps)*g*(b.sig12+S),p&&(0===b.calp2?b.dlam12=-2*this._f1*a/s:(y=this.Lengths(b.eps,b.sig12,b.ssig1,b.csig1,a,b.ssig2,b.csig2,r,i,h,t.REDUCEDLENGTH,u,f),b.dlam12=y.m12b,b.dlam12*=this._f1/(b.calp2*h))),b},t.Geodesic.prototype.Inverse=function(s,i,a,n,h){var r,o;return h||(h=t.STANDARD),h===t.LONG_UNROLL&&(h|=t.STANDARD),h&=t.OUT_MASK,r=this.InverseInt(s,i,a,n,h),o=r.vals,h&t.AZIMUTH&&(o.azi1=e.atan2d(r.salp1,r.calp1),o.azi2=e.atan2d(r.salp2,r.calp2)),o},t.Geodesic.prototype.InverseInt=function(s,i,a,n,h){var r,o,c,_,l,p,u,f,A,C,g,m,d,M,D,L,b,I,G,T,v,O,U,q,R,w,P,k,x,z,H,F,B,Z,K,W,j,V,Q,Y,$,J,X,tt,st,it,et,at,nt,ht,rt,ot,ct,_t,lt,pt,ut,ft,At,Ct,gt,mt,dt,Mt={};if(Mt.lat1=s=e.LatFix(s),Mt.lat2=a=e.LatFix(a),s=e.AngRound(s),a=e.AngRound(a),r=e.AngDiff(i,n),o=r.t,r=r.s,h&t.LONG_UNROLL?(Mt.lon1=i,Mt.lon2=i+r+o):(Mt.lon1=e.AngNormalize(i),Mt.lon2=e.AngNormalize(n)),c=r>=0?1:-1,r=c*e.AngRound(r),o=e.AngRound(180-r-c*o),D=r*e.degree,_=e.sincosd(r>90?o:r),L=_.s,b=(r>90?-1:1)*_.c,l=Math.abs(s)<Math.abs(a)?-1:1,l<0&&(c*=-1,_=s,s=a,a=_),p=s<0?1:-1,s*=p,a*=p,_=e.sincosd(s),u=this._f1*_.s,f=_.c,_=e.hypot(u,f),u/=_,f/=_,f=Math.max(t.tiny_,f),_=e.sincosd(a),A=this._f1*_.s,C=_.c,_=e.hypot(A,C),A/=_,C/=_,C=Math.max(t.tiny_,C),f<-u?C===f&&(A=A<0?u:-u):Math.abs(A)===-u&&(C=f),d=Math.sqrt(1+this._ep2*e.sq(u)),M=Math.sqrt(1+this._ep2*e.sq(A)),U=new Array(t.nC1_+1),q=new Array(t.nC2_+1),R=new Array(t.nC3_),w=s===-90||0===L,w&&(G=b,T=L,v=1,O=0,k=u,x=G*f,z=A,H=v*C,I=Math.atan2(Math.max(0,x*z-k*H),x*H+k*z),P=this.Lengths(this._n,I,k,x,d,z,H,M,f,C,h|t.DISTANCE|t.REDUCEDLENGTH,U,q),g=P.s12b,m=P.m12b,0!==(h&t.GEODESICSCALE)&&(Mt.M12=P.M12,Mt.M21=P.M21),I<1||m>=0?(I<3*t.tiny_&&(I=m=g=0),m*=this._b,g*=this._b,Mt.a12=I/e.degree):w=!1),ut=2,!w&&0===u&&(this.f<=0||o>=180*this.f))G=v=0,T=O=1,g=this.a*D,I=B=D/this._f1,m=this._b*Math.sin(I),h&t.GEODESICSCALE&&(Mt.M12=Mt.M21=Math.cos(I)),Mt.a12=r/this._f1;else if(!w)if(P=this.InverseStart(u,f,d,A,C,M,D,L,b,U,q),I=P.sig12,T=P.salp1,G=P.calp1,I>=0)O=P.salp2,v=P.calp2,Z=P.dnm,g=I*this._b*Z,m=e.sq(Z)*this._b*Math.sin(I/Z),h&t.GEODESICSCALE&&(Mt.M12=Mt.M21=Math.cos(I/Z)),Mt.a12=I/e.degree,B=D/(this._f1*Z);else{for(K=0,W=t.tiny_,j=1,V=t.tiny_,Q=-1,Y=!1,$=!1;K<N&&(P=this.Lambda12(u,f,d,A,C,M,T,G,L,b,K<E,U,q,R),J=P.lam12,O=P.salp2,v=P.calp2,I=P.sig12,k=P.ssig1,x=P.csig1,z=P.ssig2,H=P.csig2,F=P.eps,ut=P.somg12,ft=P.comg12,X=P.dlam12,!$&&Math.abs(J)>=(Y?8:1)*S);++K)J>0&&(K<E||G/T>Q/V)?(V=T,Q=G):J<0&&(K<E||G/T<j/W)&&(W=T,j=G),K<E&&X>0&&(tt=-J/X,st=Math.sin(tt),it=Math.cos(tt),et=T*it+G*st,et>0&&Math.abs(tt)<Math.PI)?(G=G*it-T*st,T=et,_=e.hypot(T,G),T/=_,G/=_,Y=Math.abs(J)<=16*S):(T=(W+V)/2,G=(j+Q)/2,_=e.hypot(T,G),T/=_,G/=_,Y=!1,$=Math.abs(W-T)+(j-G)<y||Math.abs(T-V)+(G-Q)<y);at=h|(h&(t.REDUCEDLENGTH|t.GEODESICSCALE)?t.DISTANCE:t.NONE),P=this.Lengths(F,I,k,x,d,z,H,M,f,C,at,U,q),g=P.s12b,m=P.m12b,0!==(h&t.GEODESICSCALE)&&(Mt.M12=P.M12,Mt.M21=P.M21),m*=this._b,g*=this._b,Mt.a12=I/e.degree}return h&t.DISTANCE&&(Mt.s12=0+g),h&t.REDUCEDLENGTH&&(Mt.m12=0+m),h&t.AREA&&(nt=T*f,ht=e.hypot(G,T*u),0!==ht&&0!==nt?(k=u,x=G*f,z=A,H=v*C,ot=e.sq(ht)*this._ep2,F=ot/(2*(1+Math.sqrt(1+ot))+ot),ct=e.sq(this.a)*ht*nt*this._e2,_=e.hypot(k,x),k/=_,x/=_,_=e.hypot(z,H),z/=_,H/=_,_t=new Array(t.nC4_),this.C4f(F,_t),lt=t.SinCosSeries(!1,k,x,_t),pt=t.SinCosSeries(!1,z,H,_t),Mt.S12=ct*(pt-lt)):Mt.S12=0,w||(ut>1?(ut=Math.sin(B),ft=Math.cos(B)):(_=e.hypot(ut,ft),ut/=_,ft/=_)),!w&&B>-.7071&&A-u<1.75?(At=1+ft,Ct=1+f,gt=1+C,rt=2*Math.atan2(ut*(u*gt+A*Ct),At*(u*A+Ct*gt))):(mt=O*G-v*T,dt=v*G+O*T,0===mt&&dt<0&&(mt=t.tiny_*G,dt=-1),rt=Math.atan2(mt,dt)),Mt.S12+=this._c2*rt,Mt.S12*=l*c*p,Mt.S12+=0),l<0&&(_=T,T=O,O=_,_=G,G=v,v=_,h&t.GEODESICSCALE&&(_=Mt.M12,Mt.M12=Mt.M21,Mt.M21=_)),T*=l*c,G*=l*p,O*=l*c,v*=l*p,{vals:Mt,salp1:T,calp1:G,salp2:O,calp2:v}},t.Geodesic.prototype.GenDirect=function(i,e,a,n,h,r){var o;return r?r===t.LONG_UNROLL&&(r|=t.STANDARD):r=t.STANDARD,n||(r|=t.DISTANCE_IN),o=new s.GeodesicLine(this,i,e,a,r),o.GenPosition(n,h,r)},t.Geodesic.prototype.Direct=function(t,s,i,e,a){return this.GenDirect(t,s,i,!1,e,a)},t.Geodesic.prototype.ArcDirect=function(t,s,i,e,a){return this.GenDirect(t,s,i,!0,e,a)},t.Geodesic.prototype.Line=function(t,i,e,a){return new s.GeodesicLine(this,t,i,e,a)},t.Geodesic.prototype.DirectLine=function(t,s,i,e,a){return this.GenDirectLine(t,s,i,!1,e,a)},t.Geodesic.prototype.ArcDirectLine=function(t,s,i,e,a){return this.GenDirectLine(t,s,i,!0,e,a)},t.Geodesic.prototype.GenDirectLine=function(i,e,a,n,h,r){var o;return r||(r=t.STANDARD|t.DISTANCE_IN),n||(r|=t.DISTANCE_IN),o=new s.GeodesicLine(this,i,e,a,r),o.GenSetDistance(n,h),o},t.Geodesic.prototype.InverseLine=function(i,a,n,h,r){var o,c,_;return r||(r=t.STANDARD|t.DISTANCE_IN),o=this.InverseInt(i,a,n,h,t.ARC),_=e.atan2d(o.salp1,o.calp1),r&(t.OUT_MASK&t.DISTANCE_IN)&&(r|=t.DISTANCE),c=new s.GeodesicLine(this,i,a,_,r,o.salp1,o.calp1),c.SetArc(o.vals.a12),c},t.Geodesic.prototype.Polygon=function(t){return new i.PolygonArea(this,t)},t.WGS84=new t.Geodesic(a.WGS84.a,a.WGS84.f)}(s.Geodesic,s.GeodesicLine,s.PolygonArea,s.Math,s.Constants),function(t,s,i){s.GeodesicLine=function(s,e,a,n,h,r,o){var c,_,l,p,u,f;h||(h=t.STANDARD|t.DISTANCE_IN),this.a=s.a,this.f=s.f,this._b=s._b,this._c2=s._c2,this._f1=s._f1,this.caps=h|t.LATITUDE|t.AZIMUTH|t.LONG_UNROLL,this.lat1=i.LatFix(e),this.lon1=a,"undefined"==typeof r||"undefined"==typeof o?(this.azi1=i.AngNormalize(n),c=i.sincosd(i.AngRound(this.azi1)),this.salp1=c.s,this.calp1=c.c):(this.azi1=n,this.salp1=r,this.calp1=o),c=i.sincosd(i.AngRound(this.lat1)),l=this._f1*c.s,_=c.c,c=i.hypot(l,_),l/=c,_/=c,_=Math.max(t.tiny_,_),this._dn1=Math.sqrt(1+s._ep2*i.sq(l)),this._salp0=this.salp1*_,this._calp0=i.hypot(this.calp1,this.salp1*l),this._ssig1=l,this._somg1=this._salp0*l,this._csig1=this._comg1=0!==l||0!==this.calp1?_*this.calp1:1,c=i.hypot(this._ssig1,this._csig1),this._ssig1/=c,this._csig1/=c,this._k2=i.sq(this._calp0)*s._ep2,p=this._k2/(2*(1+Math.sqrt(1+this._k2))+this._k2),this.caps&t.CAP_C1&&(this._A1m1=t.A1m1f(p),this._C1a=new Array(t.nC1_+1),t.C1f(p,this._C1a),this._B11=t.SinCosSeries(!0,this._ssig1,this._csig1,this._C1a),u=Math.sin(this._B11),f=Math.cos(this._B11),this._stau1=this._ssig1*f+this._csig1*u,this._ctau1=this._csig1*f-this._ssig1*u),this.caps&t.CAP_C1p&&(this._C1pa=new Array(t.nC1p_+1),t.C1pf(p,this._C1pa)),this.caps&t.CAP_C2&&(this._A2m1=t.A2m1f(p),this._C2a=new Array(t.nC2_+1),t.C2f(p,this._C2a),this._B21=t.SinCosSeries(!0,this._ssig1,this._csig1,this._C2a)),this.caps&t.CAP_C3&&(this._C3a=new Array(t.nC3_),s.C3f(p,this._C3a),this._A3c=-this.f*this._salp0*s.A3f(p),this._B31=t.SinCosSeries(!0,this._ssig1,this._csig1,this._C3a)),this.caps&t.CAP_C4&&(this._C4a=new Array(t.nC4_),s.C4f(p,this._C4a),this._A4=i.sq(this.a)*this._calp0*this._salp0*s._e2,this._B41=t.SinCosSeries(!1,this._ssig1,this._csig1,this._C4a)),this.a13=this.s13=Number.NaN},s.GeodesicLine.prototype.GenPosition=function(s,e,a){var n,h,r,o,c,_,l,p,u,f,A,C,g,m,d,M,E,N,S,D,L,y,b,I,G,T,v,O,U,q={};return a?a===t.LONG_UNROLL&&(a|=t.STANDARD):a=t.STANDARD,a&=this.caps&t.OUT_MASK,q.lat1=this.lat1,q.azi1=this.azi1,q.lon1=a&t.LONG_UNROLL?this.lon1:i.AngNormalize(this.lon1),s?q.a12=e:q.s12=e,s||this.caps&t.DISTANCE_IN&t.OUT_MASK?(o=0,c=0,s?(n=e*i.degree,T=i.sincosd(e),h=T.s,r=T.c):(p=e/(this._b*(1+this._A1m1)),u=Math.sin(p),f=Math.cos(p),o=-t.SinCosSeries(!0,this._stau1*f+this._ctau1*u,this._ctau1*f-this._stau1*u,this._C1pa),n=p-(o-this._B11),h=Math.sin(n),r=Math.cos(n),Math.abs(this.f)>.01&&(_=this._ssig1*r+this._csig1*h,l=this._csig1*r-this._ssig1*h,o=t.SinCosSeries(!0,_,l,this._C1a),A=(1+this._A1m1)*(n+(o-this._B11))-e/this._b,n-=A/Math.sqrt(1+this._k2*i.sq(_)),h=Math.sin(n),r=Math.cos(n))),_=this._ssig1*r+this._csig1*h,l=this._csig1*r-this._ssig1*h,y=Math.sqrt(1+this._k2*i.sq(_)),a&(t.DISTANCE|t.REDUCEDLENGTH|t.GEODESICSCALE)&&((s||Math.abs(this.f)>.01)&&(o=t.SinCosSeries(!0,_,l,this._C1a)),c=(1+this._A1m1)*(o-this._B11)),M=this._calp0*_,E=i.hypot(this._salp0,this._calp0*l),0===E&&(E=l=t.tiny_),D=this._salp0,L=this._calp0*l,s&&a&t.DISTANCE&&(q.s12=this._b*((1+this._A1m1)*n+c)),a&t.LONGITUDE&&(N=this._salp0*_,S=l,d=i.copysign(1,this._salp0),C=a&t.LONG_UNROLL?d*(n-(Math.atan2(_,l)-Math.atan2(this._ssig1,this._csig1))+(Math.atan2(d*N,S)-Math.atan2(d*this._somg1,this._comg1))):Math.atan2(N*this._comg1-S*this._somg1,S*this._comg1+N*this._somg1),g=C+this._A3c*(n+(t.SinCosSeries(!0,_,l,this._C3a)-this._B31)),m=g/i.degree,q.lon2=a&t.LONG_UNROLL?this.lon1+m:i.AngNormalize(i.AngNormalize(this.lon1)+i.AngNormalize(m))),a&t.LATITUDE&&(q.lat2=i.atan2d(M,this._f1*E)),a&t.AZIMUTH&&(q.azi2=i.atan2d(D,L)),a&(t.REDUCEDLENGTH|t.GEODESICSCALE)&&(b=t.SinCosSeries(!0,_,l,this._C2a),I=(1+this._A2m1)*(b-this._B21),G=(this._A1m1-this._A2m1)*n+(c-I),a&t.REDUCEDLENGTH&&(q.m12=this._b*(y*(this._csig1*_)-this._dn1*(this._ssig1*l)-this._csig1*l*G)),a&t.GEODESICSCALE&&(T=this._k2*(_-this._ssig1)*(_+this._ssig1)/(this._dn1+y),q.M12=r+(T*_-l*G)*this._ssig1/this._dn1,q.M21=r-(T*this._ssig1-this._csig1*G)*_/y)),a&t.AREA&&(v=t.SinCosSeries(!1,_,l,this._C4a),0===this._calp0||0===this._salp0?(O=D*this.calp1-L*this.salp1,U=L*this.calp1+D*this.salp1):(O=this._calp0*this._salp0*(r<=0?this._csig1*(1-r)+h*this._ssig1:h*(this._csig1*h/(1+r)+this._ssig1)),U=i.sq(this._salp0)+i.sq(this._calp0)*this._csig1*l),q.S12=this._c2*Math.atan2(O,U)+this._A4*(v-this._B41)),s||(q.a12=n/i.degree),q):(q.a12=Number.NaN,q)},s.GeodesicLine.prototype.Position=function(t,s){return this.GenPosition(!1,t,s)},s.GeodesicLine.prototype.ArcPosition=function(t,s){return this.GenPosition(!0,t,s)},s.GeodesicLine.prototype.GenSetDistance=function(t,s){t?this.SetArc(s):this.SetDistance(s)},s.GeodesicLine.prototype.SetDistance=function(s){var i;this.s13=s,i=this.GenPosition(!1,this.s13,t.ARC),this.a13=0+i.a12},s.GeodesicLine.prototype.SetArc=function(s){var i;this.a13=s,i=this.GenPosition(!0,this.a13,t.DISTANCE),this.s13=0+i.s12}}(s.Geodesic,s.GeodesicLine,s.Math),function(t,s,i,e){var a,n;a=function(t,s){var e,a;return t=i.AngNormalize(t),s=i.AngNormalize(s),e=i.AngDiff(t,s).s,a=t<0&&s>=0&&e>0?1:s<0&&t>=0&&e<0?-1:0},n=function(t,s){return t%=720,s%=720,(s>=0&&s<360||s<-360?0:1)-(t>=0&&t<360||t<-360?0:1)},t.PolygonArea=function(t,i){this._geod=t,this.a=this._geod.a,this.f=this._geod.f,this._area0=4*Math.PI*t._c2,this.polyline=!!i&&i,this._mask=s.LATITUDE|s.LONGITUDE|s.DISTANCE|(this.polyline?s.NONE:s.AREA|s.LONG_UNROLL),this.polyline||(this._areasum=new e.Accumulator(0)),this._perimetersum=new e.Accumulator(0),this.Clear()},t.PolygonArea.prototype.Clear=function(){this.num=0,this._crossings=0,this.polyline||this._areasum.Set(0),this._perimetersum.Set(0),this._lat0=this._lon0=this.lat=this.lon=Number.NaN},t.PolygonArea.prototype.AddPoint=function(t,s){var i;0===this.num?(this._lat0=this.lat=t,this._lon0=this.lon=s):(i=this._geod.Inverse(this.lat,this.lon,t,s,this._mask),this._perimetersum.Add(i.s12),this.polyline||(this._areasum.Add(i.S12),this._crossings+=a(this.lon,s)),this.lat=t,this.lon=s),++this.num},t.PolygonArea.prototype.AddEdge=function(t,s){var i;this.num&&(i=this._geod.Direct(this.lat,this.lon,t,s,this._mask),this._perimetersum.Add(s),this.polyline||(this._areasum.Add(i.S12),this._crossings+=n(this.lon,i.lon2)),this.lat=i.lat2,this.lon=i.lon2),++this.num},t.PolygonArea.prototype.Compute=function(t,s){var i,n,h,r={number:this.num};return this.num<2?(r.perimeter=0,this.polyline||(r.area=0),r):this.polyline?(r.perimeter=this._perimetersum.Sum(),r):(i=this._geod.Inverse(this.lat,this.lon,this._lat0,this._lon0,this._mask),r.perimeter=this._perimetersum.Sum(i.s12),n=new e.Accumulator(this._areasum),n.Add(i.S12),h=this._crossings+a(this.lon,this._lon0),1&h&&n.Add((n.Sum()<0?1:-1)*this._area0/2),t||n.Negate(),s?n.Sum()>this._area0/2?n.Add(-this._area0):n.Sum()<=-this._area0/2&&n.Add(+this._area0):n.Sum()>=this._area0?n.Add(-this._area0):n<0&&n.Add(-this._area0),r.area=n.Sum(),r)},t.PolygonArea.prototype.TestPoint=function(t,s,i,e){var n,h,r,o,c={number:this.num+1};if(0===this.num)return c.perimeter=0,this.polyline||(c.area=0),c;for(c.perimeter=this._perimetersum.Sum(),h=this.polyline?0:this._areasum.Sum(),r=this._crossings,o=0;o<(this.polyline?1:2);++o)n=this._geod.Inverse(0===o?this.lat:t,0===o?this.lon:s,0!==o?this._lat0:t,0!==o?this._lon0:s,this._mask),c.perimeter+=n.s12,this.polyline||(h+=n.S12,r+=a(0===o?this.lon:s,0!==o?this._lon0:s));return this.polyline?c:(1&r&&(h+=(h<0?1:-1)*this._area0/2),i||(h*=-1),e?h>this._area0/2?h-=this._area0:h<=-this._area0/2&&(h+=this._area0):h>=this._area0?h-=this._area0:h<0&&(h+=this._area0),c.area=h,c)},t.PolygonArea.prototype.TestEdge=function(t,s,i,e){var h,r,o,c={number:this.num?this.num+1:0};return 0===this.num?c:(c.perimeter=this._perimetersum.Sum()+s,this.polyline?c:(r=this._areasum.Sum(),o=this._crossings,h=this._geod.Direct(this.lat,this.lon,t,s,this._mask),r+=h.S12,o+=n(this.lon,h.lon2),h=this._geod.Inverse(h.lat2,h.lon2,this._lat0,this._lon0,this._mask),c.perimeter+=h.s12,r+=h.S12,o+=a(h.lon2,this._lon0),1&o&&(r+=(r<0?1:-1)*this._area0/2),i||(r*=-1),e?r>this._area0/2?r-=this._area0:r<=-this._area0/2&&(r+=this._area0):r>=this._area0?r-=this._area0:r<0&&(r+=this._area0),c.area=r,c))}}(s.PolygonArea,s.Geodesic,s.Math,s.Accumulator),s.DMS={},function(t){var s,i,e,a,n="SNWE",h="-+",r="0123456789",o="D'\":",c="°'\"",_=["degrees","minutes","seconds"];s=function(t,s){return t.indexOf(s.toUpperCase())},i=function(t,s){return String("0000").substr(0,Math.max(0,Math.min(4,s-t.length)))+t},t.NONE=0,t.LATITUDE=1,t.LONGITUDE=2,t.AZIMUTH=3,t.DEGREE=0,t.MINUTE=1,t.SECOND=2,t.Decode=function(i){var a,r,o,c,_,l,p,u,f=i,A=0,C=0,g=t.NONE;for(f=f.replace(/\u00b0/g,"d").replace(/\u00ba/g,"d").replace(/\u2070/g,"d").replace(/\u02da/g,"d").replace(/\u2032/g,"'").replace(/\u00b4/g,"'").replace(/\u2019/g,"'").replace(/\u2033/g,'"').replace(/\u201d/g,'"').replace(/\u2212/g,"-").replace(/''/g,'"').trim(),a=f.length,l=0;l<a;l=u,++C)if(p=l,0===C&&s(n,f.charAt(p))>=0&&++p,(C>0||p<a&&s(h,f.charAt(p))>=0)&&++p,r=f.substr(p,a-p).indexOf("-"),o=f.substr(p,a-p).indexOf("+"),r<0?r=a:r+=p,o<0?o=a:o+=p,u=Math.min(r,o),c=e(f.substr(l,u-l)),A+=c.val,_=c.ind,g==t.NONE)g=_;else if(_!=t.NONE&&g!=_)throw new Error("Incompatible hemisphere specifies in "+f.substr(0,u));if(0===C)throw new Error("Empty or incomplete DMS string "+f);return{val:A,ind:g}},e=function(i){var e,c,l,p,u,f,A,C,g,m,d,M,E,N,S,D,L={},y="";do{if(e=1,c=0,l=i.length,p=t.NONE,u=-1,l>c&&(u=s(n,i.charAt(c)))>=0&&(p=2&u?t.LONGITUDE:t.LATITUDE,e=1&u?1:-1,++c),l>c&&(u=s(n,i.charAt(l-1)))>=0&&u>=0){if(p!==t.NONE){y=i.charAt(c-1).toUpperCase()===i.charAt(l-1).toUpperCase()?"Repeated hemisphere indicators "+i.charAt(c-1)+" in "+i.substr(c-1,l-c+1):"Contradictory hemisphere indicators "+i.charAt(c-1)+" and "+i.charAt(l-1)+" in "+i.substr(c-1,l-c+1);break}p=2&u?t.LONGITUDE:t.LATITUDE,e=1&u?1:-1,--l}if(l>c&&(u=s(h,i.charAt(c)))>=0&&u>=0&&(e*=u?1:-1,++c),l===c){y="Empty or incomplete DMS string "+i;break}for(f=[0,0,0],A=[0,0,0],C=0,g=0,m=0,d=0,M=c,E=!1,N=0,S=0;M<l;)if(D=i.charAt(M++),(u=s(r,D))>=0)++d,N>0?++N:(g=10*g+u,++S);else if("."===D){if(E){y="Multiple decimal points in "+i.substr(c,l-c);break}E=!0,N=1}else{if(!((u=s(o,D))>=0)){if(s(h,D)>=0){y="Internal sign in DMS string "+i.substr(c,l-c);break}y="Illegal character "+D+" in DMS string "+i.substr(c,l-c);break}if(u>=3){if(M===l){y="Illegal for colon to appear at the end of "+i.substr(c,l-c);break}u=C}if(u===C-1){y="Repeated "+_[u]+" component in "+i.substr(c,l-c);break}if(u<C){y=_[u]+" component follows "+_[C-1]+" component in "+i.substr(c,l-c);break}if(0===d){y="Missing numbers in "+_[u]+" component of "+i.substr(c,l-c);break}N>0&&(m=parseFloat(i.substr(M-S-N-1,S+N)),g=0),f[u]=g,A[u]=g+m,M<l&&(C=u+1,g=m=0,d=N=S=0)}if(y.length)break;if(s(o,i.charAt(M-1))<0){if(C>=3){y="Extra text following seconds in DMS string "+i.substr(c,l-c);break}if(0===d){y="Missing numbers in trailing component of "+i.substr(c,l-c);break}N>0&&(m=parseFloat(i.substr(M-S-N,S+N)),g=0),f[C]=g,A[C]=g+m}if(E&&0===N){y="Decimal point in non-terminal component of "+i.substr(c,l-c);break}if(f[1]>=60||A[1]>60){y="Minutes "+A[1]+" not in range [0,60)";break}if(f[2]>=60||A[2]>60){y="Seconds "+A[2]+" not in range [0,60)";break}return L.ind=p,L.val=e*(A[2]?(60*(60*A[0]+A[1])+A[2])/3600:A[1]?(60*A[0]+A[1])/60:A[0]),L}while(!1);if(L.val=a(i),0===L.val)throw new Error(y);return L.ind=t.NONE,L},a=function(t){var s,i,e,a;return t.length<3?0:(s=t.toUpperCase().replace(/0+$/,""),i="-"===s.charAt(0)?-1:1,e="-"===s.charAt(0)||"+"===s.charAt(0)?1:0,a=s.length-1,a+1<e+3?0:(s=s.substr(e,a+1-e),"NAN"===s||"1.#QNAN"===s||"1.#SNAN"===s||"1.#IND"===s||"1.#R"===s?Number.NaN:"INF"===s||"1.#INF"===s?i*Number.POSITIVE_INFINITY:0))},t.DecodeLatLon=function(s,i,e){var a,n,h={},r=t.Decode(s),o=t.Decode(i),c=r.val,_=r.ind,l=o.val,p=o.ind;if(e||(e=!1),_===t.NONE&&p===t.NONE?(_=e?t.LONGITUDE:t.LATITUDE,p=e?t.LATITUDE:t.LONGITUDE):_===t.NONE?_=t.LATITUDE+t.LONGITUDE-p:p===t.NONE&&(p=t.LATITUDE+t.LONGITUDE-_),_===p)throw new Error("Both "+s+" and "+i+" interpreted as "+(_===t.LATITUDE?"latitudes":"longitudes"));if(a=_===t.LATITUDE?c:l,n=_===t.LATITUDE?l:c,Math.abs(a)>90)throw new Error("Latitude "+a+" not in [-90,90]");return h.lat=a,h.lon=n,h},t.DecodeAngle=function(s){var i=t.Decode(s),e=i.val,a=i.ind;if(a!==t.NONE)throw new Error("Arc angle "+s+" includes a hemisphere N/E/W/S");return e},t.DecodeAzimuth=function(s){var i=t.Decode(s),e=i.val,a=i.ind;if(a===t.LATITUDE)throw new Error("Azimuth "+s+" has a latitude hemisphere N/S");return e},t.Encode=function(s,e,a,h){var r,o,_,l,p,u,f,A,C,g=1;if(h||(h=t.NONE),!isFinite(s))return s<0?String("-inf"):s>0?String("inf"):String("nan");for(a=Math.min(15-2*e,a),r=0;r<e;++r)g*=60;for(r=0;r<a;++r)g*=10;for(h===t.AZIMUTH&&(s-=360*Math.floor(s/360)),o=s<0?-1:1,s*=o,_=Math.floor(s),l=(s-_)*g+.5,p=Math.floor(l),l=p==l&&1&p?p-1:p,l/=g,l=Math.floor((s-_)*g+.5)/g,l>=1&&(_+=1,l-=1),u=[l,0,0],r=1;r<=e;++r)f=Math.floor(u[r-1]),A=u[r-1]-f,u[r]=60*A,u[r-1]=f;switch(u[0]+=_,C="",h===t.NONE&&o<0&&(C+="-"),e){case t.DEGREE:C+=i(u[0].toFixed(a),h===t.NONE?0:1+Math.min(h,2)+a+(a?1:0))+c.charAt(0);break;default:switch(C+=i(u[0].toFixed(0),h===t.NONE?0:1+Math.min(h,2))+c.charAt(0),e){case t.MINUTE:C+=i(u[1].toFixed(a),2+a+(a?1:0))+c.charAt(1);break;case t.SECOND:C+=i(u[1].toFixed(0),2)+c.charAt(1),C+=i(u[2].toFixed(a),2+a+(a?1:0))+c.charAt(2)}}return h!==t.NONE&&h!==t.AZIMUTH&&(C+=n.charAt((h===t.LATITUDE?0:2)+(o<0?0:1))),C}}(s.DMS),t(s)}(function(t){"object"==typeof module&&module.exports?module.exports=t:"function"==typeof define&&define.amd?define("geographiclib",[],function(){return t}):window.GeographicLib=t});