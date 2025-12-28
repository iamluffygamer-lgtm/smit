export const commands = [
    {
        name: 'help',
        description: 'List available commands',
        usage: 'help',
        execute: ({ api, commands }) => {
            api.print('Available commands:');
            commands.forEach(cmd => {
                api.print(`  ${cmd.name.padEnd(12)} - ${cmd.description}`);
            });
        }
    },
    {
        name: 'open',
        description: 'Open an application',
        usage: 'open <appId>',
        execute: ({ args, api }) => {
            const appId = args[0];
            if (!appId) {
                api.print('Usage: open <appId>');
                api.print('Available apps:');
                api.getApps().forEach(app => {
                    api.print(`  ${app.id}`);
                });
                return;
            }

            const apps = api.getApps();
            const appExists = apps.some(app => app.id === appId);

            if (appExists) {
                api.print(`Opening ${appId}...`);
                api.openWindow(appId);
            } else {
                api.print(`Error: App "${appId}" not found.`);
            }
        }
    },
    {
        name: 'about',
        description: 'Display information about Smit OS',
        usage: 'about',
        execute: ({ api }) => {
            api.print('Smit OS v1.0.0');
            api.print('A browser-based operating system portfolio.');
            api.print('Built with React, Zustand, and Vanilla JS logic.');
        }
    },
    {
        name: 'whoami',
        description: 'Display current user info',
        usage: 'whoami',
        execute: ({ api }) => {
            api.print('visitor@smit-os');
            api.print('Role: Guest / Recruiter / Developer');
        }
    },
    {
        name: 'contact',
        description: 'Display contact information',
        usage: 'contact',
        execute: ({ api }) => {
            api.print('Contact Information:');
            api.print('  Email:    contact@smit-os.dev');
            api.print('  GitHub:   github.com/smit-os');
            api.print('  LinkedIn: linkedin.com/in/smit-os');
        }
    },
    {
        name: 'clear',
        description: 'Clear the terminal output',
        usage: 'clear',
        execute: ({ api }) => {
            api.clear();
        }
    }
];
