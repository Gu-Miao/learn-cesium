import{i as _e,C as Me,F as Le,r as A,g as Ne,h as Oe,j as ae,k as je,l as N,m as xe,n as ge,q as Ae,s as Ve,t as Ke,v as ce,x as Qe,d as K,y as u,T as ve,z as qe,A as v,B as me,D as V,E as c,G as pe,H as Xe,I as ye,J as ee,K as Ye,L as I,M as ue,N as Ce,O as Ue,P as Je,Q as Ze,S as a,U as J,V as eo}from"./index.7c33d569.js";function we(e,...r){if(Array.isArray(e))e.forEach(n=>we(n,...r));else return e(...r)}function Q(e){return e.some(r=>_e(r)?!(r.type===Me||r.type===Le&&!Q(r.children)):!0)?e:null}function wo(e,r){return e&&Q(e())||r()}function So(e,r,n){return e&&Q(e(r))||n(r)}function fe(e,r){const n=e&&Q(e());return r(n||null)}function oo(e){return!(e&&Q(e()))}function be(e){return e.replace(/#|\(|\)|,|\s/g,"_")}function ro(){const e=A(!1);return Ne(()=>{e.value=!0}),Oe(e)}const he=ge("n-form-item");function to(e,{defaultSize:r="medium",mergedSize:n,mergedDisabled:l}={}){const i=ae(he,null);je(he,null);const b=N(n?()=>n(i):()=>{const{size:h}=e;if(h)return h;if(i){const{mergedSize:O}=i;if(O.value!==void 0)return O.value}return r}),$=N(l?()=>l(i):()=>{const{disabled:h}=e;return h!==void 0?h:i?i.disabled.value:!1}),t=N(()=>{const{status:h}=e;return h||(i==null?void 0:i.mergedValidationStatus.value)});return xe(()=>{i&&i.restoreValidation()}),{mergedSizeRef:b,mergedDisabledRef:$,mergedStatusRef:t,nTriggerFormBlur(){i&&i.handleContentBlur()},nTriggerFormChange(){i&&i.handleContentChange()},nTriggerFormFocus(){i&&i.handleContentFocus()},nTriggerFormInput(){i&&i.handleContentInput()}}}function Se(e,r,n){if(!r)return;const l=Ae(),i=ae(Ke,null),b=()=>{const $=n==null?void 0:n.value;r.mount({id:$===void 0?e:$+e,head:!0,anchorMetaName:ce,props:{bPrefix:$?`.${$}-`:void 0},ssr:l}),i!=null&&i.preflightStyleDisabled||Qe.mount({id:"n-global",head:!0,anchorMetaName:ce,ssr:l})};l?b():Ve(b)}var Pe=K({name:"BaseIconSwitchTransition",setup(e,{slots:r}){const n=ro();return()=>u(ve,{name:"icon-switch-transition",appear:n.value},r)}}),no=K({name:"FadeInExpandTransition",props:{appear:Boolean,group:Boolean,mode:String,onLeave:Function,onAfterLeave:Function,onAfterEnter:Function,width:Boolean,reverse:Boolean},setup(e,{slots:r}){function n(t){e.width?t.style.maxWidth=`${t.offsetWidth}px`:t.style.maxHeight=`${t.offsetHeight}px`,t.offsetWidth}function l(t){e.width?t.style.maxWidth="0":t.style.maxHeight="0",t.offsetWidth;const{onLeave:h}=e;h&&h()}function i(t){e.width?t.style.maxWidth="":t.style.maxHeight="";const{onAfterLeave:h}=e;h&&h()}function b(t){if(t.style.transition="none",e.width){const h=t.offsetWidth;t.style.maxWidth="0",t.offsetWidth,t.style.transition="",t.style.maxWidth=`${h}px`}else if(e.reverse)t.style.maxHeight=`${t.offsetHeight}px`,t.offsetHeight,t.style.transition="",t.style.maxHeight="0";else{const h=t.offsetHeight;t.style.maxHeight="0",t.offsetWidth,t.style.transition="",t.style.maxHeight=`${h}px`}t.offsetWidth}function $(t){var h;e.width?t.style.maxWidth="":e.reverse||(t.style.maxHeight=""),(h=e.onAfterEnter)===null||h===void 0||h.call(e)}return()=>{const t=e.group?qe:ve;return u(t,{name:e.width?"fade-in-width-expand-transition":"fade-in-height-expand-transition",mode:e.mode,appear:e.appear,onEnter:b,onAfterEnter:$,onBeforeLeave:n,onLeave:l,onAfterLeave:i},r)}}});const{cubicBezierEaseInOut:io}=me;function se({originalTransform:e="",left:r=0,top:n=0,transition:l=`all .3s ${io} !important`}={}){return[v("&.icon-switch-transition-enter-from, &.icon-switch-transition-leave-to",{transform:e+" scale(0.75)",left:r,top:n,opacity:0}),v("&.icon-switch-transition-enter-to, &.icon-switch-transition-leave-from",{transform:`scale(1) ${e}`,left:r,top:n,opacity:1}),v("&.icon-switch-transition-enter-active, &.icon-switch-transition-leave-active",{transformOrigin:"center",position:"absolute",left:r,top:n,transition:l})]}var so=v([v("@keyframes loading-container-rotate",`
 to {
 -webkit-transform: rotate(360deg);
 transform: rotate(360deg);
 }
 `),v("@keyframes loading-layer-rotate",`
 12.5% {
 -webkit-transform: rotate(135deg);
 transform: rotate(135deg);
 }
 25% {
 -webkit-transform: rotate(270deg);
 transform: rotate(270deg);
 }
 37.5% {
 -webkit-transform: rotate(405deg);
 transform: rotate(405deg);
 }
 50% {
 -webkit-transform: rotate(540deg);
 transform: rotate(540deg);
 }
 62.5% {
 -webkit-transform: rotate(675deg);
 transform: rotate(675deg);
 }
 75% {
 -webkit-transform: rotate(810deg);
 transform: rotate(810deg);
 }
 87.5% {
 -webkit-transform: rotate(945deg);
 transform: rotate(945deg);
 }
 100% {
 -webkit-transform: rotate(1080deg);
 transform: rotate(1080deg);
 } 
 `),v("@keyframes loading-left-spin",`
 from {
 -webkit-transform: rotate(265deg);
 transform: rotate(265deg);
 }
 50% {
 -webkit-transform: rotate(130deg);
 transform: rotate(130deg);
 }
 to {
 -webkit-transform: rotate(265deg);
 transform: rotate(265deg);
 }
 `),v("@keyframes loading-right-spin",`
 from {
 -webkit-transform: rotate(-265deg);
 transform: rotate(-265deg);
 }
 50% {
 -webkit-transform: rotate(-130deg);
 transform: rotate(-130deg);
 }
 to {
 -webkit-transform: rotate(-265deg);
 transform: rotate(-265deg);
 }
 `),V("base-loading",`
 position: relative;
 line-height: 0;
 width: 1em;
 height: 1em;
 `,[c("transition-wrapper",`
 position: absolute;
 width: 100%;
 height: 100%;
 `,[se()]),c("container",`
 display: inline-flex;
 position: relative;
 direction: ltr;
 line-height: 0;
 animation: loading-container-rotate 1568.2352941176ms linear infinite;
 font-size: 0;
 letter-spacing: 0;
 white-space: nowrap;
 opacity: 1;
 width: 100%;
 height: 100%;
 `,[c("svg",`
 stroke: var(--n-text-color);
 fill: transparent;
 position: absolute;
 height: 100%;
 overflow: hidden;
 `),c("container-layer",`
 position: absolute;
 width: 100%;
 height: 100%;
 animation: loading-layer-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
 `,[c("container-layer-left",`
 display: inline-flex;
 position: relative;
 width: 50%;
 height: 100%;
 overflow: hidden;
 `,[c("svg",`
 animation: loading-left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
 width: 200%;
 `)]),c("container-layer-patch",`
 position: absolute;
 top: 0;
 left: 47.5%;
 box-sizing: border-box;
 width: 5%;
 height: 100%;
 overflow: hidden;
 `,[c("svg",`
 left: -900%;
 width: 2000%;
 transform: rotate(180deg);
 `)]),c("container-layer-right",`
 display: inline-flex;
 position: relative;
 width: 50%;
 height: 100%;
 overflow: hidden;
 `,[c("svg",`
 animation: loading-right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;
 left: -100%;
 width: 200%;
 `)])])]),c("placeholder",`
 position: absolute;
 left: 50%;
 top: 50%;
 transform: translateX(-50%) translateY(-50%);
 `,[se({left:"50%",top:"50%",originalTransform:"translateX(-50%) translateY(-50%)"})])])]),ao=K({name:"BaseLoading",props:{clsPrefix:{type:String,required:!0},scale:{type:Number,default:1},radius:{type:Number,default:100},strokeWidth:{type:Number,default:28},stroke:{type:String,default:void 0},show:{type:Boolean,default:!0}},setup(e){Se("-base-loading",so,pe(e,"clsPrefix"))},render(){const{clsPrefix:e,radius:r,strokeWidth:n,stroke:l,scale:i}=this,b=r/i;return u("div",{class:`${e}-base-loading`,role:"img","aria-label":"loading"},u(Pe,null,{default:()=>this.show?u("div",{key:"icon",class:`${e}-base-loading__transition-wrapper`},u("div",{class:`${e}-base-loading__container`},u("div",{class:`${e}-base-loading__container-layer`},u("div",{class:`${e}-base-loading__container-layer-left`},u("svg",{class:`${e}-base-loading__svg`,viewBox:`0 0 ${2*b} ${2*b}`,xmlns:"http://www.w3.org/2000/svg",style:{color:l}},u("circle",{fill:"none",stroke:"currentColor","stroke-width":n,"stroke-linecap":"round",cx:b,cy:b,r:r-n/2,"stroke-dasharray":4.91*r,"stroke-dashoffset":2.46*r}))),u("div",{class:`${e}-base-loading__container-layer-patch`},u("svg",{class:`${e}-base-loading__svg`,viewBox:`0 0 ${2*b} ${2*b}`,xmlns:"http://www.w3.org/2000/svg",style:{color:l}},u("circle",{fill:"none",stroke:"currentColor","stroke-width":n,"stroke-linecap":"round",cx:b,cy:b,r:r-n/2,"stroke-dasharray":4.91*r,"stroke-dashoffset":2.46*r}))),u("div",{class:`${e}-base-loading__container-layer-right`},u("svg",{class:`${e}-base-loading__svg`,viewBox:`0 0 ${2*b} ${2*b}`,xmlns:"http://www.w3.org/2000/svg",style:{color:l}},u("circle",{fill:"none",stroke:"currentColor","stroke-width":n,"stroke-linecap":"round",cx:b,cy:b,r:r-n/2,"stroke-dasharray":4.91*r,"stroke-dashoffset":2.46*r})))))):u("div",{key:"placeholder",class:`${e}-base-loading__placeholder`},this.$slots)}))}}),lo=V("base-wave",`
 position: absolute;
 left: 0;
 right: 0;
 top: 0;
 bottom: 0;
 border-radius: inherit;
`),co=K({name:"BaseWave",props:{clsPrefix:{type:String,required:!0}},setup(e){Se("-base-wave",lo,pe(e,"clsPrefix"));const r=A(null),n=A(!1);let l=null;return xe(()=>{l!==null&&window.clearTimeout(l)}),{active:n,selfRef:r,play(){l!==null&&(window.clearTimeout(l),n.value=!1,l=null),Xe(()=>{var i;(i=r.value)===null||i===void 0||i.offsetHeight,n.value=!0,l=window.setTimeout(()=>{n.value=!1,l=null},1e3)})}}},render(){const{clsPrefix:e}=this;return u("div",{ref:"selfRef","aria-hidden":!0,class:[`${e}-base-wave`,this.active&&`${e}-base-wave--active`]})}});const{cubicBezierEaseInOut:_}=me;function uo({duration:e=".2s",delay:r=".1s"}={}){return[v("&.fade-in-width-expand-transition-leave-from, &.fade-in-width-expand-transition-enter-to",{opacity:1}),v("&.fade-in-width-expand-transition-leave-to, &.fade-in-width-expand-transition-enter-from",`
 opacity: 0!important;
 margin-left: 0!important;
 margin-right: 0!important;
 `),v("&.fade-in-width-expand-transition-leave-active",`
 overflow: hidden;
 transition:
 opacity ${e} ${_},
 max-width ${e} ${_} ${r},
 margin-left ${e} ${_} ${r},
 margin-right ${e} ${_} ${r};
 `),v("&.fade-in-width-expand-transition-enter-active",`
 overflow: hidden;
 transition:
 opacity ${e} ${_} ${r},
 max-width ${e} ${_},
 margin-left ${e} ${_},
 margin-right ${e} ${_};
 `)]}function L(e){return ye(e,[255,255,255,.16])}function Z(e){return ye(e,[0,0,0,.12])}const fo=ge("n-button-group"),bo=ee&&"chrome"in window;ee&&navigator.userAgent.includes("Firefox");const ho=ee&&navigator.userAgent.includes("Safari")&&!bo;var xo={paddingTiny:"0 6px",paddingSmall:"0 10px",paddingMedium:"0 14px",paddingLarge:"0 18px",paddingRoundTiny:"0 10px",paddingRoundSmall:"0 14px",paddingRoundMedium:"0 18px",paddingRoundLarge:"0 22px",iconMarginTiny:"6px",iconMarginSmall:"6px",iconMarginMedium:"6px",iconMarginLarge:"6px",iconSizeTiny:"14px",iconSizeSmall:"18px",iconSizeMedium:"18px",iconSizeLarge:"20px",rippleDuration:".6s"};const go=e=>{const{heightTiny:r,heightSmall:n,heightMedium:l,heightLarge:i,borderRadius:b,fontSizeTiny:$,fontSizeSmall:t,fontSizeMedium:h,fontSizeLarge:O,opacityDisabled:oe,textColor2:T,textColor3:re,primaryColorHover:y,primaryColorPressed:H,borderColor:q,primaryColor:E,baseColor:f,infoColor:W,infoColorHover:P,infoColorPressed:s,successColor:x,successColorHover:w,successColorPressed:o,warningColor:z,warningColorHover:k,warningColorPressed:G,errorColor:B,errorColorHover:C,errorColorPressed:R,fontWeight:D,buttonColor2:j,buttonColor2Hover:F,buttonColor2Pressed:g,fontWeightStrong:X}=e;return Object.assign(Object.assign({},xo),{heightTiny:r,heightSmall:n,heightMedium:l,heightLarge:i,borderRadiusTiny:b,borderRadiusSmall:b,borderRadiusMedium:b,borderRadiusLarge:b,fontSizeTiny:$,fontSizeSmall:t,fontSizeMedium:h,fontSizeLarge:O,opacityDisabled:oe,colorOpacitySecondary:"0.16",colorOpacitySecondaryHover:"0.22",colorOpacitySecondaryPressed:"0.28",colorSecondary:j,colorSecondaryHover:F,colorSecondaryPressed:g,colorTertiary:j,colorTertiaryHover:F,colorTertiaryPressed:g,colorQuaternary:"#0000",colorQuaternaryHover:F,colorQuaternaryPressed:g,color:"#0000",colorHover:"#0000",colorPressed:"#0000",colorFocus:"#0000",colorDisabled:"#0000",textColor:T,textColorTertiary:re,textColorHover:y,textColorPressed:H,textColorFocus:y,textColorDisabled:T,textColorText:T,textColorTextHover:y,textColorTextPressed:H,textColorTextFocus:y,textColorTextDisabled:T,textColorGhost:T,textColorGhostHover:y,textColorGhostPressed:H,textColorGhostFocus:y,textColorGhostDisabled:T,border:`1px solid ${q}`,borderHover:`1px solid ${y}`,borderPressed:`1px solid ${H}`,borderFocus:`1px solid ${y}`,borderDisabled:`1px solid ${q}`,rippleColor:E,colorPrimary:E,colorHoverPrimary:y,colorPressedPrimary:H,colorFocusPrimary:y,colorDisabledPrimary:E,textColorPrimary:f,textColorHoverPrimary:f,textColorPressedPrimary:f,textColorFocusPrimary:f,textColorDisabledPrimary:f,textColorTextPrimary:E,textColorTextHoverPrimary:y,textColorTextPressedPrimary:H,textColorTextFocusPrimary:y,textColorTextDisabledPrimary:T,textColorGhostPrimary:E,textColorGhostHoverPrimary:y,textColorGhostPressedPrimary:H,textColorGhostFocusPrimary:y,textColorGhostDisabledPrimary:E,borderPrimary:`1px solid ${E}`,borderHoverPrimary:`1px solid ${y}`,borderPressedPrimary:`1px solid ${H}`,borderFocusPrimary:`1px solid ${y}`,borderDisabledPrimary:`1px solid ${E}`,rippleColorPrimary:E,colorInfo:W,colorHoverInfo:P,colorPressedInfo:s,colorFocusInfo:P,colorDisabledInfo:W,textColorInfo:f,textColorHoverInfo:f,textColorPressedInfo:f,textColorFocusInfo:f,textColorDisabledInfo:f,textColorTextInfo:W,textColorTextHoverInfo:P,textColorTextPressedInfo:s,textColorTextFocusInfo:P,textColorTextDisabledInfo:T,textColorGhostInfo:W,textColorGhostHoverInfo:P,textColorGhostPressedInfo:s,textColorGhostFocusInfo:P,textColorGhostDisabledInfo:W,borderInfo:`1px solid ${W}`,borderHoverInfo:`1px solid ${P}`,borderPressedInfo:`1px solid ${s}`,borderFocusInfo:`1px solid ${P}`,borderDisabledInfo:`1px solid ${W}`,rippleColorInfo:W,colorSuccess:x,colorHoverSuccess:w,colorPressedSuccess:o,colorFocusSuccess:w,colorDisabledSuccess:x,textColorSuccess:f,textColorHoverSuccess:f,textColorPressedSuccess:f,textColorFocusSuccess:f,textColorDisabledSuccess:f,textColorTextSuccess:x,textColorTextHoverSuccess:w,textColorTextPressedSuccess:o,textColorTextFocusSuccess:w,textColorTextDisabledSuccess:T,textColorGhostSuccess:x,textColorGhostHoverSuccess:w,textColorGhostPressedSuccess:o,textColorGhostFocusSuccess:w,textColorGhostDisabledSuccess:x,borderSuccess:`1px solid ${x}`,borderHoverSuccess:`1px solid ${w}`,borderPressedSuccess:`1px solid ${o}`,borderFocusSuccess:`1px solid ${w}`,borderDisabledSuccess:`1px solid ${x}`,rippleColorSuccess:x,colorWarning:z,colorHoverWarning:k,colorPressedWarning:G,colorFocusWarning:k,colorDisabledWarning:z,textColorWarning:f,textColorHoverWarning:f,textColorPressedWarning:f,textColorFocusWarning:f,textColorDisabledWarning:f,textColorTextWarning:z,textColorTextHoverWarning:k,textColorTextPressedWarning:G,textColorTextFocusWarning:k,textColorTextDisabledWarning:T,textColorGhostWarning:z,textColorGhostHoverWarning:k,textColorGhostPressedWarning:G,textColorGhostFocusWarning:k,textColorGhostDisabledWarning:z,borderWarning:`1px solid ${z}`,borderHoverWarning:`1px solid ${k}`,borderPressedWarning:`1px solid ${G}`,borderFocusWarning:`1px solid ${k}`,borderDisabledWarning:`1px solid ${z}`,rippleColorWarning:z,colorError:B,colorHoverError:C,colorPressedError:R,colorFocusError:C,colorDisabledError:B,textColorError:f,textColorHoverError:f,textColorPressedError:f,textColorFocusError:f,textColorDisabledError:f,textColorTextError:B,textColorTextHoverError:C,textColorTextPressedError:R,textColorTextFocusError:C,textColorTextDisabledError:T,textColorGhostError:B,textColorGhostHoverError:C,textColorGhostPressedError:R,textColorGhostFocusError:C,textColorGhostDisabledError:B,borderError:`1px solid ${B}`,borderHoverError:`1px solid ${C}`,borderPressedError:`1px solid ${R}`,borderFocusError:`1px solid ${C}`,borderDisabledError:`1px solid ${B}`,rippleColorError:B,waveOpacity:"0.6",fontWeight:D,fontWeightStrong:X})},vo={name:"Button",common:Ye,self:go};var mo=vo,po=v([V("button",`
 margin: 0;
 font-weight: var(--n-font-weight);
 line-height: 1;
 font-family: inherit;
 padding: var(--n-padding);
 height: var(--n-height);
 font-size: var(--n-font-size);
 border-radius: var(--n-border-radius);
 color: var(--n-text-color);
 background-color: var(--n-color);
 width: var(--n-width);
 white-space: nowrap;
 outline: none;
 position: relative;
 z-index: auto;
 border: none;
 display: inline-flex;
 flex-wrap: nowrap;
 flex-shrink: 0;
 align-items: center;
 justify-content: center;
 user-select: none;
 -webkit-user-select: none;
 text-align: center;
 cursor: pointer;
 text-decoration: none;
 transition:
 color .3s var(--n-bezier),
 background-color .3s var(--n-bezier),
 opacity .3s var(--n-bezier),
 border-color .3s var(--n-bezier);
 `,[I("color",[c("border",{borderColor:"var(--n-border-color)"}),I("disabled",[c("border",{borderColor:"var(--n-border-color-disabled)"})]),ue("disabled",[v("&:focus",[c("state-border",{borderColor:"var(--n-border-color-focus)"})]),v("&:hover",[c("state-border",{borderColor:"var(--n-border-color-hover)"})]),v("&:active",[c("state-border",{borderColor:"var(--n-border-color-pressed)"})]),I("pressed",[c("state-border",{borderColor:"var(--n-border-color-pressed)"})])])]),I("disabled",{backgroundColor:"var(--n-color-disabled)",color:"var(--n-text-color-disabled)"},[c("border",{border:"var(--n-border-disabled)"})]),ue("disabled",[v("&:focus",{backgroundColor:"var(--n-color-focus)",color:"var(--n-text-color-focus)"},[c("state-border",{border:"var(--n-border-focus)"})]),v("&:hover",{backgroundColor:"var(--n-color-hover)",color:"var(--n-text-color-hover)"},[c("state-border",{border:"var(--n-border-hover)"})]),v("&:active",{backgroundColor:"var(--n-color-pressed)",color:"var(--n-text-color-pressed)"},[c("state-border",{border:"var(--n-border-pressed)"})]),I("pressed",{backgroundColor:"var(--n-color-pressed)",color:"var(--n-text-color-pressed)"},[c("state-border",{border:"var(--n-border-pressed)"})])]),I("loading","cursor: wait;"),V("base-wave",`
 pointer-events: none;
 top: 0;
 right: 0;
 bottom: 0;
 left: 0;
 animation-iteration-count: 1;
 animation-duration: var(--n-ripple-duration);
 animation-timing-function: var(--n-bezier-ease-out), var(--n-bezier-ease-out);
 `,[I("active",{zIndex:1,animationName:"button-wave-spread, button-wave-opacity"})]),ee&&"MozBoxSizing"in document.createElement("div").style?v("&::moz-focus-inner",{border:0}):null,c("border, state-border",`
 position: absolute;
 left: 0;
 top: 0;
 right: 0;
 bottom: 0;
 border-radius: inherit;
 transition: border-color .3s var(--n-bezier);
 pointer-events: none;
 `),c("border",{border:"var(--n-border)"}),c("state-border",{border:"var(--n-border)",borderColor:"#0000",zIndex:1}),c("icon",`
 margin: var(--n-icon-margin);
 margin-left: 0;
 height: var(--n-icon-size);
 width: var(--n-icon-size);
 max-width: var(--n-icon-size);
 font-size: var(--n-icon-size);
 position: relative;
 flex-shrink: 0;
 `,[V("icon-slot",`
 height: var(--n-icon-size);
 width: var(--n-icon-size);
 position: absolute;
 left: 0;
 top: 50%;
 transform: translateY(-50%);
 display: flex;
 align-items: center;
 justify-content: center;
 `,[se({top:"50%",originalTransform:"translateY(-50%)"})]),uo()]),c("content",`
 display: flex;
 align-items: center;
 flex-wrap: nowrap;
 min-width: 0;
 `,[v("~",[c("icon",{margin:"var(--n-icon-margin)",marginRight:0})])]),I("block",`
 display: flex;
 width: 100%;
 `),I("dashed",[c("border, state-border",{borderStyle:"dashed !important"})]),I("disabled",{cursor:"not-allowed",opacity:"var(--n-opacity-disabled)"})]),v("@keyframes button-wave-spread",{from:{boxShadow:"0 0 0.5px 0 var(--n-ripple-color)"},to:{boxShadow:"0 0 0.5px 4.5px var(--n-ripple-color)"}}),v("@keyframes button-wave-opacity",{from:{opacity:"var(--n-wave-opacity)"},to:{opacity:0}})]);const yo=Object.assign(Object.assign({},Ce.props),{color:String,textColor:String,text:Boolean,block:Boolean,loading:Boolean,disabled:Boolean,circle:Boolean,size:String,ghost:Boolean,round:Boolean,secondary:Boolean,tertiary:Boolean,quaternary:Boolean,strong:Boolean,focusable:{type:Boolean,default:!0},keyboard:{type:Boolean,default:!0},tag:{type:String,default:"button"},type:{type:String,default:"default"},dashed:Boolean,iconPlacement:{type:String,default:"left"},attrType:{type:String,default:"button"},bordered:{type:Boolean,default:!0},onClick:[Function,Array],nativeFocusBehavior:{type:Boolean,default:!ho}}),$e=K({name:"Button",props:yo,setup(e){const r=A(null),n=A(null),l=A(!1),i=Ue(()=>!e.quaternary&&!e.tertiary&&!e.secondary&&!e.text&&(!e.color||e.ghost||e.dashed)&&e.bordered),b=ae(fo,{}),{mergedSizeRef:$}=to({},{defaultSize:"medium",mergedSize:s=>{const{size:x}=e;if(x)return x;const{size:w}=b;if(w)return w;const{mergedSize:o}=s||{};return o?o.value:"medium"}}),t=N(()=>e.focusable&&!e.disabled),h=s=>{var x;e.nativeFocusBehavior||(s.preventDefault(),!e.disabled&&t.value&&((x=r.value)===null||x===void 0||x.focus({preventScroll:!0})))},O=s=>{var x;if(!e.disabled&&!e.loading){const{onClick:w}=e;w&&we(w,s),e.text||(x=n.value)===null||x===void 0||x.play()}},oe=s=>{switch(s.key){case"Enter":if(!e.keyboard)return;l.value=!1}},T=s=>{switch(s.key){case"Enter":if(!e.keyboard||e.loading){s.preventDefault();return}l.value=!0}},re=()=>{l.value=!1},{inlineThemeDisabled:y,mergedClsPrefixRef:H,mergedRtlRef:q}=Je(e),E=Ce("Button","-button",po,mo,e,H),f=Ze("Button",q,H),W=N(()=>{const s=E.value,{common:{cubicBezierEaseInOut:x,cubicBezierEaseOut:w},self:o}=s,{rippleDuration:z,opacityDisabled:k,fontWeight:G,fontWeightStrong:B}=o,C=$.value,{dashed:R,type:D,ghost:j,text:F,color:g,round:X,circle:te,textColor:M,secondary:Te,tertiary:le,quaternary:ke,strong:He}=e,ze={"font-weight":He?B:G};let m={"--n-color":"initial","--n-color-hover":"initial","--n-color-pressed":"initial","--n-color-focus":"initial","--n-color-disabled":"initial","--n-ripple-color":"initial","--n-text-color":"initial","--n-text-color-hover":"initial","--n-text-color-pressed":"initial","--n-text-color-focus":"initial","--n-text-color-disabled":"initial"};const Y=D==="tertiary",de=D==="default",d=Y?"default":D;if(F){const p=M||g,S=p||o[a("textColorText",d)];m={"--n-color":"#0000","--n-color-hover":"#0000","--n-color-pressed":"#0000","--n-color-focus":"#0000","--n-color-disabled":"#0000","--n-ripple-color":"#0000","--n-text-color":S,"--n-text-color-hover":p?L(p):o[a("textColorTextHover",d)],"--n-text-color-pressed":p?Z(p):o[a("textColorTextPressed",d)],"--n-text-color-focus":p?L(p):o[a("textColorTextHover",d)],"--n-text-color-disabled":p||o[a("textColorTextDisabled",d)]}}else if(j||R){const p=M||g;m={"--n-color":"#0000","--n-color-hover":"#0000","--n-color-pressed":"#0000","--n-color-focus":"#0000","--n-color-disabled":"#0000","--n-ripple-color":g||o[a("rippleColor",d)],"--n-text-color":p||o[a("textColorGhost",d)],"--n-text-color-hover":p?L(p):o[a("textColorGhostHover",d)],"--n-text-color-pressed":p?Z(p):o[a("textColorGhostPressed",d)],"--n-text-color-focus":p?L(p):o[a("textColorGhostHover",d)],"--n-text-color-disabled":p||o[a("textColorGhostDisabled",d)]}}else if(Te){const p=de?o.textColor:Y?o.textColorTertiary:o[a("color",d)],S=g||p,U=D!=="default"&&D!=="tertiary";m={"--n-color":U?J(S,{alpha:Number(o.colorOpacitySecondary)}):o.colorSecondary,"--n-color-hover":U?J(S,{alpha:Number(o.colorOpacitySecondaryHover)}):o.colorSecondaryHover,"--n-color-pressed":U?J(S,{alpha:Number(o.colorOpacitySecondaryPressed)}):o.colorSecondaryPressed,"--n-color-focus":U?J(S,{alpha:Number(o.colorOpacitySecondaryHover)}):o.colorSecondaryHover,"--n-color-disabled":o.colorSecondary,"--n-ripple-color":"#0000","--n-text-color":S,"--n-text-color-hover":S,"--n-text-color-pressed":S,"--n-text-color-focus":S,"--n-text-color-disabled":S}}else if(le||ke){const p=de?o.textColor:Y?o.textColorTertiary:o[a("color",d)],S=g||p;le?(m["--n-color"]=o.colorTertiary,m["--n-color-hover"]=o.colorTertiaryHover,m["--n-color-pressed"]=o.colorTertiaryPressed,m["--n-color-focus"]=o.colorSecondaryHover,m["--n-color-disabled"]=o.colorTertiary):(m["--n-color"]=o.colorQuaternary,m["--n-color-hover"]=o.colorQuaternaryHover,m["--n-color-pressed"]=o.colorQuaternaryPressed,m["--n-color-focus"]=o.colorQuaternaryHover,m["--n-color-disabled"]=o.colorQuaternary),m["--n-ripple-color"]="#0000",m["--n-text-color"]=S,m["--n-text-color-hover"]=S,m["--n-text-color-pressed"]=S,m["--n-text-color-focus"]=S,m["--n-text-color-disabled"]=S}else m={"--n-color":g||o[a("color",d)],"--n-color-hover":g?L(g):o[a("colorHover",d)],"--n-color-pressed":g?Z(g):o[a("colorPressed",d)],"--n-color-focus":g?L(g):o[a("colorFocus",d)],"--n-color-disabled":g||o[a("colorDisabled",d)],"--n-ripple-color":g||o[a("rippleColor",d)],"--n-text-color":M||(g?o.textColorPrimary:Y?o.textColorTertiary:o[a("textColor",d)]),"--n-text-color-hover":M||(g?o.textColorHoverPrimary:o[a("textColorHover",d)]),"--n-text-color-pressed":M||(g?o.textColorPressedPrimary:o[a("textColorPressed",d)]),"--n-text-color-focus":M||(g?o.textColorFocusPrimary:o[a("textColorFocus",d)]),"--n-text-color-disabled":M||(g?o.textColorDisabledPrimary:o[a("textColorDisabled",d)])};let ne={"--n-border":"initial","--n-border-hover":"initial","--n-border-pressed":"initial","--n-border-focus":"initial","--n-border-disabled":"initial"};F?ne={"--n-border":"none","--n-border-hover":"none","--n-border-pressed":"none","--n-border-focus":"none","--n-border-disabled":"none"}:ne={"--n-border":o[a("border",d)],"--n-border-hover":o[a("borderHover",d)],"--n-border-pressed":o[a("borderPressed",d)],"--n-border-focus":o[a("borderFocus",d)],"--n-border-disabled":o[a("borderDisabled",d)]};const{[a("height",C)]:ie,[a("fontSize",C)]:Be,[a("padding",C)]:Fe,[a("paddingRound",C)]:Ee,[a("iconSize",C)]:We,[a("borderRadius",C)]:Ie,[a("iconMargin",C)]:De,waveOpacity:Ge}=o,Re={"--n-width":te&&!F?ie:"initial","--n-height":F?"initial":ie,"--n-font-size":Be,"--n-padding":te||F?"initial":X?Ee:Fe,"--n-icon-size":We,"--n-icon-margin":De,"--n-border-radius":F?"initial":te||X?ie:Ie};return Object.assign(Object.assign(Object.assign(Object.assign({"--n-bezier":x,"--n-bezier-ease-out":w,"--n-ripple-duration":z,"--n-opacity-disabled":k,"--n-wave-opacity":Ge},ze),m),ne),Re)}),P=y?eo("button",N(()=>{let s="";const{dashed:x,type:w,ghost:o,text:z,color:k,round:G,circle:B,textColor:C,secondary:R,tertiary:D,quaternary:j,strong:F}=e;x&&(s+="a"),o&&(s+="b"),z&&(s+="c"),G&&(s+="d"),B&&(s+="e"),R&&(s+="f"),D&&(s+="g"),j&&(s+="h"),F&&(s+="i"),k&&(s+="j"+be(k)),C&&(s+="k"+be(C));const{value:g}=$;return s+="l"+g[0],s+="m"+w[0],s}),W,e):void 0;return{selfElRef:r,waveElRef:n,mergedClsPrefix:H,mergedFocusable:t,mergedSize:$,showBorder:i,enterPressed:l,rtlEnabled:f,handleMousedown:h,handleKeydown:T,handleBlur:re,handleKeyup:oe,handleClick:O,customColorCssVars:N(()=>{const{color:s}=e;if(!s)return null;const x=L(s);return{"--n-border-color":s,"--n-border-color-hover":x,"--n-border-color-pressed":Z(s),"--n-border-color-focus":x,"--n-border-color-disabled":s}}),cssVars:y?void 0:W,themeClass:P==null?void 0:P.themeClass,onRender:P==null?void 0:P.onRender}},render(){const{mergedClsPrefix:e,tag:r,onRender:n}=this;n==null||n();const l=fe(this.$slots.default,i=>i&&u("span",{class:`${e}-button__content`},i));return u(r,{ref:"selfElRef",class:[this.themeClass,`${e}-button`,`${e}-button--${this.type}-type`,`${e}-button--${this.mergedSize}-type`,this.rtlEnabled&&`${e}-button--rtl`,this.disabled&&`${e}-button--disabled`,this.block&&`${e}-button--block`,this.enterPressed&&`${e}-button--pressed`,!this.text&&this.dashed&&`${e}-button--dashed`,this.color&&`${e}-button--color`,this.secondary&&`${e}-button--secondary`,this.loading&&`${e}-button--loading`,this.ghost&&`${e}-button--ghost`],tabindex:this.mergedFocusable?0:-1,type:this.attrType,style:this.cssVars,disabled:this.disabled,onClick:this.handleClick,onBlur:this.handleBlur,onMousedown:this.handleMousedown,onKeyup:this.handleKeyup,onKeydown:this.handleKeydown},this.iconPlacement==="right"&&l,u(no,{width:!0},{default:()=>fe(this.$slots.icon,i=>(this.loading||i)&&u("span",{class:`${e}-button__icon`,style:{margin:oo(this.$slots.default)?"0":""}},u(Pe,null,{default:()=>this.loading?u(ao,{clsPrefix:e,key:"loading",class:`${e}-icon-slot`,strokeWidth:20}):u("div",{key:"icon",class:`${e}-icon-slot`,role:"none"},i)})))}),this.iconPlacement==="left"&&l,this.text?null:u(co,{ref:"waveElRef",clsPrefix:e}),this.showBorder?u("div",{"aria-hidden":!0,class:`${e}-button__border`,style:this.customColorCssVars}):null,this.showBorder?u("div",{"aria-hidden":!0,class:`${e}-button__state-border`,style:this.customColorCssVars}):null)}});var Po=$e;const $o=$e;export{Po as N,$o as X,Pe as a,wo as b,ao as c,So as d,to as e,he as f,we as g,mo as h,se as i,fe as r,Se as u};
