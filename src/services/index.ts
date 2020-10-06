import {ButtonProps} from '@material-ui/core/Button';
import {DialogProps} from '@material-ui/core/Dialog';
import {clone, merge} from 'lodash';

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

interface IListener {
    resolve: any;
    reject: any;
    cb?: any;
    dialog: IModalOptions;
    id: number;
}

export default class ModalityService {
    public static getInstance() {
        if (!this.instance) {
            this.instance = new ModalityService();
        }

        return this.instance;
    }

    private static instance: ModalityService;
    private uniqueId: number;
    private readonly listeners: { [key: number]: IListener; };
    private newConfirmHandler: ((dialog: IModal) => void) | null;
    private readonly defaultOptions: IModalOptions;

    private constructor() {
        this.uniqueId = 0;
        this.listeners = {};
        this.newConfirmHandler = null;

        this.defaultOptions = {
            cancelText: 'Cancel',
            confirmText: 'Confirm',
        };
    }

    public open(options: IModalOptions, cb?: (action: 'confirm' | 'cancel' | string) => void): Promise<'confirm' | 'cancel' | string> {
        const data = merge(clone(this.defaultOptions), clone(options));
        this.uniqueId++;
        const id = this.uniqueId;
        (data as IModal).id = id;
        let internalResolve: any = null;
        let internalReject: any = null;
        const promise: Promise<'confirm' | 'cancel' | string> = new Promise((resolve, reject) => {
            internalResolve = resolve;
            internalReject = reject;
        });
        (data as IModal).resolve = internalResolve;
        (data as IModal).reject = internalReject;
        (data as IModal).cb = cb;
        this.listeners[id] = {
            dialog: data,
            id,
            reject: internalReject,
            resolve: internalResolve,
            cb,
        };
        if (this.newConfirmHandler) {
            this.newConfirmHandler(data as IModal);
        }
        return promise;
    }

    public setNewConfirmListener(fn: any) {
        this.newConfirmHandler = fn;
    }

    public removeListener(id: number) {
        delete this.listeners[id];
    }
}