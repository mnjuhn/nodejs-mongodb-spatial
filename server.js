app.post("/api/findEvents", function(req, res){

  // get user id from session
  searchRadius = req.body.radius;
  var session = { '_id': req.body.sessionID }
  sessModel.findOne(session)
    .exec(function (err, sess) {
      var errorObj = {};
      if (err) {
        errorObj['Error'] = err;
        res.send(errorObj);
      } else if (!sess) {
        errorObj['Error'] = "No such session exists!";
        res.send(errorObj);
      }

      // otherwise add event on sessions user id
      else {
        // get user's geo location and compare it to events geo location
        var u_id = {'_id': sess['userID']};
        usersModel.findOne(u_id)
          .exec(function(err, user) {
          var errorObj = {};
          if (err) {
            errorObj['Error'] = err;
            res.send(errorObj);
          } else if (!user) {
            errorObj['Error'] = "No such user exists! Please re-login!";
            res.send(errorObj);
          }
          // get user's geocode location and do a geocode search on radius km from location of puser
          else {
            var radians = searchRadius / 6371;
            eventsModel.find({ location: { $geoWithin: { $centerSphere: [ [user.location.coordinates[0],
              user.location.coordinates[1]], radians ]}}}).exec(function(err, events) {
              var errorObj = {};
              if (err) {
                console.log(err);
                errorObj['Error'] = err;
                res.send(errorObj);
              } else {
                console.log(events);
                res.send(events);
              }
            });
          }

        });
      }

    });

});
