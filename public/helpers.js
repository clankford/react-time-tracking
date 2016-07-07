Window.helpers = (function () {
    function renderElapsedString(elapsed, runningSince) {
        let totalElapsed = elapsed;
        if (runningSince) {
        totalElapsed += Date.now() - runningSince;
        }
        return millisecondsToHuman(totalElapsed);
    }
})();