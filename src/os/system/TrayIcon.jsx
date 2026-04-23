import React from 'react';
import { tokens } from '../styles/tokens';

const styles = {
    container: {
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        borderRadius: '6px',
        transition: 'background-color 0.1s',
        fontSize: '16px',
        userSelect: 'none',
    },
    hover: {
        backgroundColor: tokens.colors.borderSubtle,
    }
};

export const TrayIcon = ({ link }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const handleClick = () => {
        window.open(link.url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div
            style={{
                ...styles.container,
                ...(isHovered ? styles.hover : {})
            }}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            title={link.name}
        >
            {link.icon}
        </div>
    );
};
