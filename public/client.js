window.client = (function () {
  function getTimers(opts) {
    $.ajax({ // eslint-disable-line no-undef
      url: '/api/timers',
      data: null,
      method: 'get',
      dataType: 'json',
      cache: false,
      success: opts.success,
      error: opts.error,
    });
  }

  function createTimer(opts) {
    $.ajax({ // eslint-disable-line no-undef
      url: '/api/timers',
      data: opts.data,
      method: 'post',
      dataType: 'json',
      cache: false,
      success: opts.success,
      error: opts.error,
    });
  }

  function updateTimer(opts) {
    $.ajax({ // eslint-disable-line no-undef
      url: '/api/timers',
      data: opts.data,
      method: 'put',
      dataType: 'json',
      cache: false,
      success: opts.success,
      error: opts.error,
    });
  }

  function startTimer(opts) {
    $.ajax({ // eslint-disable-line no-undef
      url: '/api/timers/start',
      data: opts.data,
      method: 'post',
      dataType: 'json',
      cache: false,
      success: opts.success,
      error: opts.error,
    });
  }

  function stopTimer(opts) {
    $.ajax({ // eslint-disable-line no-undef
      url: '/api/timers/stop',
      data: opts.data,
      method: 'post',
      dataType: 'json',
      cache: false,
      success: opts.success,
      error: opts.error,
    });
  }

  function deleteTimer(opts) {
    $.ajax({ // eslint-disable-line no-undef
      url: '/api/timers',
      method: 'delete',
      data: opts.data,
      dataType: 'json',
      cache: false,
      success: opts.success,
      error: opts.error,
    });
  }

  const client = {
    getTimers: getTimers,
    createTimer: createTimer,
    updateTimer: updateTimer,
    startTimer: startTimer,
    stopTimer: stopTimer,
    deleteTimer: deleteTimer,
  };

  return client;
})();
