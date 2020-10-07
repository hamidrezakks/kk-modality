(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react'), require('@material-ui/core'), require('lodash'), require('@material-ui/core/styles'), require('styled-components')) :
    typeof define === 'function' && define.amd ? define(['exports', 'react', '@material-ui/core', 'lodash', '@material-ui/core/styles', 'styled-components'], factory) :
    (global = global || self, factory(global['kk-modality'] = {}, global.React, global.core, global.lodash, global.styles$1, global.styled));
}(this, (function (exports, React, core, lodash, styles$1, styled) { 'use strict';

    React = React && Object.prototype.hasOwnProperty.call(React, 'default') ? React['default'] : React;
    styled = styled && Object.prototype.hasOwnProperty.call(styled, 'default') ? styled['default'] : styled;

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    }

    var ModalityService = /** @class */ (function () {
        function ModalityService() {
            this.uniqueId = 0;
            this.listeners = {};
            this.newConfirmHandler = null;
            this.defaultOptions = {
                cancelText: 'Cancel',
                confirmText: 'Confirm',
            };
        }
        ModalityService.getInstance = function () {
            if (!this.instance) {
                this.instance = new ModalityService();
            }
            return this.instance;
        };
        ModalityService.prototype.open = function (options, cb) {
            var data = lodash.merge(lodash.clone(this.defaultOptions), lodash.clone(options));
            this.uniqueId++;
            var id = this.uniqueId;
            data.id = id;
            var internalResolve = null;
            var internalReject = null;
            var promise = new Promise(function (resolve, reject) {
                internalResolve = resolve;
                internalReject = reject;
            });
            data.resolve = internalResolve;
            data.reject = internalReject;
            data.cb = cb;
            this.listeners[id] = {
                dialog: data,
                id: id,
                reject: internalReject,
                resolve: internalResolve,
                cb: cb,
            };
            if (this.newConfirmHandler) {
                this.newConfirmHandler(data);
            }
            return promise;
        };
        ModalityService.prototype.setNewConfirmListener = function (fn) {
            this.newConfirmHandler = fn;
        };
        ModalityService.prototype.removeListener = function (id) {
            delete this.listeners[id];
        };
        return ModalityService;
    }());

    var styles = {
        drawerPaper: {
            borderRadius: '12px 12px 0 0',
        },
    };
    var DrawerAnchor = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    position: relative;  \n    height: 16px;\n    \n    &:after {\n        content: '';\n        height: 4px;\n        width 36px;\n        background-color: #ccc;\n        border-radius: 4px;\n        position: absolute;\n        top: 60%;\n        left: 50%;\n        transform: translate(-50%, -50%);\n    }\n"], ["\n    position: relative;  \n    height: 16px;\n    \n    &:after {\n        content: '';\n        height: 4px;\n        width 36px;\n        background-color: #ccc;\n        border-radius: 4px;\n        position: absolute;\n        top: 60%;\n        left: 50%;\n        transform: translate(-50%, -50%);\n    }\n"])));
    var Modality = /** @class */ (function (_super) {
        __extends(Modality, _super);
        function Modality(props) {
            var _this = _super.call(this, props) || this;
            _this.newConfirmDialogHandler = function (modal) {
                var _a = _this.state, modalList = _a.modalList, queueSize = _a.queueSize;
                modal.open = false;
                if (modalList.length > queueSize) {
                    _this.actionHandler(modalList[0].id, 'cancel')();
                }
                if (modal.force) {
                    modalList.push(modal);
                }
                else {
                    modalList.unshift(modal);
                }
                var id = modal.id;
                _this.setState({
                    modalList: modalList,
                }, function () {
                    var modalListClone = _this.state.modalList;
                    var index = lodash.findIndex(modalListClone, { id: id });
                    if (index > -1) {
                        modalListClone[index].open = true;
                        _this.setState({
                            modalList: modalListClone,
                        });
                    }
                });
            };
            _this.actionHandler = function (id, action) { return function () {
                var modalList = _this.state.modalList;
                if (modalList.length === 0) {
                    return;
                }
                var index = lodash.findIndex(modalList, { id: id });
                if (index === -1) {
                    return;
                }
                var modal = modalList[index];
                try {
                    modal.resolve(action);
                }
                catch (e) {
                    modal.reject(e);
                }
                if (modal.cb) {
                    try {
                        modal.cb(action);
                    }
                    catch (e) {
                        console.warn(e);
                    }
                }
                var preventClose = false;
                if (action === 'cancel') {
                    preventClose = false;
                }
                else if (action === 'confirm' && modal.confirmPreventClose) {
                    preventClose = true;
                }
                else if (modal.buttons) {
                    var btn = lodash.find(modal.buttons, { action: action });
                    if (btn && btn.preventClose && btn.action === action) {
                        preventClose = true;
                    }
                }
                modalList[index].open = preventClose;
                _this.setState({
                    modalList: modalList,
                }, function () {
                    if (!preventClose) {
                        _this.confirmService.removeListener(modal.id);
                        setTimeout(function () {
                            var modalListClone = _this.state.modalList;
                            var index2 = lodash.findIndex(modalListClone, { id: id });
                            if (index2 === -1) {
                                return;
                            }
                            modalListClone.splice(index, 1);
                            _this.setState({
                                modalList: modalListClone,
                            });
                        }, (_this.props.dialogTransitionDuration || 200) + 1);
                    }
                });
            }; };
            _this.drawerOpenHandler = function () {
                //
            };
            _this.state = {
                modalList: [],
                queueSize: props.queueSize || 5,
            };
            _this.confirmService = ModalityService.getInstance();
            return _this;
        }
        Modality.getDerivedStateFromProps = function (props, state) {
            return {
                queueSize: props.queueSize || 5,
            };
        };
        Modality.prototype.componentDidMount = function () {
            this.confirmService.setNewConfirmListener(this.newConfirmDialogHandler);
        };
        Modality.prototype.render = function () {
            var _this = this;
            var _a = this.props, fullScreen = _a.fullScreen, hideDrawerAnchor = _a.hideDrawerAnchor;
            var modalList = this.state.modalList;
            if (fullScreen) {
                return modalList.map(function (modal) {
                    return (React.createElement(core.SwipeableDrawer, { key: modal.id, anchor: "bottom", open: modal.open || false, onClose: _this.actionHandler(modal.id, 'cancel'), onOpen: _this.drawerOpenHandler, transitionDuration: _this.props.dialogTransitionDuration || 200, className: "kk-modality-bottom-drawer", classes: __assign({ paper: _this.props.classes.drawerPaper }, _this.props.drawerClasses) },
                        Boolean(hideDrawerAnchor !== true) && React.createElement(DrawerAnchor, null),
                        _this.getContact(modal)));
                });
            }
            else {
                return modalList.map(function (modal) {
                    return (React.createElement(core.Dialog, __assign({ key: modal.id, transitionDuration: _this.props.dialogTransitionDuration || 200, open: modal.open || false, onClose: _this.actionHandler(modal.id, 'cancel'), classes: _this.props.dialogClasses }, modal.dialogProps), _this.getContact(modal)));
                });
            }
        };
        Modality.prototype.getContact = function (modal) {
            return React.createElement(React.Fragment, null,
                modal.title && (React.createElement(core.DialogTitle, null, modal.title)),
                modal.description && (React.createElement(core.DialogContent, null,
                    React.createElement(core.DialogContentText, null, modal.description))),
                React.createElement(core.DialogActions, null,
                    Boolean(modal.cancelText) &&
                        React.createElement(core.Button, __assign({ color: "secondary" }, modal.cancelProps, { onClick: this.actionHandler(modal.id, 'cancel') }), modal.cancelText),
                    Boolean(modal.confirmText) &&
                        React.createElement(core.Button, __assign({ color: "primary" }, modal.confirmProps, { onClick: this.actionHandler(modal.id, 'confirm') }), modal.confirmText),
                    this.getButtonsContent(modal)));
        };
        Modality.prototype.getButtonsContent = function (modal) {
            var _this = this;
            if (!modal.buttons || modal.buttons.length === 0) {
                return null;
            }
            return modal.buttons.map(function (button, key) {
                return (React.createElement(core.Button, __assign({ key: key }, button.props, { onClick: _this.actionHandler(modal.id, button.action) }), button.text));
            });
        };
        return Modality;
    }(React.Component));
    var index = core.withMobileDialog({ breakpoint: 'xs' })(styles$1.withStyles(styles)(Modality));
    var templateObject_1;

    exports.Modality = index;
    exports.ModalityService = ModalityService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
