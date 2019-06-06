import Slack from 'react-native-slack-webhook';

const LogManagerApi = (title, text) => {
    return (
        new Slack('https://hooks.slack.com/services/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')
            .post(title),
        new Slack('https://hooks.slack.com/services/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')
            .post(text)
    )
}

const LogManagerLogin = (title, text, textLog) => {
    return (
        new Slack('https://hooks.slack.com/services/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')
            .post(title),
        new Slack('https://hooks.slack.com/services/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')
            .post(text),
        new Slack('https://hooks.slack.com/services/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')
            .post(textLog)
    )
}

const LogManagerMessage = (title, text, textLog) => {
    return (
        new Slack('https://hooks.slack.com/services/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')
            .post(title),
        new Slack('https://hooks.slack.com/services/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')
            .post(text),
        new Slack('https://hooks.slack.com/services/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')
            .post(textLog)
    )
}

const LogManagerPersonal = (title, text, textLog) => {
    return (
        new Slack('https://hooks.slack.com/services/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')
            .post(title),
        new Slack('https://hooks.slack.com/services/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')
            .post(text),
        new Slack('https://hooks.slack.com/services/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')
            .post(textLog)
    )
}

const LogManagerStatistical = (title, text, textLog) => {
    return (
        new Slack('https://hooks.slack.com/services/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')
            .post(title),
        new Slack('https://hooks.slack.com/services/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')
            .post(text),
        new Slack('https://hooks.slack.com/services/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')
            .post(textLog)
    )
}

const LogManagerStore = (title, text, textLog) => {
    return (
        new Slack('https://hooks.slack.com/services/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')
            .post(title),
        new Slack('https://hooks.slack.com/services/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')
            .post(text),
        new Slack('https://hooks.slack.com/services/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')
            .post(textLog)
    )
}

const LogCustomerApi = (title, text, textLog) => {
    return (
        new Slack('https://hooks.slack.com/services/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')
            .post(title),
        new Slack('https://hooks.slack.com/services/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')
            .post(text),
        new Slack('https://hooks.slack.com/services/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')
            .post(textLog)
    )
}

const LogCustomerLogin = (title, text, textLog) => {
    return (
        new Slack('https://hooks.slack.com/services/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')
            .post(title),
        new Slack('https://hooks.slack.com/services/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')
            .post(text),
        new Slack('https://hooks.slack.com/services/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')
            .post(textLog)
    )
}

const LogCustomerOrder = (title, text, textLog) => {
    return (
        new Slack('https://hooks.slack.com/services/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')
            .post(title),
        new Slack('https://hooks.slack.com/services/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')
            .post(text),
        new Slack('https://hooks.slack.com/services/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')
            .post(textLog)
    )
}

const LogCustomerStore = (title, text, textLog) => {
    return (
        new Slack('https://hooks.slack.com/services/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')
            .post(title),
        new Slack('https://hooks.slack.com/services/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')
            .post(text),
        new Slack('https://hooks.slack.com/services/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')
            .post(textLog)
    )
}

const LogCustomerMessage = (title, text, textLog) => {
    return (
        new Slack('https://hooks.slack.com/services/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')
            .post(title),
        new Slack('https://hooks.slack.com/services/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')
            .post(text),
        new Slack('https://hooks.slack.com/services/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')
            .post(textLog)
    )
}

const LogCustomerPersonal = (title, text, textLog) => {
    return (
        new Slack('https://hooks.slack.com/services/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')
            .post(title),
        new Slack('https://hooks.slack.com/services/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')
            .post(text),
        new Slack('https://hooks.slack.com/services/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')
            .post(textLog)
    )
}

const LogManagerCustomer = (title, text, textLog) => {
    return (
        new Slack('https://hooks.slack.com/services/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')
            .post(title),
        new Slack('https://hooks.slack.com/services/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')
            .post(text),
        new Slack('https://hooks.slack.com/services/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')
            .post(textLog)
    )
}

const LogManagerEmployee = (title, text, textLog) => {
    return (
        new Slack('https://hooks.slack.com/services/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')
            .post(title),
        new Slack('https://hooks.slack.com/services/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')
            .post(text),
        new Slack('https://hooks.slack.com/services/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')
            .post(textLog)
    )
}

const LogManagerOrder = (title, text, textLog) => {
    return (
        new Slack('https://hooks.slack.com/services/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')
            .post(title),
        new Slack('https://hooks.slack.com/services/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')
            .post(text),
        new Slack('https://hooks.slack.com/services/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')
            .post(textLog)
    )
}

export {
    LogManagerApi,
    LogManagerCustomer,
    LogManagerEmployee,
    LogManagerLogin,
    LogManagerMessage,
    LogManagerPersonal,
    LogManagerStatistical,
    LogManagerStore,
    LogCustomerApi,
    LogCustomerLogin,
    LogCustomerOrder,
    LogCustomerStore,
    LogManagerOrder,
    LogCustomerMessage,
    LogCustomerPersonal
}
