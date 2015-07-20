/* Management for all the apps */

var EventFilter = require('admobilize-eventfilter-sdk').EventFilter;



var r = require('request');
var fs = require('fs');

var runningList = [];

module.exports = {
  runningList: runningList,
  list: listApps,
  start: startApp,
  stop: stopApp,
  restart: restartApp,
  install: installApp,
  update: updateApp,
  uninstall: uninstallApp,
  clearList: clearAppList,
  messageHandler: messageHandler,
  dataHandler: dataHandler
};

function messageHandler(msg){
  log('Message Event Message Handled');
  // Parse Messages Sent From Apps Here
}

function dataHandler(data){
  log('Service>Manager.dataHandler', data);
  // Parse and Direct Data sent from Apps
  // Send to API as deemed necessary
  // <--- Filter here
  var filteredData = [];
  var f = new
  
}

function clearAppList(){
  Matrix.db.remove({'activeApplication': { $exists: true }}, {multi: true});
}

function updateApp(){

}

function listApps() {
	//  server list = truth, this is temp

}

function startApp(name, cb) {
  // actually start app here

  if (_.isUndefined(name)){
    return cb(new Error('Need to declare name'));
  }

  var child = require('child_process').fork('./apps/' + name + '.matrix/app.js');
  console.log('start app'.blue, name, child.pid);
  runningList.push(child);

  Matrix.db.insert({ activeApplication : { name: name, pid: child.pid }});

  child.on('message', function(m) {
    console.log('app->' + name + ' [M] :', m);
    if ( m.type === 'data-point'){
      Matrix.events.emit('app-data', m);
    } else {
      Matrix.events.emit('app-message', m)
    }
  });

  // kick off scripts
  child.send({ init : true });

  child.on('close', function(code, number){
    log('Close:', code, number);
  });
  child.on('exit', function(code, number){
    log('Exit:', code, number);
  });
  child.on('error', function(err){
    console.error('Error', err);
  });
  cb(null, child);
}

function stopApp(id) {
  console.log('STOP!'.red);

  if ( parseInt(id) === id ){
    return require('child_process').exec('kill '+ id );
  } else {
    log('stop %s', id)
    //handle string
    //
    Matrix.db.find({ 'activeApplication.name' : id} , function(err, resp){
     if (err) console.log(err);
     var pids = _.pluck(resp, 'activeApplication.pid');
     var  cmd = 'kill ' + pids.join(' ');
     log(cmd);
     var kill = require('child_process').exec(cmd);
     Matrix.db.remove({ 'activeApplication.pid': { $in : pids }});

   })
  }

}


function restartApp() {

}

function installApp() {

}

function uninstallApp() {

}