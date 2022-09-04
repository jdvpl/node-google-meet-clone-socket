var AppProcess = function () {
  var serverProcess;
  var peers_connection_ids = [];
  var peers_connection = [];
  function _init(SDP_function, my_connid) {
    serverProcess = SDP_function;
    my_connection_id = my_connid;
  }
  let iceConfiguration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };
  function setConnection(connId) {
    var connection = new RTCPeerConnection(iceConfiguration);
    connection.onnegotiationneeded = async function (event) {
      await setOffer(connId);
    };
    connection.onicecandidate = function (event) {
      if (event.candidate) {
        serverProcess(
          JSON.stringify({ icecandidate: event.candidate }),
          connId
        );
      }
    };
    connection.ontrack = function (event) {};
    peers_connection_ids[connId] = connId;
    peers_connection[connId] = connection;
  }
  async function setOffer(connId) {
    var connection = peers_connection[connId];
    var offer = await connection.createOffer();
    await connection.setLocalDescription(offer);
    serverProcess(
      JSON.stringify({
        offer: connection.localDescription,
      }),
      connId
    );
  }
  return {
    setNewConnection: async function (connId) {
      await setConnection(connId);
    },
    init: async function (SDP_function, my_connid) {
      await _init(SDP_function, my_connid);
    },
  };
};

var MyApp = (function () {
  var socket = null;
  var user_id = "";
  var meeting_id = "";
  function init(uid, mid) {
    user_id = uid;
    meeting_id = mid;
    aevent_process_for_signaling_server();
  }
  function aevent_process_for_signaling_server() {
    socket = io.connect();
    var SDP_function = function (data, to_connid) {
      socket.emit("SDPProcces", {
        message: data,
        to_connid: to_connid,
      });
    };
    socket.on("connect", () => {
      if (socket.connected) {
        AppProcess.init(SDP_function, socket.id);
        if (user_id != "" && meeting_id != "") {
          socket.emit("userconnect", {
            displayName: user_id,
            meetingid: meeting_id,
          });
        }
      }
    });

    socket.on("inform_others_about_me", ({ other_user_id, connId }) => {
      addUser(other_user_id, connId);
      AppProcess.setNewConnection(connId);
    });
  }

  const addUser = (user_id, connId) => {
    let newDivId = $("#otherTemplate").clone();
    newDivId = newDivId.attr("id", connId).addClass("other");
    newDivId.find("h2").text(user_id);
    newDivId.find("video").attr("id", "v_" + connId);
    newDivId.find("audio").attr("id", "a_" + connId);
    newDivId.show();
    $("#divUsers").append(newDivId);
  };
  return {
    _init: function (uid, mid) {
      init(uid, mid);
    },
  };
})();
