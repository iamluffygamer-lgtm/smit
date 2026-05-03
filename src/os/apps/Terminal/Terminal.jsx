// src/os/apps/Terminal/Terminal.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useWindowStore } from '../../store/windowStore';
import { appRegistry } from '../appRegistry';
import { commands } from './commands';
import { loadState, saveState } from '../../system/persistence';
import { tokens } from '../../styles/tokens';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: tokens.colors.bgSurface,
        color: tokens.colors.textSecondary,
        fontFamily: tokens.typography.fontMono,
        fontSize: '13px',
        padding: '12px',
        overflow: 'hidden',
        boxSizing: 'border-box',
    },
    output: {
        flex: 1,
        overflowY: 'auto',
        whiteSpace: 'pre-wrap',
        marginBottom: '8px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
    },
    line: {
        lineHeight: '1.5',
        wordBreak: 'break-all',
    },
    inputLine: {
        display: 'flex',
        alignItems: 'center',
    },
    prompt: {
        color: tokens.colors.accent,
        marginRight: '8px',
        fontWeight: 'bold',
    },
    input: {
        flex: 1,
        backgroundColor: 'transparent',
        border: 'none',
        color: tokens.colors.textPrimary,
        fontFamily: 'inherit',
        fontSize: 'inherit',
        outline: 'none',
        caretColor: tokens.colors.accent,
    }
};

export const Terminal = () => {
    // Load history from persistence on mount
    const [history, setHistory] = useState(() => {
        const saved = loadState();
        if (saved && saved.terminalHistory && Array.isArray(saved.terminalHistory)) {
            return saved.terminalHistory;
        }
        return [
            'Welcome to Smit OS Terminal.',
            'Type "help" to see available commands.',
            ''
        ];
    });

    const [inputValue, setInputValue] = useState('');
    const [cmdHistory, setCmdHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);

    const openWindow = useWindowStore(state => state.openWindow);
    const inputRef = useRef(null);
    const outputRef = useRef(null);
    const saveRef = useRef(null);

    // Save history to persistence whenever it changes
    useEffect(() => {
        if (saveRef.current) clearTimeout(saveRef.current);
        saveRef.current = setTimeout(() => {
            saveState({ terminalHistory: history.slice(-300) });
        }, 1500);
        return () => clearTimeout(saveRef.current);
    }, [history]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [history]);

    const handleContainerClick = () => {
        inputRef.current?.focus();
    };

    const executeCommand = (cmdString) => {
        const trimmed = cmdString.trim();
        if (!trimmed) {
            setHistory(prev => [...prev, `visitor@smit-os:~$`]);
            return;
        }

        setHistory(prev => [...prev, `visitor@smit-os:~$ ${cmdString}`]);

        const [cmdName, ...args] = trimmed.split(/\s+/);
        const command = commands.find(c => c.name === cmdName);

        if (command) {
            const api = {
                print: (text) => setHistory(prev => [...prev, text]),
                clear: () => setHistory([]),
                openWindow: openWindow,
                getApps: () => appRegistry
            };

            try {
                command.execute({ args, api, commands });
            } catch (err) {
                setHistory(prev => [...prev, `Error executing command: ${err.message}`]);
            }
        } else {
            setHistory(prev => [...prev, `Command not found: ${cmdName}. Type "help" for list.`]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            executeCommand(inputValue);
            setCmdHistory(prev => [...prev, inputValue]);
            setHistoryIndex(-1);
            setInputValue('');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (cmdHistory.length > 0) {
                const newIndex = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
                setHistoryIndex(newIndex);
                setInputValue(cmdHistory[newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex !== -1) {
                const newIndex = historyIndex + 1;
                if (newIndex >= cmdHistory.length) {
                    setHistoryIndex(-1);
                    setInputValue('');
                } else {
                    setHistoryIndex(newIndex);
                    setInputValue(cmdHistory[newIndex]);
                }
            }
        }
    };

    return (
        <div style={styles.container} onClick={handleContainerClick} className="terminal-container">
            <style dangerouslySetInnerHTML={{__html: `
                .terminal-container ::-webkit-scrollbar { display: none; }
            `}} />
            <div style={styles.output} ref={outputRef}>
                {history.map((line, i) => (
                    <div key={i} style={styles.line}>{line}</div>
                ))}
            </div>
            <div style={styles.inputLine}>
                <span style={styles.prompt}>visitor@smit-os:~$</span>
                <input
                    ref={inputRef}
                    style={styles.input}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    autoFocus
                />
            </div>
        </div>
    );
};