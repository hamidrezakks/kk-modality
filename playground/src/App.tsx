import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import {Modality, ModalityService} from './lib'

import './App.css';

function Timer() {
    const [time, setTime] = useState(0);
    useEffect(() => {
        const timeout = setTimeout(() => {
            setTime(time + 1);
        }, 1000);
        return () => {
            clearTimeout(timeout);
        };
    }, [time]);

    return <span>{time}</span>;
}


const openWithPromiseHandler = () => {
    ModalityService.getInstance().open({
        title: 'Confirm',
        description: 'Description',
        cancelText: 'Cancel',
        cancelProps: {
            variant: 'contained',
        },
        confirmText: 'Ok',
        confirmProps: {
            variant: 'contained',
        },
        buttons: [{
            action: 'open_another',
            text: 'Open Another',
            props: {
                variant: 'contained',
            }
        }]
    }).then((res) => {
        console.log(res);
        if (res === 'open_another') {
            ModalityService.getInstance().open({
                title: 'Confirm 2',
                description: 'Description 2',
                confirmText: 'Confirm 2',
                force: true,
            });
        }
    });
};

const openWithCallbackHandler = () => {
    ModalityService.getInstance().open({
        title: 'Confirm',
        description: 'Description',
        cancelText: 'Cancel',
        cancelProps: {
            variant: 'outlined',
        },
        confirmText: 'Ok',
        confirmProps: {
            variant: 'outlined',
        },
        buttons: [{
            action: 'show_timer',
            text: <div>Show Timer</div>,
            preventClose: true,
            props: {
                variant: 'outlined',
            }
        }]
    }, (res) => {
        console.log(res);
        if (res === 'show_timer') {
            ModalityService.getInstance().open({
                title: 'Timer',
                description: <Timer/>,
                confirmText: 'Confirm 2',
                force: true,
            });
        }
    });
};

const App: React.FC = () => {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <div className="button-container">
                    <button onClick={openWithPromiseHandler}>Open Promise</button>
                    <button onClick={openWithCallbackHandler}>Open With Callback</button>
                </div>
            </header>
            <Modality hideDrawerAnchor={false} dialogTransitionDuration={200} queueSize={5}/>
        </div>
    );
}

export default App;
