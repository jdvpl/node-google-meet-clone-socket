var MyApp = (function () {
  function init(uid, mid) {
    aevent_process_for_signaling_server();
  }
  var socket = null;
  function aevent_process_for_signaling_server() {
    socket = io.connect();
    socket.on("connect", () => {
      alert("socket connected to client side");
    });
    socket.on("con");
  }
  return {
    _init: function (uid, mid) {
      init(uid, mid);
    },
  };
})();
