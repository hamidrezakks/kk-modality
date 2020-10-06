import React from 'react';
import { DialogClassKey, DrawerClassKey } from '@material-ui/core';
import { ClassNameMap } from "@material-ui/styles/withStyles/withStyles";
import { WithMobileDialog } from "@material-ui/core/withMobileDialog/withMobileDialog";
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
declare type IProps = IWithStyle & IOwnProps;
declare const _default: React.ComponentType<(Pick<Pick<IProps, "queueSize" | "fullScreen" | "width" | "drawerClasses" | "dialogClasses" | "dialogTransitionDuration" | "hideDrawerAnchor"> & import("@material-ui/core").StyledComponentProps<"drawerPaper">, "queueSize" | "classes" | "drawerClasses" | "dialogClasses" | "dialogTransitionDuration" | "hideDrawerAnchor" | "innerRef"> & Partial<WithMobileDialog>) | (Pick<React.PropsWithChildren<Pick<IProps, "queueSize" | "fullScreen" | "width" | "drawerClasses" | "dialogClasses" | "dialogTransitionDuration" | "hideDrawerAnchor"> & import("@material-ui/core").StyledComponentProps<"drawerPaper">>, "queueSize" | "classes" | "drawerClasses" | "dialogClasses" | "dialogTransitionDuration" | "hideDrawerAnchor" | "children" | "innerRef"> & Partial<WithMobileDialog>)>;
export default _default;
