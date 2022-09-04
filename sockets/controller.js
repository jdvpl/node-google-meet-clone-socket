const socketController = (socket) => {
  let userConnections = [];

  socket.on("userconnect", (payload) => {
    // leyendo los mensajes
    let other_users = userConnections.filter(
      (p) => p.meeting_id == data.meetingid
    );
    console.log(other_users);
    userConnections.push({
      connectionId: socket.id,
      user_id: payload.displayName,
      meeting_id: payload.meetingid,
    });
    other_users.forEach((v) => {
      socket.to(v.connectionId).emit("inform_others_about_me", {
        other_user_id: data.displayName,
        connId: socket.id,
      });
    });
  });
};

module.exports = {
  socketController,
};
