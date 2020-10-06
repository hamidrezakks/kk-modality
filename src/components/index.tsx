import React from 'react';
import {
    Button,
    Dialog,
    DialogActions, DialogClassKey,
    DialogContent,
    DialogContentText,
    DialogTitle, DrawerClassKey,
    SwipeableDrawer,
    withMobileDialog
} from '@material-ui/core';
import ModalityService, {IModal} from '../services/index';
import {ClassNameMap} from "@material-ui/styles/withStyles/withStyles";
import {findIndex, find} from "lodash";
import {WithMobileDialog} from "@material-ui/core/withMobileDialog/withMobileDialog";
import {withStyles} from '@material-ui/core/styles';
import styled from 'styled-components';

interface IWithStyle extends WithMobileDialog {
    classes: any;
}

interface IOwnProps {
    queueSize?: number;
    drawerClasses?: Partial<ClassNameMap<DrawerClassKey>>;
    dialogClasses?: Partial<ClassNameMap<DialogClassKey>>;
    dialogTransitionDuration?: number;
    hideDrawerAnchor?: boolean;
}

type IProps = IWithStyle & IOwnProps;

interface IState {
    modalList: IModal[];
    queueSize: number;
}

const styles = {
    drawerPaper: {
        borderRadius: '12px 12px 0 0',
    },
};

const DrawerAnchor = styled.div`
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
`;

class Modality extends React.Component<IProps, IState> {
    public static getDerivedStateFromProps(props: IProps, state: IState) {
        return {
            queueSize: props.queueSize || 5,
        };
    }

    private confirmService: ModalityService;

    constructor(props: IProps) {
        super(props);

        this.state = {
            modalList: [],
            queueSize: props.queueSize || 5,
        };

        this.confirmService = ModalityService.getInstance();
    }

    public componentDidMount() {
        this.confirmService.setNewConfirmListener(this.newConfirmDialogHandler);
    }

    public render() {
        const {fullScreen, hideDrawerAnchor} = this.props;
        const {modalList} = this.state;
        if (fullScreen) {
            return modalList.map((modal) => {
                return (<SwipeableDrawer
                    key={modal.id}
                    anchor="bottom"
                    open={modal.open || false}
                    onClose={this.actionHandler(modal.id, 'cancel')}
                    onOpen={this.drawerOpenHandler}
                    transitionDuration={this.props.dialogTransitionDuration || 200}
                    className="kk-modality-bottom-drawer"
                    classes={{
                        paper: this.props.classes.drawerPaper, ...this.props.drawerClasses,
                    }}
                >
                    {Boolean(hideDrawerAnchor !== true) && <DrawerAnchor/>}
                    {this.getContact(modal)}
                </SwipeableDrawer>);
            });
        } else {
            return modalList.map((modal) => {
                return (<Dialog
                    key={modal.id}
                    transitionDuration={this.props.dialogTransitionDuration || 200}
                    open={modal.open || false}
                    onClose={this.actionHandler(modal.id, 'cancel')}
                    classes={this.props.dialogClasses}
                    {...modal.dialogProps}
                >
                    {this.getContact(modal)}
                </Dialog>);
            });
        }
    }

    private getContact(modal: IModal) {
        return <>
            {modal.title && (
                <DialogTitle>{modal.title}</DialogTitle>
            )}
            {modal.description && (
                <DialogContent>
                    <DialogContentText>{modal.description}</DialogContentText>
                </DialogContent>
            )}
            <DialogActions>
                {Boolean(modal.cancelText) &&
                <Button color="secondary" {...modal.cancelProps} onClick={this.actionHandler(modal.id, 'cancel')}>
                    {modal.cancelText}
                </Button>}
                {Boolean(modal.confirmText) &&
                <Button color="primary" {...modal.confirmProps} onClick={this.actionHandler(modal.id, 'confirm')}>
                    {modal.confirmText}
                </Button>}
                {this.getButtonsContent(modal)}
            </DialogActions>
        </>;
    }

    private getButtonsContent(modal: IModal) {
        if (!modal.buttons || modal.buttons.length === 0) {
            return null;
        }
        return modal.buttons.map((button, key) => {
            return (
                <Button key={key} {...button.props} onClick={this.actionHandler(modal.id, button.action)}>
                    {button.text}
                </Button>
            );
        });
    }

    private newConfirmDialogHandler = (modal: IModal) => {
        const {modalList, queueSize} = this.state;
        modal.open = false;
        if (modalList.length > queueSize) {
            this.actionHandler(modalList[0].id, 'cancel')();
        }
        if (modal.force) {
            modalList.push(modal);
        } else {
            modalList.unshift(modal);
        }
        const id = modal.id;
        this.setState({
            modalList,
        }, () => {
            const modalListClone = this.state.modalList;
            const index = findIndex(modalListClone, {id});
            if (index > -1) {
                modalListClone[index].open = true;
                this.setState({
                    modalList: modalListClone,
                });
            }
        });
    };

    private actionHandler = (id: number, action: 'confirm' | 'cancel' | string) => () => {
        const {modalList} = this.state;
        if (modalList.length === 0) {
            return;
        }
        const index = findIndex(modalList, {id});
        if (index === -1) {
            return;
        }
        const modal = modalList[index];
        try {
            modal.resolve(action);
        } catch (e) {
            modal.reject(e);
        }

        if (modal.cb) {
            try {
                modal.cb(action)
            } catch (e) {
                console.warn(e);
            }
        }

        let preventClose = false;
        if (action === 'cancel') {
            preventClose = false;
        } else if (action === 'confirm' && modal.confirmPreventClose) {
            preventClose = true;
        } else if (modal.buttons) {
            const btn = find(modal.buttons, {action});
            if (btn && btn.preventClose && btn.action === action) {
                preventClose = true;
            }
        }
        modalList[index].open = preventClose;
        this.setState({
            modalList,
        }, () => {
            if (!preventClose) {
                this.confirmService.removeListener(modal.id);
                setTimeout(() => {
                    const modalListClone = this.state.modalList;
                    const index2 = findIndex(modalListClone, {id});
                    if (index2 === -1) {
                        return;
                    }
                    modalListClone.splice(index, 1);
                    this.setState({
                        modalList: modalListClone,
                    });
                }, (this.props.dialogTransitionDuration || 200) + 1);
            }
        });
    };

    private drawerOpenHandler = () => {
        //
    };
};

export default withMobileDialog<IOwnProps>({breakpoint: 'xs'})(withStyles(styles)(Modality));