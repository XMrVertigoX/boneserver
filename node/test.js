var pwm = require('./pwmControl')

//pwm.enable('P9_14');
//pwm.disable('P9_14');

//pwm.enable('P9_16');
pwm.disable('P9_16');

//pwm.enable('P8_13');
pwm.disable('P8_13');

//pwm.enable('P8_19');
//pwm.disable('P8_19');

pwm.set('P8_13', {run: 0});

//pwm.set('P9_14', {frequency: 1});
pwm.set('P9_16', {run: 0});

console.log(pwm.get('P9_16'));
