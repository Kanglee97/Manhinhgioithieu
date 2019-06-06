import qs from 'querystring';
import { Linking, Platform } from 'react-native';


async function sendEmail(to, subject, body, options = {}) {
    const { cc, bcc } = options;

    let url = `mailto:${to}`;

    // Create email link query
    const query = qs.stringify({
        subject: subject,
        body: body,
        cc: cc,
        bcc: bcc
    });

    if (query.length) {
        url += `?${query}`;
    }

    // check if we can use this link
    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
        throw new Error('Email URL can not be handled');
    }

    return Linking.openURL(url);
}

async function sendSMS(to, body) {

    let url = `sms:${to}`;

    // Create email link query
    const query = qs.stringify({
        body: body
    });

    if (query.length) {
        url += `?${query}`;
    }

    // check if we can use this link
    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
        throw new Error('SMS URL can not be handled');
    }

    return Linking.openURL(url);
}



function findWithAttr(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}

function filterLevel(value) {
    switch (value) {
        case 'copper_pack':
            return 'Free Zone';
        case 'gold_pack':
            return 'Gold Zone';
        case 'platinum_pack':
            return 'Platinum Zone';
        case 'diamond_pack':
            return 'Diamond Zone';
    }
}

export {
    sendEmail,
    sendSMS,
    findWithAttr,
    filterLevel
}