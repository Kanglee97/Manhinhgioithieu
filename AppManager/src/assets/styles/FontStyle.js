import Layout from './Layout';
const xs = 8;
const xsp = 10;
const sm = 12;
const smp = 14;
const md = 16;
const mdp = 18;
const lg = 20;
const lgp = 22;
const xl = 24;
const xlp = 26;

const mainFont = 'Helvetica';
const largeText = Layout.isSmallDevice ? lg : xl;
const bigText = Layout.isSmallDevice ? md : lg;
const mdText = Layout.isSmallDevice ? sm : md;
const smallText = Layout.isSmallDevice ? xs : sm;
const miniText = xs;

export default {
    xsp,
    smp,
    mdp,
    lgp,
    xlp,
    mainFont,
    bigText,
    mdText,
    smallText,
    miniText,
    largeText
}