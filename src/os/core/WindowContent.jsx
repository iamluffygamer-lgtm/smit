import React from 'react';
import Terminal from '../apps/Terminal';
import About from '../apps/About';
import Projects from '../apps/Projects';
import Contact from '../apps/Contact';
import Browser from '../apps/Browser';
import Paint from '../apps/Paint';
import Settings from '../apps/Settings';
import Files from '../apps/Files';
import Music from '../apps/Music';
import Notes from '../apps/Notes';
import Games from '../apps/Games';
import AppStore from '../apps/AppStore';
import Calculator from '../apps/Calculator';
import Pomodoro from '../apps/Pomodoro';
import CodeEditor from '../apps/CodeEditor';
import JsonFormatter from '../apps/JsonFormatter';
import ApiTester from '../apps/ApiTester';
import JwtDecoder from '../apps/JwtDecoder';
import RegexTester from '../apps/RegexTester';
import ColorPicker from '../apps/ColorPicker';
import CssGradient from '../apps/CssGradient';
import Kanban from '../apps/Kanban';
import QrGenerator from '../apps/QrGenerator';
import AsciiArt from '../apps/AsciiArt';
import PixelCanvas from '../apps/PixelCanvas';
import SmitTV from '../apps/SmitTV';
// Lazy loading or direct mapping
const apps = {
    'terminal': Terminal,
    'about': About,
    'projects': Projects,
    'contact': Contact,
    'browser': Browser,
    'paint': Paint,
    'settings': Settings,
    'files': Files,
    'music': Music,
    'notes': Notes,
    'games': Games,
    'appStore': AppStore,
    'calculator': Calculator,
    'pomodoro': Pomodoro,
    'codeEditor': CodeEditor,
    'jsonFormatter': JsonFormatter,
    'apiTester': ApiTester,
    'jwtDecoder': JwtDecoder,
    'regexTester': RegexTester,
    'colorPicker': ColorPicker,
    'cssGradient': CssGradient,
    'kanban': Kanban,
    'qrGenerator': QrGenerator,
    'asciiArt': AsciiArt,
    'pixelCanvas': PixelCanvas,
    'smitTV': SmitTV,
};

export const WindowContent = ({ appId, intentData }) => {
    const Component = apps[appId];

    if (!Component) {
        return (
            <div style={{ padding: 20, color: '#666' }}>
                App not found or not implemented: {appId}
            </div>
        );
    }

    return <Component intentData={intentData} />;
};
