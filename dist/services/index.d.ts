/// <reference types="react" />
import { ButtonProps } from '@material-ui/core/Button';
import { DialogProps } from '@material-ui/core/Dialog';
export interface IButtonAttr {
    props?: ButtonProps;
    text: string | React.ReactNode;
    action: string;
    preventClose?: boolean;
}
export interface IModalOptions {
    dialogProps?: DialogProps;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    cancelText?: string | React.ReactNode | boolean;
    cancelProps?: ButtonProps;
    confirmText?: string | React.ReactNode | boolean;
    confirmProps?: ButtonProps;
    confirmPreventClose?: boolean;
    buttons?: IButtonAttr[];
    force?: boolean;
}
export interface IModal extends IModalOptions {
    id: number;
    cancelProps?: any;
    confirmProps?: any;
    resolve: any;
    reject: any;
    cb?: any;
    open?: boolean;
}
export default class ModalityService {
    static getInstance(): ModalityService;
    private static instance;
    private uniqueId;
    private readonly listeners;
    private newConfirmHandler;
    private readonly defaultOptions;
    private constructor();
    open(options: IModalOptions, cb?: (action: 'confirm' | 'cancel' | string) => void): Promise<'confirm' | 'cancel' | string>;
    setNewConfirmListener(fn: any): void;
    removeListener(id: number): void;
}
