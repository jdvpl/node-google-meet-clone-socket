var MyApp = (function () {
  function init(uid, mid) {
    alert(`user: ${uid} meetingid ${mid}`);
  }
  return {
    _init: function (uid, mid) {
      init(uid, mid);
    },
  };
})();
