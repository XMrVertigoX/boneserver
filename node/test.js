var pwm = require('./pwmControl')

pwm.enable('P9_14');
pwm.set('P9_14', {frequency: 1, duty: 0.5});

console.log(pwm.get('P9_14'));
