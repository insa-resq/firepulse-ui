module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-coverage')
        ],
        reporters: ['progress'],
        coverageReporter: {
            dir: require('path').join(__dirname, './coverage/resq-firepulse-ui'),
            subdir: '.',
            reporters: [
                { type: 'html' },
                { type: 'text-summary' }
            ]
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        singleRun: true,
        restartOnFileChange: true,
        // DEFAULT BROWSER (For Development)
        browsers: ['Chrome'],
        // CUSTOM LAUNCHERS (For CI)
        customLaunchers: {
            ChromeHeadlessCI: {
                base: 'ChromeHeadless',
                flags: [
                    '--no-sandbox',
                    '--disable-gpu',
                    '--disable-dev-shm-usage',
                    '--disable-software-rasterizer',
                    '--headless=new'
                ]
            }
        }
    });
};
