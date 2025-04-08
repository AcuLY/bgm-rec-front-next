import './nord.css'

function getCssVar(name) {
    return getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim()
}

export const nordTheme = {
    common: {
        bodyColor: '#f2f4f8',

        primaryColor: getCssVar('--nord8'),
        primaryColorHover: getCssVar('--nord7'),
        primaryColorPressed: getCssVar('--nord10'),
        primaryColorSuppl: getCssVar('--nord8'),

        borderRadius: '8px',
    },
    Layout: {
        textColor: getCssVar('--nord3'),
    },
    Input: {
        placeholderColor: '#999999',
        color: getCssVar('--nord6'),
        colorFocus: getCssVar('--nord5'),
    },
    Switch: {
        railColor: '#999',
    },
    Divider: {
        color: getCssVar('--nord4'),
        textColor: getCssVar('--nord3'),
    }
};

export const nordDarkTheme = {
    common: {
        bodyColor: getCssVar('--nord0'),

        primaryColor: getCssVar('--nord8'),
        primaryColorHover: getCssVar('--nord7'),
        primaryColorPressed: getCssVar('--nord10'),
        primaryColorSuppl: getCssVar('--nord8'),

        borderRadius: '8px',
    },
    Layout: {
        textColor: getCssVar('--nord6'),
    },
    Switch: {
        railColorActive: getCssVar('--nord9'),
    },
    Divider: {
        color: getCssVar('--nord3'),
        textColor: getCssVar('--nord6'),
    }
}
