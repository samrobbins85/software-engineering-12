var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('This is stock taking');
});

router.post('/addTray', function(req, res, next){
  /*
    Inputs:
      tray : A JSON object representing the tray. Contains its contents and desired position
    Returns:
      Whether this action completed successfully or not.
  */
  res.send('This is adding trays');
}); 

router.post('/editTray', function(req, res, next){
  /*
    Inputs:
      tray : A JSON object representing the tray. Contains its contents and position
    Returns:
      Whether this action completed successfully or not.
  */
  res.send('This is editing trays');
}); 

router.post('/removeTray', function(req, res, next){
  /*
    Inputs:
      pos : A tuple containing position of tray to delete.
    Returns:
      Whether this action completed successfully or not.
  */
  res.send('This is removing trays');
});

router.post('/moveTray', function(req, res, next){
  /*
  To begin with just move tray within bay.
    Inputs:
      pos1 : A tuple containing position of tray to move
      pos2 : A tuple containing position of target position to move to
    Returns:
      Whether this action completed successfully or not.
  */
  res.send('This is moving trays');
});  

module.exports = router;
