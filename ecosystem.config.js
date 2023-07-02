module.exports = {
    apps: [
      {
        name: 'tester-ktf',
        cwd: '/var/www/tester.kyivtypefoundry.com',
        script: 'npm',
        args: 'run prod',
      },
      // optionally a second project
    ],
  };