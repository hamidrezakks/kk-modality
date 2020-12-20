!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("react"),require("@material-ui/core"),require("lodash"),require("@material-ui/core/styles"),require("styled-components")):"function"==typeof define&&define.amd?define(["exports","react","@material-ui/core","lodash","@material-ui/core/styles","styled-components"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self)["kk-modality"]={},e.React,e.core,e.lodash,e.styles$1,e.styled)}(this,(function(e,t,n,i,o,s){"use strict";function a(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var r=a(t),l=a(s);class c{constructor(){this.uniqueId=0,this.listeners={},this.newConfirmHandler=null,this.defaultOptions={cancelText:"Cancel",confirmText:"Confirm"}}static getInstance(){return this.instance||(this.instance=new c),this.instance}open(e,t){const n=i.merge(i.clone(this.defaultOptions),i.clone(e));this.uniqueId++;const o=this.uniqueId;n.id=o;let s=null,a=null;const r=new Promise(((e,t)=>{s=e,a=t}));return n.resolve=s,n.reject=a,n.cb=t,this.listeners[o]={dialog:n,id:o,reject:a,resolve:s,cb:t},this.newConfirmHandler&&this.newConfirmHandler(n),r}setNewConfirmListener(e){this.newConfirmHandler=e}removeListener(e){delete this.listeners[e]}}const d=l.default.div`
    position: relative;  
    height: 16px;
    
    &:after {
        content: '';
        height: 4px;
        width 36px;
        background-color: #ccc;
        border-radius: 4px;
        position: absolute;
        top: 60%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
`;class u extends r.default.Component{constructor(e){super(e),this.newConfirmDialogHandler=e=>{const{modalList:t,queueSize:n}=this.state;e.open=!1,t.length>n&&this.actionHandler(t[0].id,"cancel")(),e.force?t.push(e):t.unshift(e);const o=e.id;this.setState({modalList:t},(()=>{const e=this.state.modalList,t=i.findIndex(e,{id:o});t>-1&&(e[t].open=!0,this.setState({modalList:e}))}))},this.actionHandler=(e,t)=>()=>{const{modalList:n}=this.state;if(0===n.length)return;const o=i.findIndex(n,{id:e});if(-1===o)return;const s=n[o];try{s.resolve(t)}catch(e){s.reject(e)}if(s.cb)try{s.cb(t)}catch(e){console.warn(e)}let a=!1;if("cancel"===t)a=!1;else if("confirm"===t&&s.confirmPreventClose)a=!0;else if(s.buttons){const e=i.find(s.buttons,{action:t});e&&e.preventClose&&e.action===t&&(a=!0)}n[o].open=a,this.setState({modalList:n},(()=>{a||(this.confirmService.removeListener(s.id),setTimeout((()=>{const t=this.state.modalList;-1!==i.findIndex(t,{id:e})&&(t.splice(o,1),this.setState({modalList:t}))}),(this.props.dialogTransitionDuration||200)+1))}))},this.drawerOpenHandler=()=>{},this.state={modalList:[],queueSize:e.queueSize||5},this.confirmService=c.getInstance()}static getDerivedStateFromProps(e,t){return{queueSize:e.queueSize||5}}componentDidMount(){this.confirmService.setNewConfirmListener(this.newConfirmDialogHandler)}render(){const{fullScreen:e,hideDrawerAnchor:t}=this.props,{modalList:i}=this.state;return e?i.map((e=>r.default.createElement(n.SwipeableDrawer,{key:e.id,anchor:"bottom",open:e.open||!1,onClose:this.actionHandler(e.id,"cancel"),onOpen:this.drawerOpenHandler,transitionDuration:this.props.dialogTransitionDuration||200,className:"kk-modality-bottom-drawer",classes:Object.assign({paper:this.props.classes.drawerPaper},this.props.drawerClasses)},Boolean(!0!==t)&&r.default.createElement(d,{className:"kk-modality-drawer-anchor"}),this.getContact(e)))):i.map((e=>r.default.createElement(n.Dialog,Object.assign({key:e.id,transitionDuration:this.props.dialogTransitionDuration||200,open:e.open||!1,onClose:this.actionHandler(e.id,"cancel"),classes:this.props.dialogClasses},e.dialogProps),this.getContact(e))))}getContact(e){return r.default.createElement(r.default.Fragment,null,e.title&&r.default.createElement(n.DialogTitle,null,e.title),e.description&&r.default.createElement(n.DialogContent,null,r.default.createElement(n.DialogContentText,null,e.description)),r.default.createElement(n.DialogActions,null,Boolean(e.cancelText)&&r.default.createElement(n.Button,Object.assign({color:"secondary"},e.cancelProps,{onClick:this.actionHandler(e.id,"cancel")}),e.cancelText),Boolean(e.confirmText)&&r.default.createElement(n.Button,Object.assign({color:"primary"},e.confirmProps,{onClick:this.actionHandler(e.id,"confirm")}),e.confirmText),this.getButtonsContent(e)))}getButtonsContent(e){return e.buttons&&0!==e.buttons.length?e.buttons.map(((t,i)=>r.default.createElement(n.Button,Object.assign({key:i},t.props,{onClick:this.actionHandler(e.id,t.action)}),t.text))):null}}var h=n.withMobileDialog({breakpoint:"xs"})(o.withStyles({drawerPaper:{borderRadius:"12px 12px 0 0"}})(u));e.Modality=h,e.ModalityService=c,Object.defineProperty(e,"__esModule",{value:!0})}));
