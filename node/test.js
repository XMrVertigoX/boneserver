var pwm = require('./pwmControl2.js');

pwm.enablePWM('P9_14');
pwm.enablePWM('P9_16');

pwm.writePWM('P9_14', {duty: 0.5});

console.log(pwm.readPWM('P9_14'));
console.log(pwm.readPWM('P9_16'));
