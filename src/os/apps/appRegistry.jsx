import React from 'react';
import { IconAbout } from '../icons/IconAbout';
import { IconProjects } from '../icons/IconProjects';
import { IconTerminal } from '../icons/IconTerminal';
import { IconContact } from '../icons/IconContact';
import { IconSettings } from '../icons/IconSettings';
import { IconPaint } from '../icons/IconPaint';
import { IconFiles } from '../icons/IconFiles';
import { IconMusic } from '../icons/IconMusic';
import { IconBrowser } from '../icons/IconBrowser';
import { IconNotes } from '../icons/IconNotes';

export const appRegistry = [
    {
        id: 'about',
        name: 'About Me',
        icon: <IconAbout />,
        defaultSize: { width: 600, height: 500 }
    },
    {
        id: 'projects',
        name: 'Projects',
        icon: <IconProjects />,
        defaultSize: { width: 900, height: 600 }
    },
    {
        id: 'terminal',
        name: 'Terminal',
        icon: <IconTerminal />,
        defaultSize: { width: 700, height: 450 }
    },
    {
        id: 'contact',
        name: 'Contact',
        icon: <IconContact />,
        defaultSize: { width: 400, height: 500 }
    },
    {
        id: 'settings',
        name: 'Settings',
        icon: <IconSettings />,
        defaultSize: { width: 500, height: 450 }
    },
    {
        id: 'paint',
        name: 'Paint',
        icon: <IconPaint />,
        defaultSize: { width: 800, height: 600 }
    },
    {
        id: 'files',
        name: 'Files',
        icon: <IconFiles />,
        defaultSize: { width: 700, height: 500 }
    },
    {
        id: 'music',
        name: 'Music',
        icon: <IconMusic />,
        defaultSize: { width: 400, height: 600 }
    },
    {
        id: 'browser',
        name: 'Browser',
        icon: <IconBrowser />,
        defaultSize: { width: 1000, height: 600 }
    },
    {
        id: 'notes',
        name: 'Notes',
        icon: <IconNotes />,
        defaultSize: { width: 500, height: 500 }
    },
    {
        id: 'games',
        name: 'Games',
        icon: <span>▶</span>,
        defaultSize: { width: 700, height: 520 },
        defaultPosition: { x: 160, y: 80 }
    }
];
