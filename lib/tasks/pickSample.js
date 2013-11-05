var DEFAULT_SAMPLE = { path: 'samples/buzzer.mp3' };

module.exports = function(context, next) {
    context.sample = context.samples ? context.samples[Math.floor(Math.random() * context.samples.length)] : DEFAULT_SAMPLE;
    next();
}